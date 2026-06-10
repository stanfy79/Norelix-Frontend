// src/pages/ApiKeys.tsx
import React, { useContext, useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import ApiComponent from '../../components/ui/ApiKeys';
import CodeCard from '../../components/ui/CodeCard';
import { ChartNoAxesCombined, CircleGauge, Files, Webhook } from 'lucide-react';
import Footer from '../../components/common/Footer';
import { DataContext } from '../../context/Context';
import { showSuccessToast } from '../../components/ui/custom-toast';
import { Skeleton } from '../../components/ui/skeleton';

const WidgetSDK: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Widget SDK');
  const { businessData, apiLoading } = useContext(DataContext) as {
    businessData: any;
    apiLoading?: {
      business: boolean;
      txHistory: boolean;
      analytics: boolean;
    };
  }
  const isBusinessLoading = Boolean(apiLoading?.business);

  return (
    <div className='flex flex-col overflow-hidden'>
      <Header />
      <div className="flex flex-1 overflow-hidden bg-[#f1f5f9]">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab} />


        <main className='mt-16 md:mt-0 p-6 w-full space-y-12 jetbrains-mono overflow-y-auto h-screen no-scrollbar'>
          <div className="w-full">
            <h1 className='text-black text-[20px] md:text-2xl font-bold jetbrains-mono'>Developer Ecosystem</h1>
            <div className="flex flex-wrap w-full justify-between items-center gap-2">
              <span className="text-[12px] mt-5 jetbrains-mono">Manage your cryptographic keys and configure real-time event listeners.</span>
              <div className="inline-flex items-center gap-2 bg-emerald-400/30 px-2 py-1 text-[10px] text-[#064e3b] jetbrains-mono">
                <span className="inline-flex h-2.5 w-2.5  bg-emerald-400" />
                L2 OPTIMISED
              </div>
            </div>
          </div>

          <div className="">
            {isBusinessLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-44" />
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-bold">{businessData?.businessName}</h2>
                <div className="flex flex-wrap gap-2 text-[12px] py-2 items-center font-semibold">
                  <p>Business ID</p>
                  <div className='flex flex-nowrap items-center gap-x-2'>
                    <span className="bg-slate-200 border-2 border-slate-200/50 px-[8px] text-slate-600 rounded-md">{businessData?.businessId}</span>
                    <span className='text-slate-500 hover:text-slate-800 cursor-pointer' onClick={() => {
                      navigator.clipboard.writeText(businessData?.businessId);
                      showSuccessToast("Business ID copied to clipboard!");
                    }}><Files size={15} /></span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-between gap-8 sm:gap-4 flex-col sm:flex-row">

            <ApiComponent />

            <CodeCard
              fileName="JAVASCRIPT SDK"
              size='300px'
              code={`  // Initialize Norelix
  const nexus = new Norelix('nx_live...');
  // Process encrypted payment
  await nexus.payments.create({
    amount: 5000,
    currency: 'USD',
    metadata: { order_id: '#101' }
  });
`}
            />
          </div>

          <div className="w-full bg-white p-4">
            <div className="">
              <h2 className="flex gap-3 text-black font-extrabold jetbrains-mono">
                <Webhook color='#10b981' />
                Widget Endpoints
              </h2>
              <span className="text-[12px]">Configure your app to receive real-time notifications about events.</span>
            </div>

            <div className="flex flex-col-reverse sm:flex-row mt-5 gap-3 gap-y-5">
              <div className="space-y-6 w-full">
                <div className="">
                  <span className="text-[12px] text-slate-600 font-bold">WIDGET ENDPOINT URL</span>
                  <div className="flex gap-3 justify-between">
                    <div className="w-full bg-slate-100 border-2 border-slate-200/50 text-[12px] text-black p-2 jetbrains-mono overflow-x-auto">https://api.merchant.com/v1/webhooks/nexus</div>
                    <button className="brutal bg-[#10b981] text-white text-[12px] font-bold p-2 w-16 jetbrains-mono">
                      Copy
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <span className="text-[12px]">Configure you app to recieve payment via Norelix. Copy the code template below into your application.</span>
                  <div className="inline-flex items-center justify-between w-full">
                    <p className="text-[12px] font-bold text-slate-600">WIDGET SETUP</p>
                  </div>
                  <div className="bg-slate-100 border-2 border-slate-200/50 w-full">
                    <CodeCard fileName='Widget SDK'
                      size='100%'
                      code={`//Store your keys in an object
Const payload = {
apikey: <YOUR API KEY>
secretkey: <YOUR SECRET KEY>
amount: <AMOUNT TO PAY>
orderId: <YOUR ORDER ID>
}

//Iframe widget snippet
<iframe
src="https://nexksupay.com/api/v1/<payload>"
allow="clipboard-write" title="Norelix Checkout"
loading="lazy"style="width:100%;
height:100%; border:none;
"></iframe>
`} />
                  </div>
                </div>
              </div>

              <div className="p-2 w-full max-w-[200px] space-y-3">
                <p className="text-[12px] font-bold text-slate-600">NETWORK INSIGHTS</p>
                <div className="flex gap-3 items-center">
                  <div className="bg-emerald-400/20 w-10 h-10 justify-center items-center inline-flex">
                    <ChartNoAxesCombined color='#10b981' />
                  </div>
                  <div className="">
                    <p className="text-[10px]">TOTAL PAYMENT</p>
                    <span className='text-black text-[14px] font-bold'>21</span>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="bg-emerald-400/20 w-10 h-10 justify-center items-center inline-flex">
                    <CircleGauge color='#10b981' />
                  </div>
                  <div className="">
                    <p className="text-[10px]">DELIVERY RATE</p>
                    <span className='text-black text-[14px] font-bold'>99.98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default WidgetSDK;
