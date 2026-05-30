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

    <aside className='w-full fixed sm:static sm:w-64 min-w-40 h-auto sm:h-screen border-r top-0 border-[#d5d8de] p-2 sm:p-4 flex flex-col justify-between bg-[#ffffff] z-20'>
      <div className='sm:space-y-6'>
        <Link to='/' className='hidden sm:block'>
          <div className="flex items-center gap-3 text-black">
            <span className="inline-flex h-10 w-10 items-center justify-center bg-emerald-500 text-lg font-semibold shadow-lg shadow-emerald-500/30">
              N
            </span>
            <div>
              <p className="text-sm font-extrabold tracking-[0.20em] uppercase text-slate-700">Norelix</p>
            </div>
          </div>
        </Link>

        <nav className="md:space-y-1 flex flex-row justify-between sm:flex-col">
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
                className={`w-full flex items-center sm:space-x-3 px-3 py-2.5 rounded text-xs font-medium  transition relative ${isActive
                  ? 'text-[#10b981] bg-[#10b981]/5 sm:border-l-2 border-[#10b981]'
                  : 'text-gray-400 hover:text-[#10b981] hover:bg-gray-100 border-l-2 border-transparent'
                  } `}
              >
                <Icon size={16} className='hidden sm:block' />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className='pt-[30px] mb-4  px-5 hidden sm:block'>
        <Link to='/upgrade' className="w-full text-center border  border-[#10b981]/40 hover:border-[#10b981]/40 text-[#25ae93dc] hover:bg-[#cbefef] py-2 text-xs rounded-sm transition uppercase tracking tracking-wider">
          Upgrade Plan
        </Link>
      </div>
    </aside>

  );
};
export default Sidebar;