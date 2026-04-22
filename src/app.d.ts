declare global {
	namespace App {
		interface Platform {
			env?: {
				QOS_SUPABASE_SERVICE_ROLE_KEY?: string;
				MSGRAPH_TENANT_ID?: string;
				MSGRAPH_CLIENT_ID?: string;
				MSGRAPH_CLIENT_SECRET?: string;
				MSGRAPH_USER_EMAIL?: string;
				TIG_NOTIFICATION_EMAIL?: string;
			};
		}
	}
}

export {};
