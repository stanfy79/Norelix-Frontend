// src/lib/privy.ts
import { PrivyProvider } from '@privy-io/react-auth';

export const PrivyConfig = {
  // Privy configuration
  appId: import.meta.VITE_PRIVY_APP_ID,
  clientId: import.meta.VITE_PRIVY_CLIENT_ID
};