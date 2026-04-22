import { json, error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_QOS_SUPABASE_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

// POST /api/signup
// Writes to quietly-os.qos_signups via service role, then fires a plaintext notification
// email to TIG via Graph API. Per brief + feedback_private_feedback_channels.md:
// TIG is the primary recipient, BCC guard doesn't apply.

export const POST: RequestHandler = async ({ request, platform, getClientAddress }) => {
	let body: { email?: string; consent?: boolean; honeypot?: string; notes?: string };
	try {
		body = await request.json();
	} catch {
		throw error(400, 'invalid json');
	}

	const { email, consent, honeypot, notes } = body;

	// Spam check: honeypot must be empty.
	if (honeypot && honeypot.trim().length > 0) {
		// Return 200 so bots don't learn. Silently drop.
		return json({ ok: true });
	}

	// Validation.
	if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json({ error: 'Please enter a valid email address.' }, { status: 400 });
	}
	if (email.length > 254) {
		return json({ error: 'That email looks too long.' }, { status: 400 });
	}

	const serviceKey = platform?.env?.QOS_SUPABASE_SERVICE_ROLE_KEY;
	if (!serviceKey) {
		// Runtime secret missing. Log to console (visible in CF Workers logs), return generic.
		console.error('[signup] QOS_SUPABASE_SERVICE_ROLE_KEY not configured in platform.env');
		return json({ error: 'Signups temporarily unavailable. Try again shortly.' }, { status: 503 });
	}

	const supabase = createClient(PUBLIC_QOS_SUPABASE_URL, serviceKey, {
		auth: { persistSession: false, autoRefreshToken: false }
	});

	const userAgent = request.headers.get('user-agent') ?? null;
	const clientIp = getClientAddress();
	const ipHash = await sha256(clientIp + (platform?.env?.QOS_SUPABASE_SERVICE_ROLE_KEY ?? ''));

	const { data, error: insertError } = await supabase
		.from('qos_signups')
		.upsert(
			{
				email: email.toLowerCase().trim(),
				source: 'quietlyos.org',
				consent: consent === false ? false : true,
				notes: notes ?? null,
				user_agent: userAgent,
				ip_hash: ipHash
			},
			{ onConflict: 'email', ignoreDuplicates: false }
		)
		.select('id, email, created_at, consent')
		.single();

	if (insertError) {
		console.error('[signup] supabase insert failed', insertError);
		return json({ error: 'Something went sideways saving your signup. Try again?' }, { status: 500 });
	}

	// Fire-and-forget TIG notification. Don't block response on email delivery.
	notifyTig(platform, data).catch((err) => {
		console.error('[signup] tig notification failed (non-blocking)', err);
	});

	return json({ ok: true, id: data.id });
};

async function notifyTig(
	platform: App.Platform | undefined,
	row: { id: string; email: string; created_at: string; consent: boolean }
) {
	const tenantId = platform?.env?.MSGRAPH_TENANT_ID;
	const clientId = platform?.env?.MSGRAPH_CLIENT_ID;
	const clientSecret = platform?.env?.MSGRAPH_CLIENT_SECRET;
	const senderUpn = platform?.env?.MSGRAPH_USER_EMAIL ?? 'noreply@quietlyworking.org';
	const to = platform?.env?.TIG_NOTIFICATION_EMAIL ?? 'tig@quietlyworking.org';
	const projectRef = 'bgwjuajxdkdnvmljqkqk';

	if (!tenantId || !clientId || !clientSecret) {
		console.warn('[signup] Graph API creds not configured; skipping TIG notification');
		return;
	}

	const tokenRes = await fetch(
		`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				scope: 'https://graph.microsoft.com/.default',
				grant_type: 'client_credentials'
			})
		}
	);

	if (!tokenRes.ok) {
		throw new Error(`graph token fetch failed: ${tokenRes.status}`);
	}
	const { access_token } = (await tokenRes.json()) as { access_token: string };

	const supabaseRowUrl = `https://supabase.com/dashboard/project/${projectRef}/editor?table=qos_signups&filter=id.eq.${row.id}`;

	const plainBody = [
		`New QOS signup.`,
		``,
		`Email:     ${row.email}`,
		`Timestamp: ${row.created_at}`,
		`Consent:   ${row.consent ? 'yes' : 'no'}`,
		`Source:    quietlyos.org`,
		``,
		`Supabase row: ${supabaseRowUrl}`
	].join('\n');

	const mailRes = await fetch(
		`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderUpn)}/sendMail`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: {
					subject: `QOS signup: ${row.email}`,
					body: { contentType: 'Text', content: plainBody },
					toRecipients: [{ emailAddress: { address: to } }]
				},
				saveToSentItems: false
			})
		}
	);

	if (!mailRes.ok) {
		const text = await mailRes.text();
		throw new Error(`graph sendMail failed: ${mailRes.status} ${text}`);
	}
}

async function sha256(input: string): Promise<string> {
	const encoder = new TextEncoder();
	const hash = await crypto.subtle.digest('SHA-256', encoder.encode(input));
	return Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}
