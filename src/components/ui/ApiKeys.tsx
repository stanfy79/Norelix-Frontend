import React from 'react'
import { DataContext } from '../../context/Context'
import { Copy, KeyIcon, TriangleAlert } from 'lucide-react'
import { showSuccessToast } from "./custom-toast";
import { Skeleton } from './skeleton';

export const ApiComponent: React.FC = () => {
  const { businessData, apiLoading } = React.useContext(DataContext) as {
    businessData: any;
    apiLoading?: {
      business: boolean;
      txHistory: boolean;
      analytics: boolean;
    };
  }
  const isBusinessLoading = Boolean(apiLoading?.business);

  return (
    <div className='bg-white space-y-7 p-4 w-full min-w-[250px] h-full'>
      <div className="flex justify-between items-center w-full">
        <h2 className="jetbrains-mono flex gap-2 font-extrabold text-black">
          <KeyIcon color='#10b981' />
          API Keys
        </h2>
        <button className="bg-black text-[12px] text-white flex items-center p-2 jetbrains-mono brutal disabled:bg-slate-400"
          disabled={!businessData?.businessId ?
            true :
            false
          }>Generate New</button>
      </div>

      <div className="w-full flex flex-col gap-2">
        {isBusinessLoading ? (
          <>
            <div className="bg-slate-100 border-2 border-slate-200/50 p-2 flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-9 w-9" />
            </div>

            <div className="bg-slate-100 border-2 border-slate-200/50 p-2 flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-9 w-9" />
            </div>
          </>
        ) : businessData?.businessId ?
          (<>
            <div className="bg-slate-100 border-2 border-slate-200/50 p-2 flex justify-between items-center">
              <div className="text-[10px]">
                <p className="text-slate-600">PUBLIC API KEY</p>
                <p className="text-black">{businessData?.apiKey.substring(0, 10)}•••{businessData?.apiKey.substring(businessData?.apiKey.length - 6)}</p>
              </div>
              <div className="text-[#10b981] hover:bg-slate-300 bg-slate-200 p-2 rounded-[5px]"
                onClick={() => {
                  navigator.clipboard.writeText(businessData?.apiKey);
                  showSuccessToast("API key copied to clipboard!");
                }}>
                <Copy />
              </div>
            </div>

            <div className="bg-slate-100 border-2 border-slate-200/50 p-2 flex justify-between items-center">
              <div className="text-[10px]">
                <p className="text-slate-600">PRODUCTION SECRET KEY</p>
                <p className="text-black">Secret_Key•••dvns</p>
              </div>
              <div className="text-[#10b981] hover:bg-slate-300 bg-slate-200 p-2 rounded-[5px]">
                <Copy />
              </div>
            </div>
          </>) :
          (<div className='items-center justify-center flex-col flex'>
            <p className='text-[16px] py-7 text-slate-500'>You Need To Create A Business</p>
          </div>)}

      </div>
      <div className="text-[10px] text-amber-900 font-bold bg-orange-200/40 flex p-2 gap-3">
        <TriangleAlert size={50} />
        <span className='jetbrains-mono'>
          Never share your secret keys in client-side code or public repositories. Use environment variables for secure storage.
        </span>
      </div>
    </div>
  )
}

export default ApiComponent
