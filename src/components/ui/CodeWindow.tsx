import React from 'react';

interface CodeWindowProps {
  code: string;
  filename?: string;
}

const CodeWindow: React.FC<CodeWindowProps> = ({ code, filename = "NEXUS-SDK-V1.JS" }) => {
  return (
    <div className="mx-auto">
      {/* Main Container */}
      <div className="relative overflow-hidden bg-[#0b0e14] transition-all brutal">
        
        {/* Window Header */}
        <div className="flex items-center justify-between px-5 py-4">
          {/* MacOS Dots */}
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          
          {/* Optional Filename Badge */}
          <div className="rounded bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            {filename}
          </div>
        </div>

        {/* Code Content */}
        <div className="pb-8 pt-2">
          <pre className="overflow-x-auto font-mono text-sm leading-relaxed w-[270px] md:w-[450px]">
            <code className='text-slate-300'>
              {code}
            </code>
          </pre>
        </div>

        {/* Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
      </div>
    </div>
  );
};

export default CodeWindow;