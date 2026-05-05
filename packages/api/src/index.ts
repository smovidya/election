import { Elysia } from 'elysia';
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker';

// well the declaration is just: export declare const CloudflareAdapter: ElysiaAdapter; 
export type Params = {};
type Adapter = typeof CloudflareAdapter;

export function createApp(adapter: Adapter, params: Params = {}) {
  const app = new Elysia({
    adapter
  })
    .get('/', () => ({ hello: 'Bun👋' }))
    .get('/car', () => "🐈🐈‍⬛😺😸🚗");

  return app;
}

export type App = ReturnType<typeof createApp>;
export { CloudflareAdapter };