import { json, error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_QOS_SUPABASE_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

// POST /api/signup
// Writes to quietly-os.qos_signups via service role, then fires a plaintext notification
// email to TIG via Graph API. Per brief + feedback_private_feedback_channels.md:
// TIG is the primary recipient, BCC guard doesn't apply.
//
// Important (CF Workers gotcha): fire-and-forget promises are CANCELLED when the Response
// returns. We either await the notification synchronously (what this file does) or pass it
// through `platform.context.waitUntil()`. Synchronous await is simpler and the latency is
// ~1s, acceptable for a landing-page signup.

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
		console.error('[signup] QOS_SUPABASE_SERVICE_ROLE_KEY not configured in platform.env');
		return json({ error: 'Signups temporarily unavailable. Try again shortly.' }, { status: 503 });
	}

	const supabase = createClient(PUBLIC_QOS_SUPABASE_URL, serviceKey, {
		auth: { persistSession: false, autoRefreshToken: false }
	});

	const userAgent = request.headers.get('user-agent') ?? null;
	const clientIp = getClientAddress();
	const ipHash = await sha256(clientIp + serviceKey);

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

	// Send TIG notification synchronously so we can report the outcome.
	// Failures here do NOT fail the signup response... the row is already saved.
	const notification = await notifyTig(platform, data).catch((err) => {
		console.error('[signup] tig notification error', err);
		return { ok: false, reason: String(err).slice(0, 300) } as const;
	});

	return json({ ok: true, id: data.id, notification });
};

async function notifyTig(
	platform: App.Platform | undefined,
	row: { id: string; email: string; created_at: string; consent: boolean }
): Promise<{ ok: boolean; reason?: string }> {
	const tenantId = platform?.env?.MSGRAPH_TENANT_ID;
	const clientId = platform?.env?.MSGRAPH_CLIENT_ID;
	const clientSecret = platform?.env?.MSGRAPH_CLIENT_SECRET;
	const senderUpn = platform?.env?.MSGRAPH_USER_EMAIL ?? 'noreply@quietlyworking.org';
	const to = platform?.env?.TIG_NOTIFICATION_EMAIL ?? 'tig@quietlyworking.org';
	const projectRef = 'bgwjuajxdkdnvmljqkqk';

	if (!tenantId || !clientId || !clientSecret) {
		return { ok: false, reason: 'graph-creds-missing' };
	}

	// 1. Acquire access token
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
		const bodyText = await tokenRes.text().catch(() => '');
		return { ok: false, reason: `token-${tokenRes.status}: ${bodyText.slice(0, 200)}` };
	}
	const tokenJson = (await tokenRes.json()) as { access_token?: string };
	const accessToken = tokenJson.access_token;
	if (!accessToken) return { ok: false, reason: 'token-missing-in-response' };

	// 2. Send mail
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
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				message: {
					subject: `QOS signup: ${row.email}`,
					body: { contentType: 'Text', content: plainBody },
					toRecipients: [{ emailAddress: { address: to } }]
				},
				saveToSentItems: true
			})
		}
	);

	if (!mailRes.ok) {
		const bodyText = await mailRes.text().catch(() => '');
		return { ok: false, reason: `sendmail-${mailRes.status}: ${bodyText.slice(0, 200)}` };
	}

	return { ok: true };
}

async function sha256(input: string): Promise<string> {
	const encoder = new TextEncoder();
	const hash = await crypto.subtle.digest('SHA-256', encoder.encode(input));
	return Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}
