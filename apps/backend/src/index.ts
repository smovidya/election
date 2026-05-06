import { createApp } from '@repo/api';
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';
import { env } from 'cloudflare:workers';

const app = createApp(CloudflareAdapter, {
	isDev: env.ENVIRONMENT === 'dev',
	DB: env.DB,
	SITE_URL: env.FRONTEND_DOMAIN || 'https://localhost:4321',
	GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
	JWT_SECRET: env.JWT_SECRET,
}).compile();

export default app;
