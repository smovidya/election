import { Elysia } from 'elysia';
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';

// well the declaration is just: export declare const CloudflareAdapter: ElysiaAdapter; 
type ElysiaAdapter = typeof CloudflareAdapter;

export function createApp(adapter: ElysiaAdapter) {
  const app = new Elysia({
    adapter
  })
    .get('/', () => ({ hello: 'Bun👋' }));

  return app;
}

// this is so that @apps/backend wont depends on `elysia`
export { CloudflareAdapter };