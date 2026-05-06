import { createApp } from '@repo/api';
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';

const app = createApp(CloudflareAdapter).compile();

export default app;
