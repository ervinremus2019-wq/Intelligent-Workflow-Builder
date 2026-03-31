import { z } from 'zod';
import { insertSystemServiceSchema } from './schema';

const serviceSchema = z.object({
  id: z.number(),
  name: z.string(),
  size: z.string(),
  status: z.string(),
  icon: z.string(),
});

const serviceListSchema = z.array(serviceSchema);

export const api = {
  services: {
    list: {
      method: 'GET' as const,
      path: '/api/services',
      responses: { 200: serviceListSchema },
    },
    create: {
      method: 'POST' as const,
      path: '/api/services',
      body: insertSystemServiceSchema,
      responses: { 201: serviceSchema },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/services/:id',
      body: insertSystemServiceSchema.partial(),
      responses: { 200: serviceSchema },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/services/:id',
      responses: { 204: z.null() },
    },
    reset: {
      method: 'POST' as const,
      path: '/api/services/reset',
      responses: { 200: serviceListSchema },
    },
    recover: {
      method: 'POST' as const,
      path: '/api/services/recover',
      responses: { 200: serviceListSchema },
    },
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
