import { usePrivy } from '@privy-io/react-auth';
import React from 'react';
import { useState } from 'react';
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


const CreateBusiness: React.FC = () => {
  const { authenticated } = usePrivy();


  return (
    <div className='flex flex-col overflow-hidden  text-slate-100' >

      <div className='flex flex-1 overflow-hidden bg-[#f8fcfdd7]'>
        <main className='flex-1  pl-[70px] overflow-y-auto h-screen no-scrollbar'>

          <div className='mb-4 '>
            <h1 className='text-lg font-semibold tracking-tight text-[#2c2b2b] '>Create Business</h1>
            <p className=' text-xs text-gray-400  '>Set up your business profile and manage your merchant information.</p>
          </div>
        </main>
      </div>

    </div>

  );
};

export default CreateBusiness;
