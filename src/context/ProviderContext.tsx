import React, { useState } from "react";
import { DataContext } from "./Context";
import axios from "axios";
import {
  usePrivy,
  useSendTransaction as useSendTransactionEvm,
} from "@privy-io/react-auth";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/ui/custom-toast";
import { Navigate } from "react-router-dom";
import { useSendTx } from "../components/ui/SendTransactionEvm";

interface BusinessData {
  businessId: string;
  businessLogo: string;
  businessName: string;
  businessTag: string;
  description: string;
  apiKey: string;
}

interface CreateBusiness {
  businessName: string;
  description: string;
  businessLogo: string;
  tags: string;
}

interface BusinessSettingsUpdate {
  businessName?: string;
  businessTag?: string;
  description?: string;
  businessLogo?: string;
  statementDescriptor?: string;
  logoFile?: File | null;
  accountSettings?: Record<string, unknown>;
  notificationSettings?: Record<string, unknown>;
  securitySettings?: Record<string, unknown>;
  developerSettings?: Record<string, unknown>;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;
const USDC_ARBITRUM_SEPOLIA = import.meta.env.VITE_USDC_ADDRESS;

function ProviderContext({ children }: { children: React.ReactNode }) {
  const { ready, user, authenticated } = usePrivy();
  const { sendTransaction: sendTransactionEvm } = useSendTransactionEvm();

  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [settingsData, setSettingsData] =
    useState<BusinessSettingsUpdate | null>(null);
  const [txHistory, setTxHistory] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [walletBalances, setWalletBalances] = useState<any[]>([]);

  const [businessLoading, setBusinessLoading] = useState<boolean>(true);
  const [txHistoryLoading, setTxHistoryLoading] = useState<boolean>(false);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);

  const createBusiness = async (payload: CreateBusiness) => {
    if (!ready || !user?.id) return;

    try {
      const fullPayload = {
        ...payload,
        ownerId: user.id,
        ownerWallet: user?.wallet?.address,
      };
      const response = await axios.post(
        `${BASE_URL}/api/merchant/create-business`,
        fullPayload,
      );

      setBusinessData(response.data.data || null);
      return response;
    } catch (err) {
      console.error("Error creating business:", err);
      throw err;
    }
  };

  const getMerchantBusiness = async () => {
    if (!ready || !user?.id) {
      setBusinessLoading(false);
      return;
    }

    setBusinessLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/merchant/get-business-dashboard-info`,
        { headers: { "X-unique-id": user?.id } },
      );
      setBusinessData(response.data.data || null);
    } catch (error) {
      console.error("Error fetching business details:", error);
      setBusinessData(null);
    } finally {
      setBusinessLoading(false);
    }
  };

  const getBusinessPayments = async () => {
    if (!ready || !user?.id) return;

    setTxHistoryLoading(true);
    try {
      const business = await axios.get(
        `${BASE_URL}/api/merchant/get-business-dashboard-info`,
        { headers: { "X-unique-id": user?.id } },
      );

      if (!business?.data?.data?.businessId) {
        setTxHistory([]);
        return;
      }

      const payload = {
        businessId: business?.data.data.businessId,
      };

      const response = await axios.post(
        `${BASE_URL}/api/payment/txhistory`,
        payload,
      );

      setTxHistory(response.data.data || []);
    } catch (error) {
      console.error("Error fetching business tx history:", error);
      setTxHistory([]);
    } finally {
      setTxHistoryLoading(false);
    }
  };

  const getBusinessAnalytics = async () => {
    if (!businessData?.businessId) return;

    setAnalyticsLoading(true);
    try {
      const analysis = await axios.get(`${BASE_URL}/api/payment/analytics`, {
        headers: { "X-business-id": businessData.businessId },
      });

      setAnalyticsData(analysis.data.data || []);
    } catch (err) {
      console.error("Error fetching business analytics data:", err);
      setAnalyticsData(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const updateBusinessSettings = async (updates: BusinessSettingsUpdate) => {
    setSettingsData(updates);

    setBusinessData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        businessName: updates.businessName ?? prev.businessName,
        businessTag: updates.businessTag ?? prev.businessTag,
        description: updates.description ?? prev.description,
        businessLogo: updates.businessLogo ?? prev.businessLogo,
      };
    });

    const payload = {
      id: user?.id ?? "",
      businessName: updates.businessName ?? businessData?.businessName ?? "",
      businessTag: updates.businessTag ?? businessData?.businessTag ?? "",
      description: updates.description ?? businessData?.description ?? "",
      businessLogo: updates.businessLogo ?? businessData?.businessLogo ?? "",
    };

    const requestBody = updates.logoFile
      ? Object.entries(payload).reduce((formData, [key, value]) => {
          if (key === "businessLogo") {
            formData.append(key, updates.logoFile as File);
            return formData;
          }

          formData.append(key, value);
          return formData;
        }, new FormData())
      : payload;

    const response = await axios.put(
      `${BASE_URL}/api/merchant/update-business-info`,
      requestBody,
    );

    console.log("Updating business settings with:", updates);
    console.log("Updating business settings with:", response);
    return {
      ...updates,
      businessId: businessData?.businessId,
    };
  };

  const createNewSecretkey = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/merchant/create-new-secret-key`,
        {
          headers: {
            "X-unique-id": user?.id,
            "X-business-id": businessData?.businessId,
          },
        },
      );

