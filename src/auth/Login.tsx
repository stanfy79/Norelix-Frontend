import React from 'react'
import { usePrivy } from "@privy-io/react-auth";
import UserObject from "../components/layout/user-object";
import { FullScreenLoader } from '../components/ui/fullscreen-loader';

function Login() {
    const { ready, authenticated, logout, login } = usePrivy();
    if (!ready) {
        return <FullScreenLoader />;
    }


    return (
        <>
            {authenticated ? (
                <section className="w-full flex flex-col md:flex-row md:h-[calc(100vh-60px)]">
                    <div className="flex-grow overflow-y-auto h-full p-4 pl-8">
                        <button className="button" onClick={logout}>
                            Logout
                        </button>

                        <div>
                        </div>
                    </div>
                    <UserObject />
                </section>
            ) : (
                <section className="w-full flex flex-row justify-center items-center h-[calc(100vh-60px)] relative">
                    <img
                        src="./BG.svg"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <div className="z-10 flex flex-col items-center justify-center w-full h-full">
                        <div className="flex h-10 items-center justify-center rounded-[20px] border border-black px-6 text-lg text-black font-abc-favorit">
                            React Demo
                        </div>
                        <div className="text-center mt-4 text-black text-7xl font-medium font-abc-favorit leading-[81.60px]">
                            Starter repo
                        </div>
                        <div className="text-center text-black text-xl font-normal leading-loose mt-8">
                            Get started developing with Privy using our React starter repo
                        </div>
                        <button
                            className="bg-black text-brand-off-black mt-15 w-full max-w-md rounded-full px-4 py-2 hover:bg-gray-100 lg:px-8 lg:py-4 lg:text-xl"
                            onClick={() => {
                                login();
                                setTimeout(() => {
                                    (
                                        document.querySelector(
                                            'input[type="email"]'
                                        ) as HTMLInputElement
                                    )?.focus();
                                }, 150);
                            }}
                        >
                            Get started
                        </button>
                    </div>
                </section>
            )
            }
        </>
    )
}

export default Login
