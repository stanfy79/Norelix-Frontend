import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyConfig } from './lib/privy';
import './index.css'
import './App.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'
          }
        },
        appearance: { walletChainType: "ethereum-and-solana" },
      }}
    >
    <App />
    </PrivyProvider>
  </StrictMode>,
)
