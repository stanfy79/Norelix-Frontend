// src/services/api/webhook.service.ts
import { Webhook } from '../../features/webhooks/types';

export const getWebhooks = async (): Promise<Webhook[]> => {
  // API call
  return [];
};

export const createWebhook = async (url: string, events: string[]): Promise<Webhook> => {
  // API call
  return {} as Webhook;
};