import React, { useContext } from 'react'
import { DataContext } from '../../context/Context'
import { Copy, KeyIcon, TriangleAlert } from 'lucide-react'

export const ApiComponent: React.FC = () => {
  const { ApiKey } = React.useContext(DataContext) as {
    ApiKey: string
  }
  return (
    <div className='bg-white space-y-7 p-4 w-full min-w-[250px] h-full'>
      <div className="flex justify-between items-center w-full">
        <h2 className="jetbrains-mono flex gap-2 font-extrabold text-black">
          <KeyIcon color='#10b981' />
          API Keys
        </h2>
        <span className="bg-black text-[12px] text-white flex items-center p-2 jetbrains-mono brutal">Generate New</span>
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="bg-slate-100 border-2 border-slate-200/50 p-2 flex justify-between items-center">
          <div className="text-[10px]">
            <p className="text-slate-600">PUBLIC API KEY</p>
            <p className="text-black">Secret_Key.......dvns</p>
          </div>
          <div className="text-[#10b981] hover:bg-slate-300 p-2 rounded-[5px]">
            <Copy />
          </div>
        </div>

        <div className="bg-slate-100 border-2 border-slate-200/50 p-2 flex justify-between items-center">
          <div className="text-[10px]">
            <p className="text-slate-600">PRODUCTION SECRET KEY</p>
            <p className="text-black">Secret_Key.......dvns</p>
          </div>
          <div className="text-[#10b981] hover:bg-slate-300 p-2 rounded-[5px]">
            <Copy />
          </div>
        </div>

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
