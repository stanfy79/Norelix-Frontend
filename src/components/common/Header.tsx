import { usePrivy } from '@privy-io/react-auth'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'


function Header() {
    const location = useLocation().pathname;
    const paths = ['/overview', '/payments', '/settings', '/widget-sdk'];

    return (
        <>
            <header className={`fixed mx-auto ${paths.includes(location) ? 'hidden' : 'flex'} w-full items-center px-6 py-3 md:px-8 shadow-md backdrop-blur-[10px] bg-[#ffffff8e] z-20`}>
                <Link to='/'>
                    <div className="flex items-center gap-3 text-black">
                        <span className="inline-flex h-10 w-10 items-center justify-center bg-emerald-500 text-lg font-semibold shadow-lg shadow-emerald-500/30">
                            N
                        </span>
                        <div>
                            <p className="text-sm font-semibold tracking-[0.24em] uppercase text-slate-700">Norelix</p>
                        </div>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center ml-9 gap-5 text-[13px] text-black">
                    <Link to="#features" className="transition duration-200 hover:text-slate-900 hover:underline">Features</Link>
                    <Link to="#solutions" className="transition duration-200 hover:text-slate-900 hover:underline">Solutions</Link>
                    <Link to="#developers" className="transition duration-200 hover:text-slate-900 hover:underline">Developers</Link>
                    <Link to="#pricing" className="transition duration-200 hover:text-slate-900 hover:underline">Pricing</Link>
                </nav>

                <div className="hidden md:flex items-center gap-3 absolute right-9 md">
                    <Link to='/signin'>
                        <button className="px-4 py-2 text-[13px] text-black transition hover:font-bold hover:underline">
                            Login
                        </button>
                    </Link>
                    <Link to='/overview'>
                        <button className="text-[13px] font-semibold text-slate-950  brutal-btn">
                            Launch App
                        </button>
                    </Link>
                </div>
            </header>
        </>
    )
}

export default Header
