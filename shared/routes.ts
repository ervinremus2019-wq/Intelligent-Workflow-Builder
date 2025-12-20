import { z } from 'zod';
import { insertSystemServiceSchema, systemServices } from './schema';

export const api = {
  services: {
    list: {
      method: 'GET' as const,
      path: '/api/services',
      responses: {
        200: z.array(z.custom<typeof systemServices.$inferSelect>()),
      },
    },
    reset: {
      method: 'POST' as const,
      path: '/api/services/reset',
      responses: {
        200: z.array(z.custom<typeof systemServices.$inferSelect>()),
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
