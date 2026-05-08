import { useEffect, useRef, useState } from 'react';

const LAYERS = [
    {
        id: 'wallet',
        label: 'WALLET LAYER',
        sublabel: 'Multi-chain Auth & Signing',
        color: '#10b981',
        bgColor: 'rgba(16,185,129,0.08)',
        borderColor: 'rgba(16,185,129,0.5)',
        content: (
            <div className="flex items-center gap-3 px-4 md:px-6 py-4 w-full">
                <div className="flex gap-1 md:gap-2">
                    {['#627EEA', '#F7931A', '#2775CA'].map((c, i) => (
                        <span key={i} style={{ background: c }} className="inline-block w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-slate-900" />
                    ))}
                </div>
                <span className="text-[10px] md:text-xs text-slate-400 font-mono tracking-tighter md:tracking-widest">ETH · BTC · USDC</span>
                <span className="ml-auto text-[8px] md:text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 font-mono uppercase">Connected</span>
            </div>
        ),
    },
    {
        id: 'sdk',
        label: 'SDK ENGINE',
        sublabel: 'Routing & Orchestration',
        color: '#6366f1',
        bgColor: 'rgba(99,102,241,0.08)',
        borderColor: 'rgba(99,102,241,0.5)',
        content: (
            <div className="px-4 md:px-6 py-3 w-full font-mono text-[10px] md:text-xs text-slate-400 leading-5 md:leading-6">
                <span className="text-indigo-400">POST</span>{' '}
                <span className="text-slate-300">/v1/charges</span>
                <br />
                <span className="text-slate-500">{'{'} amount: </span>
                <span className="text-emerald-400">5000</span>
                <span className="text-slate-500">, usdc {'}'}</span>
            </div>
        ),
    },
    {
        id: 'settlement',
        label: 'SETTLEMENT LAYER',
        sublabel: 'Instant On-chain Finality',
        color: '#f59e0b',
        bgColor: 'rgba(245,158,11,0.08)',
        borderColor: 'rgba(245,158,11,0.5)',
        content: (
            <div className="flex items-center gap-4 px-4 md:px-6 py-4 w-full">
                <div className="text-[10px] md:text-xs font-mono text-slate-400 leading-5 md:leading-6">
                    <p><span className="text-amber-400">TX</span> 0x23f...031 — Initiated</p>
                    <p><span className="text-emerald-400">TX</span> 0x23f...031 — Confirmed ✓</p>
                </div>
                <span className="ml-auto text-[10px] text-amber-400 font-mono">~2s</span>
            </div>
        ),
    },
    {
        id: 'security',
        label: 'SECURITY VAULT',
        sublabel: 'MPC Keys & Audit Layer',
        color: '#ec4899',
        bgColor: 'rgba(236,72,153,0.08)',
        borderColor: 'rgba(236,72,153,0.5)',
        content: (
            <div className="flex items-center gap-4 px-4 md:px-6 py-4 w-full">
                <div className="hidden md:grid grid-cols-3 gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-sm" style={{ background: i % 2 === 0 ? '#ec4899' : 'rgba(236,72,153,0.2)' }} />
                    ))}
                </div>
                <div className="text-[10px] md:text-xs font-mono text-slate-400 leading-5 md:leading-6">
                    <p className="text-pink-400">HMAC-SHA256</p>
                    <p>Webhook Signing</p>
                </div>
                <span className="ml-auto text-[8px] md:text-[10px] bg-pink-500/20 text-pink-400 px-2 py-1 font-mono">AUDITED</span>
            </div>
        ),
    },
];

export default function ParallaxStack() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const el = sectionRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const windowH = window.innerHeight;
            // Calculate scroll through the section
            const scrollRange = rect.height;
            const currentScroll = windowH - rect.top;
            const raw = currentScroll / (windowH + scrollRange);
            setProgress(Math.min(1, Math.max(0, raw)));
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative bg-[#050807] py-10 w-full overflow-hidden"
        >
            {/* Sticky viewport container */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* Dynamic Title */}
                <div className="absolute top-12 md:top-20 z-50 text-center px-6">
                    <h2 className="text-2xl md:text-5xl font-bold text-white tracking-tighter mb-4">
                        Secure Infrastructure
                    </h2>
                    <div className="h-1 w-24 md:w-32 bg-emerald-500 mx-auto rounded-full" />
                </div>

                {/* Perspective Container */}
                <div
                    className="relative w-full max-w-4xl px-6"
                    style={{ perspective: '200px' }}
                >
                    {LAYERS.map((layer, i) => {
                        // Stagger the entrance based on scroll progress
                        const start = i * 0.2;
                        const end = start + 0.2;
                        const layerProgress = Math.min(1, Math.max(0, (progress - start) / (end - start)));

                        // Animation Values
                        const xOffset = i % 2 === 0 ? -100 : 100; // Alternating slide
                        const currentX = (1 - layerProgress) * xOffset;
                        const opacity = layerProgress;
                        const scale = 0.8 + (layerProgress * 0.2);

                        // Vertical stacking
                        const yPos = i * 35; // Fixed gap for stacking

                        return (
                            <div
                                key={layer.id}
                                className="relative md:absolute w-full mb-4 md:mb-0 transition-all duration-75 ease-out"
                                style={{
                                    transform: `
                                        translateY(${yPos}px) 
                                        translateX(${currentX}px) 
                                        scale(${scale}) 
                                        rotateY(${currentX / 10}deg)
                                    `,
                                    opacity: opacity,
                                    zIndex: LAYERS.length + i
                                }}
                            >
                                <div
                                    className="group relative overflow-hidden rounded-xl border backdrop-blur-md"
                                    style={{
                                        backgroundColor: layer.bgColor,
                                        borderColor: layer.borderColor,
                                        boxShadow: `0 20px 50px -10px rgba(0,0,0,0.5), 0 0 20px ${layer.color}11`
                                    }}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b px-4 md:px-6 py-2" style={{ borderColor: layer.borderColor }}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: layer.color }} />
                                            <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase font-mono">
                                                {layer.label}
                                            </span>
                                        </div>
                                        <span className="text-[9px] text-slate-500 font-mono italic">0x00{i + 1}</span>
                                    </div>

                                    {/* Content Area */}
                                    <div className="relative">
                                        {layer.content}
                                    </div>
                                </div>
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                                    style={{
                                        background: layer.color,
                                        top: `${(Date.now() / 1000 % 1) * 100}%`,
                                        boxShadow: `0 0 6px ${layer.color}`,
                                        opacity: 1,
                                        animation: 'travelDown 1.5s linear infinite',
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Ambient Background Background */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)',
                            backgroundSize: '24px 24px',
                            transform: `translateY(${progress * -50}px)`
                        }}
                    />
                </div>

                {/* Radial glow behind layers */}

                <div className="absolute inset-0 pointer-events-none"
                style={{

                        background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(16,185,129,${0.04 + 1 * 0.06}), transparent)`,

                    }}

                />
            <style>
            {`
            @keyframes travelDown {
                0% { top: 0%; opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
            `}
            </style>
        </div>
        </section >
    );
}