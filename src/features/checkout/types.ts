// src/features/checkout/types.ts
export interface CheckoutSession {
  id: string;
  amount: string;
  currency: 'USDC';
  merchantId: string;
  status: 'pending' | 'paid' | 'expired';
}

export interface CheckoutConfig {
  amount: string;
  currency: 'USDC';
  successUrl: string;
  cancelUrl: string;
}