import { treaty } from '@elysia/eden';
import type { App } from '@repo/api';

export const api = treaty<App>(process.env.NEXT_PUBLIC_BACKEND_URL!);