      if (!response?.data?.secretKey) {
        console.error("Secret Key not found in response:");
        return;
      }

      showSuccessToast("New secret key generated successfully");

      return response.data.secretKey;
    } catch (error) {
      console.error(
        "Error fetching business details for secret key generation:",
        error,
      );
      return;
    }
  };

  const getWalletBalance = async () => {
    try {
      const wallet = ((user?.linkedAccounts || []).find(
        (account: any) => account?.type === "wallet"
      ) as any)?.address;

      if (!wallet) {
        console.warn("No wallet address found");
        return null;
      }

      const response = await axios.get(
        `${BASE_URL}/api/merchant/get-balances/${wallet.toLowerCase()}`,
      );

      setWalletBalances(response.data.data || []);
    } catch (err) {
      console.error("Error fetching wallet balances:", err);
      return null;
    }
  };

  const deleteBusiness = async () => {
    if (!ready || !user?.id) return;

    try {
      await axios.delete(`${BASE_URL}/api/merchant/delete-business`, {
        headers: {
          "X-unique-id": user?.id,
          "X-business-id": businessData?.businessId,
        },
      });
      setBusinessData(null);
      showSuccessToast("Business deleted successfully");
      <Navigate to="/overview" replace />;
    } catch (error) {
      console.error("Error deleting business:", error);
    }
  };


  const sendToken = useSendTx({
    sendTransactionEvm,
    user,
    ready,
    authenticated,
  });

  const handleSendTransactionEvm = async (to: string, amount: number) => {
    if (!to) {
      showErrorToast("Please enter a wallet address");
      return;
    }

    try {
      const txHash = await sendToken(
        to,
        amount,
        {
          type: "erc20",
          contractAddress: USDC_ARBITRUM_SEPOLIA as any,
          decimals: 6,
        },
        421614,
      );

      showSuccessToast("USDC transfer submitted. Check your wallet for confirmation.");
      return txHash;
    } catch (err) {
      showErrorToast("Failed to send transaction!");
      console.log("Error", err);
      throw err;
    }
  };

  React.useEffect(() => {
    if (ready) {
      getMerchantBusiness();
      getWalletBalance();
    }
  }, [ready, user?.id]);

  return (
    <DataContext.Provider
      value={{
        businessData,
        settingsData,
        txHistory,
        analyticsData,
        walletBalances,
        apiLoading: {
          business: businessLoading,
          txHistory: txHistoryLoading,
          analytics: analyticsLoading,
        },
        getBusinessPayments,
        getBusinessAnalytics,
        updateBusinessSettings,
        createNewSecretkey,
        deleteBusiness,
        createBusiness,
        handleSendTransactionEvm,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default ProviderContext;
