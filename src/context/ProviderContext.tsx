import React, { useState } from "react";
import { DataContext } from "./Context";
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";

interface BusinessData {
  businessId: string;
  businessLogo: string;
  businessName: string;
  businessTag: string;
  description: string;
  apiKey: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

function ProviderContext({ children }: { children: React.ReactNode }) {
  const { ready, user } = usePrivy();
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [txHistory, setTxHistory] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [businessLoading, setBusinessLoading] = useState<boolean>(true);
  const [txHistoryLoading, setTxHistoryLoading] = useState<boolean>(false);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);

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

      const response = await axios.post(`${BASE_URL}/api/payment/txhistory`, payload);
      
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
      const analysis = await axios.get(`${BASE_URL}/api/payment/analytics`, {headers: { "X-business-id": businessData.businessId }});

      setAnalyticsData(analysis.data.data || []);
    } catch(err) {
        console.error("Error fetching business analytics data:", err);
        setAnalyticsData(null);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  React.useEffect(() => {
    if (ready) {
      getMerchantBusiness();
    }
  }, [ready, user?.id]);

  if (!ready) {
    return null;
  }

  return (
    <DataContext.Provider
      value={{
        businessData,
        txHistory,
        analyticsData,
        apiLoading: {
          business: businessLoading,
          txHistory: txHistoryLoading,
          analytics: analyticsLoading,
        },
        getBusinessPayments,
        getBusinessAnalytics,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default ProviderContext;
