import React from 'react'
import { Link } from 'react-router-dom'
import {
  Grid,
  CreditCard,
  Terminal,
  Settings as SettingsIcon,
} from 'lucide-react';


type SidebarProps = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};
function Sidebar({
  activeTab,
  setActiveTab,
}: SidebarProps) {
  return (

    <aside className='w-64 min-w-40 h-screen border-r border-[#d5d8de] p-4 md:flex flex-col justify-between bg-[#ffffffab] hidden'>
      <div className='space-y-6'>
        <Link to='/'>
          <div className="flex items-center gap-3 text-black">
            <span className="inline-flex h-10 w-10 items-center justify-center bg-emerald-500 text-lg font-semibold shadow-lg shadow-emerald-500/30">
              N
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] uppercase text-slate-700">NeksuPay</p>
            </div>
          </div>
        </Link>
        <nav className="space-y-1">
          {[
            { name: 'Overview', url: '/overview', icon: Grid },
            { name: 'Payments', url: '/payments', icon: CreditCard },
            { name: 'Widget SDK', url: '/widget-sdk', icon: Terminal },
            { name: 'Settings', url: '/settings', icon: SettingsIcon },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <Link
                key={item.name}
                to={item.url}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-medium  transition relative ${isActive
                  ? 'text-[#10b981] bg-[#10b981]/5 border-l-2 border-[#10b981]'
                  : 'text-gray-400 hover:text-[#10b981] hover:bg-gray-100 border-l-2 border-transparent'
                  } `}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className='pt-[30px] mb-4  px-5 '>
        <Link to='/upgrade' className="w-full text-center border  border-[#10b981]/40 hover:border-[#10b981]/40 text-[#25ae93dc] hover:bg-[#cbefef] py-2 text-xs rounded-sm transition uppercase tracking tracking-wider">
          Upgrade Plan
        </Link>
      </div>
    </aside>

  );
};
export default Sidebar;