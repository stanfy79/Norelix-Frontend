import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="border-t border-slate-800py-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 md:flex-row md:justify-between md:p-8">
                <div className="">
                    <p className="text-black text-4xl font-bold">NexusPay</p>
                    <p className='text-[12px] text-slate-700 max-w-[300px] mt-3'>© 2024 NexusPay. Secure On-Chain Payments for the next generation of global commerce. Built for builders.</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    <Link to="#" className="transition hover:text-black">Privacy</Link>
                    <Link to="#" className="transition hover:text-black">Terms</Link>
                    <Link to="#" className="transition hover:text-black">Support</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer
