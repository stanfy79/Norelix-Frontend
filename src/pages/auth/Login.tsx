import { Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Header from '../../components/common/Header';
import { usePrivy } from '@privy-io/react-auth';
import { FullScreenLoader } from '../../components/ui/fullscreen-loader';

const Login: React.FC = () => {

    const { ready, authenticated, login } = usePrivy();

    if (ready && authenticated) {
        return <Navigate to="/overview" replace />
    };

    if (!ready) {
        return <FullScreenLoader />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f6fafe] text-[#171c1f] font-sans antialiased selection:bg-emerald-500 selection:text-white">
            <div className="circuit-bg min-h-screen flex flex-col">

                <Header />

                <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10b981] opacity-20 blur-[128px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#006c49] opacity-20 blur-[96px] rounded-full pointer-events-none"></div>

                    <div
                        className="w-full max-w-[480px] p-8 relative z-10 rounded-sm bg-white/50 backdrop-blur-[8px] border-[1px]">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                            <span className="text-[12px] font-bold text-[#006c49] uppercase tracking-widest font-mono">
                                Protocol Secured
                            </span>
                        </div>

                        <h1 className="text-[25px] font-extrabold text-[#171c1f] leading-tight tracking-tight mb-2 jetbrains-mono">
                            Welcome to Norelix
                        </h1>
                        <p className="text-[#3c4a42] mb-8">
                            Access your cross-chain assets and technical dashboards.
                        </p>
                        <button
                            className="bg-black text-white text-[14px] w-full max-w-md brutal px-4 py-3 hover:bg-emerald-900 jetbrains-mono"
                            onClick={() => {
                                login();
                                setTimeout(() => {
                                    (
                                        document.querySelector(
                                            'input[type="email"]'
                                        ) as HTMLInputElement
                                    )?.focus();
                                }, 150);
                            }}>Login Using Privy
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Login;
