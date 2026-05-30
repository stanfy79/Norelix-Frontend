import { usePrivy } from '@privy-io/react-auth';
import React from 'react';
import { useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';

import {
  User,
  Shield,
  Grid,
  CreditCard,
  Terminal,
  Settings as SettingsIcon,
  Laptop,
  Upload,
  LogOut,
} from 'lucide-react';
import { FullScreenLoader } from '../../components/ui/fullscreen-loader';

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
}

const Settings: React.FC = () => {
  const { ready, authenticated, logout } = usePrivy();
  const [activeTab, setActiveTab] = useState<string>('Settings')

  const [profile, setProfile] = useState<Profile>({
    firstName: 'Alexander',
    lastName: 'Vance',
    email: 'alexander@Norelix.io',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!ready) {
    return <FullScreenLoader />;
  }

  return (
    <div className='flex flex-col overflow-hidden  text-slate-100' >
      <Header />

      <div className='flex flex-1 overflow-hidden bg-[#f8fcfdd7]'>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab} />

        <main className='flex-1  pl-[70px] overflow-y-auto h-screen no-scrollbar'>


          <div className='mb-4 '>
            <h1 className='text-lg font-semibold tracking-tight text-[#2c2b2b] '>Account Settings</h1>
            <p className=' text-xs text-gray-400  '>Manage your cryptographic identity and merchant organisation parameters.</p>
          </div>

          <div className='space-y-6'>
            <section className='border-t border-[#f8fcfdd7]pt-6'>
              {authenticated ?
                (<button className="p-3 bg-red-500 flex"
                  onClick={() => logout()}><LogOut /> Logout</button>) :
                (<button className="p-3 bg-red-500"
                >You Need To Login</button>)
              }
            </section>

          </div>


        </main>
      </div>

    </div>

  );
};

export default Settings;
