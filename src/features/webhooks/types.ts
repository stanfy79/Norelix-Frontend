// src/features/webhooks/types.ts
export interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  createdAt: Date;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  createdAt: Date;
}