// src/services/api/payment.service.ts
import { PaymentIntent } from '../../features/payments/types';

export const getPayments = async (): Promise<PaymentIntent[]> => {
  // API call
  return [];
};

export const createPaymentIntent = async (amount: string): Promise<PaymentIntent> => {
  // API call
  return {} as PaymentIntent;
};
