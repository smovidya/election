import { createApp, CloudflareAdapter } from "@repo/api";

const app = createApp(CloudflareAdapter)
	.compile();

export default app;
