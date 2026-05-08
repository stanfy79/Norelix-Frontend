// src/features/payments/types.ts
export interface PaymentIntent {
  id: string;
  amount: string;
  currency: 'USDC';
  status: 'pending' | 'completed' | 'failed';
  merchantId: string;
  createdAt: Date;
}

export interface PaymentListResponse {
  payments: PaymentIntent[];
  total: number;
}