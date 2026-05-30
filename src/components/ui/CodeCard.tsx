import React from 'react';
import { showSuccessToast } from './custom-toast';
import { Copy } from 'lucide-react';

type CodeCardProps = {
  fileName: string;
  code: string;
  size: string;
};

const CodeCard = ({ fileName, code, size }: CodeCardProps) => {
  return (
    <div className={`relative sm:max-w-[${size}] md:max-w-[${size}] bg-slate-950/90 p-4 shadow-2xl border border-[#3a3f42]`}>
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-[#00ffae]">
          <span className="text-[10px] text-[#00ffae]">{">_"}</span>
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00ffae]">
          {fileName}
        </span>

        <div className="text-[#10b981] hover:bg-slate-700 bg-slate-800 cursor-pointer absolute right-5 p-2 rounded-[5px]"
          onClick={() => {
            navigator.clipboard.writeText(code);
            showSuccessToast("Sample code copied to clipboard!")
          }}>
          <Copy size={15} />
        </div>
      </div>

      <div className="rounded-sm">
        <pre className="">
          <code className='text-[10px] w-full font-mono leading-6 text-white overflow-x-auto bg-[#141414]'>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeCard;
