import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import {
  ArrowRight,
  Code,
  KeyRound,
  ShieldCheck,
  ShoppingCart,
  SquareTerminal,
  Webhook,
  Zap
} from 'lucide-react';
import HeroImg from '../assets/hero-img.png'
import Footer from '../components/common/Footer';
import ScrollAnimation from '../components/ui/ScrollAnimation';
import CodeWindow from '../components/ui/CodeCard';
import CodeCard from '../components/ui/CodeCard';

const Home = () => {
  return (
    <main className="text-slate-100 bg-[#f1f5f9]">
      <Header />

      <section className="relative overflow-hidden py-16">
        <div className="mx-auto mt-10 grid gap-20 px-4 lg:grid-cols-[1.1fr_0.9fr] sm:px-8 border">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/30 px-4 py-2 text-[14px] text-black shadow-sm shadow-emerald-500/10 jetbrains-mono">
              <span className="inline-flex h-2.5 w-2.5  bg-emerald-400" />
              V1.0 Now Live
            </div>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-3xl jetbrains-mono leading-10 md:leading-[60px] text-slate-800 md:text-5xl">
                Accept <span className="text-emerald-400">Crypto</span> Payments Like Stripe
              </h1>
              <p className="max-w-xl leading-8 text-slate-800">
                Build professional checkout experiences for the on-chain economy. Global settlement in seconds, API-first architecture, and institutional-grade security.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/overview"
                className="inline-flex items-center justify-center bg-[#064e3b] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-[#0a6c52] hover:text-white"
              >
                Get Started
              </Link>
              <Link
                to="#developers"
                className="inline-flex gap-2 items-center justify-center border border-slate-700 px-6 py-3 text-sm text-black hover:gap-4 hover:text-slate-700"
              >
                View Documentation <ArrowRight />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:max-w-2xl text-black">
              <div className="p-4">
                <p className="mt-3 text-3xl font-semibold">$2.4B+</p>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-700 mt-3">Volume Processed</p>
              </div>
              <div className="p-4 border-l border-slate-800">
                <p className="mt-3 text-3xl font-semibold">99.9%</p>
                <p className="text-sm uppercase tracking-[0.32em] text-slate-700 mt-3">Uptime Reliability</p>
              </div>
            </div>
          </div>

          <div className="relative flex p-2 sm:h-[470px] sm:w-[470px] border-2 border-slate-800 shadow-2xl shadow-slate-950/30">
            <img src={HeroImg} alt="Hero" className='w-full md:w-[520px]' />

            <div className="absolute left-0 md:-left-10 -bottom-20 md:-bottom-10
            w-full md:w-72 hover:scale-105">
<CodeCard
  fileName="cURL EXAMPLE"
  size='100%'
  code={`curl -X POST https://api.norelix.com/v1/charges

  -H "Authorization: Bearer sk_live_..."
  -d amount=5000
  -d currency=usdc`}
/>
            </div>
          </div>
        </div>
      </section>


      <section id="features" className="mx-auto max-w-7xl space-y-8 px-6 py-20 sm:px-8 bg-slate-100">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="border border-slate-800 p-8 brutal">
            <ShoppingCart size={'30px'} className='text-black bg-[#10b981] p-3 box-content' />
            <p className="text-sm uppercase tracking-[0.32em] text-black mt-4">Embedded Checkout</p>
            <p className="mt-4 text-sm leading-7 text-slate-700">Flexible on-chain checkout with instant approvals, advanced UX, and seamless wallet support.</p>
          </article>
          <article className="border border-slate-800 p-8 brutal">
            <Code size={'30px'} className='text-black bg-[#10b981] p-3 box-content' />
            <p className="text-sm uppercase tracking-[0.32em] text-black mt-4">API-first Engine</p>
            <p className="mt-4 text-sm leading-7 text-slate-700">Robust SDK routing, webhook delivery, and 1-click contract orchestration for payments.</p>
          </article>
          <article className="border border-slate-800 p-8 brutal">
            <Zap size={'30px'} className='text-black bg-[#10b981] p-3 box-content' />
            <p className="text-sm uppercase tracking-[0.32em] text-black mt-4">Instant Settlement</p>
            <p className="mt-4 text-sm leading-7 text-slate-700">Zero fiat rails, zero waiting, and real-time transaction finality across chains.</p>
          </article>
        </div>
      </section>


      <section className="mx-auto mt-20 max-w-7xl px-6 py-16 md:px-8">
        <div className="border flex flex-row justify-center border-slate-500/70 text-black p-8 grid gap-10 gap-13 sm:grid-cols-2">
          <div className="flex flex-col gap-5 w-full">
            <div className="inline-flex items-center gap-2 bg-emerald-500/30 px-4 py-2 text-[14px] text-black jetbrains-mono w-[200px]">
              <span className="inline-flex h-2.5 w-2.5  bg-emerald-400" />
              FOR DEVELOPERS
            </div>
            <h1 className="text-black leading-10">API-first Payments</h1>
            <p className="text-slate-700">A robust, typed SDK that works exactly like the tools you already use. From webhooks to customized metadata, Norelix handles the complexity of the chain while you build the product.</p>
            <div className="flex flex-col gap-3 text-[14px]">
              <span className="flex gap-2">
                <Webhook color='#10b981' />
                Real-time Webhook Events</span>
              <span className="flex gap-2">
                <ShieldCheck color='#10b981' />
                Signed Payload Validation</span>
              <span className="flex gap-2">
                <Code color='#10b981' />
                Universal SDK Support</span>
            </div>
          </div>

          <div className="w-full">
<CodeWindow
fileName='JavaScript'
size='100%'
code={`
//Iframe widget snippet
<iframe
src="https://nexksupay.com/api/v1/<payload>"
allow="clipboard-write"
title="Norelix Checkout"
loading="lazy"
style="width:100%;
height:100%; border:none;">
</iframe>
  `
} />
          </div>
        </div>
      </section>


      <ScrollAnimation />


      <section className="py-20 text-center">
        <div className="py-8 px-4">
          <h2 className='text-black text-md'>Engineered for Technical Trust</h2>
          <p className='text-black text-[14px]'>The most secure payment infrastructure on Ethereum, Polygon, and Solana. Verified by top security firms.</p>
        </div>
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:px-8">
          <div className="min-w-0 bg-[#2c3134] w-full text-start p-10 brutal">
            <div className="inline-flex items-center gap-2 bg-emerald-500/30 px-4 py-2 text-[14px] text-white jetbrains-mono">
              <span className="inline-flex h-2.5 w-2.5  bg-emerald-400" />
              V1.0 Now Live
            </div>
            <h1 className='text-[20px] mt-3'>Real-time Transaction Stream</h1>
            <div className="grid text-slate-300 jetbrains-mono mt-5">
              <div className="">
                {[
                  { TX_ID: '0x231313131...031', label: 'Swap', amount: '422 USDC' },
                  { TX_ID: '0x231313131...031', label: 'Payment', amount: '1,260 USDC' },
                  { TX_ID: '0x231313131...031', label: 'Refund', amount: '60 USDC' },
                ].map((event) => (
                  <div key={event.TX_ID} className="flex items-center justify-between gap-2 py-2 text-[12px] sm:text-[14px] text-slate-300 jetbrains-mono border-b border-slate-600">
                    <div className="">
                      <p className="font-medium text-slate-400">TX_ID: {event.TX_ID}</p>
                      <p className="text-xs text-slate-500">{event.label}</p>
                    </div>
                    <p className="font-semibold text-emerald-300">{event.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-6">
            <div className="border flex flex-col gap-5 border-slate-500/70 bg-gray-200 text-black p-8">
              <p className="text-sm uppercase tracking-[0.32em]">Global Gas-Less Rails</p>
              <p className="max-w-xl text-sm leading-7">Norelix abstracts gas fees for your users, allowing for a seamless USDC experience without needing native chain tokens.</p>
              <div className='flex flex-wrap gap-5'>
                <div className="inline-flex items-center gap-2 bg-emerald-500/30 px-4 py-2 text-[12px] text-[#064e3b] jetbrains-mono">
                  <span className="inline-flex h-2.5 w-2.5  bg-emerald-400" />
                  L2 OPTIMISED
                </div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/30 px-4 py-2 text-[12px] text-[#064e3b] jetbrains-mono">
                  <span className="inline-flex h-2.5 w-2.5  bg-emerald-400" />
                  PAYMEASTER ENABLED
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-slate-500/70 p-6 text-black gap-3 flex flex-col justify-center items-center">
                <ShieldCheck color='#064e3b' size={40} />
                <p className="text-[14px] uppercase tracking-[0.32em] font-bold">Certified Security</p>
                <p className="text-[14px] text-center">Audited smart contracts and merchant-level webhooks with real-time events.</p>
              </div>
              <div className="border border-slate-500/70 p-6 text-black gap-3 flex flex-col justify-center items-center">
                <KeyRound color='#064e3b' size={40} />
                <p className="text-[14px] uppercase tracking-[0.32em] font-bold">MPC VAULTS</p>
                <p className="text-[14px] text-center">Non-custodial key management for every merchant.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="bg-[#064e3b] p-10 py-14px text-center text-slate-100">
          <p className="text-sm uppercase tracking-[0.32em] text-emerald-100">Ready to upgrade your payment stack?</p>
          <h2 className="mt-4 text-2xl font-semibold md:text-4xl">Join 5,000+ developers building the future of crypto payments.</h2>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
            <button className="bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-300">
              Create Free Account
            </button>
            <button className="border border-white/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Home;
