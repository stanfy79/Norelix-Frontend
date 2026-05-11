declare global {
  interface ImportMetaEnv {
    readonly VITE_CONTRACT_ADDRESS: string;
    readonly VITE_USDC_ADDRESS: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS;

export const USDC_ADDRESS =
  import.meta.env.VITE_USDC_ADDRESS;