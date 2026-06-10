import { useEffect, useRef, useState } from 'react';

const STEPS = [
    {
        id: 'checkout',
        label: 'Checkout',
        detail: 'Session minted',
        value: 'USDC',
        color: '#10b981',
        position: 'md:left-[8%] md:top-[30%]',
        fromX: -90,
        fromY: 40,
        rotate: -18,
    },
    {
        id: 'wallet',
        label: 'Wallet',
        detail: 'Signature verified',
        value: '0x91a',
        color: '#38bdf8',
        position: 'md:left-[28%] md:top-[62%]',
        fromX: -30,
        fromY: 110,
        rotate: 14,
    },
    {
        id: 'route',
        label: 'Route',
        detail: 'Network selected',
        value: 'L2',
        color: '#a78bfa',
        position: 'md:right-[28%] md:top-[22%]',
        fromX: 35,
        fromY: -110,
        rotate: -12,
    },
    {
        id: 'settle',
        label: 'Settle',
        detail: 'Merchant credited',
        value: '2.1s',
        color: '#f59e0b',
        position: 'md:right-[8%] md:top-[56%]',
        fromX: 95,
        fromY: 35,
        rotate: 18,
    },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const stepProgress = (progress: number, index: number) => {
    const start = index * 0.16;
    const end = start + 0.34;
    return clamp((progress - start) / (end - start));
};

export default function ScrollAnimation() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let frameId = 0;

        const updateProgress = () => {
            const el = sectionRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const scrollRange = Math.max(1, rect.height - window.innerHeight);
            setProgress(clamp(-rect.top / scrollRange));
        };

        const handleScroll = () => {
            if (frameId) return;

            frameId = window.requestAnimationFrame(() => {
                frameId = 0;
                updateProgress();
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateProgress);
        updateProgress();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateProgress);
            if (frameId) window.cancelAnimationFrame(frameId);
        };
    }, []);

    const railProgress = clamp(progress * 1.2);
    const coreProgress = clamp((progress - 0.12) / 0.28);
    const pulseProgress = clamp((progress - 0.68) / 0.22);

    return (
        <section ref={sectionRef} className="relative min-h-[260vh] bg-[#050807] text-white">
            <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4 py-12">
                <div className="relative h-[620px] w-full max-w-6xl overflow-hidden border border-emerald-400/20 bg-[#07100d]">
                    <div className="absolute inset-x-0 top-2 lg:top-24 flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-100/60 md:px-6">
                        <span>Norelix Routing Console</span>
                        <span className='text-[14px] font-extrabold'>{Math.round(progress * 100).toString().padStart(2, '0')}%</span>
                    </div>

                    <div className="absolute inset-0 pt-12">
                        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                                <pattern id="circuit-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16,185,129,0.08)" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="1000" height="560" fill="url(#circuit-grid)" />
                            <path
                                d="M90 280 H305 L390 175 H612 L705 280 H910"
                                fill="none"
                                stroke="rgba(16,185,129,0.9)"
                                strokeWidth="4"
                                strokeLinecap="square"
                                strokeDasharray="1180"
                                strokeDashoffset={1180 - (1180 * railProgress)}
                            />
                            <path
                                d="M305 280 L390 385 H612 L705 280"
                                fill="none"
                                stroke="rgba(56,189,248,0.55)"
                                strokeWidth="3"
                                strokeLinecap="square"
                                strokeDasharray="640"
                                strokeDashoffset={640 - (640 * clamp((progress - 0.18) / 0.55))}
                            />
                            <path
                                d="M500 126 L575 202 L500 278 L425 202 Z"
                                fill="rgba(16,185,129,0.04)"
                                stroke="rgba(16,185,129,0.45)"
                                strokeWidth="2"
                                opacity={coreProgress}
                            />
                        </svg>

                        <div
                            className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center border border-emerald-300/60 bg-[#081713] shadow-[0_0_40px_rgba(16,185,129,0.16)] md:h-40 md:w-40"
                            style={{
                                opacity: coreProgress,
                                transform: `translate(-50%, -50%) rotate(${45 + ((1 - coreProgress) * 90)}deg) scale(${0.72 + (coreProgress * 0.28)})`,
                            }}
                        >
                            <div className="-rotate-45 text-center font-mono">
                                <p className="text-[10px] uppercase tracking-[0.32em] text-emerald-300">Core</p>
                                <p className="mt-2 text-2xl font-bold text-white md:text-3xl">PAY</p>
                            </div>
                        </div>

                        {STEPS.map((step, index) => {
                            const local = stepProgress(progress, index);

                            return (
                                <div
                                    key={step.id}
                                    className={`relative z-30 mx-auto mt-4 w-[min(88vw,310px)] border bg-[#0b1412]/95 p-4 font-mono shadow-[0_18px_45px_rgba(0,0,0,0.35)] md:absolute md:mx-0 md:mt-0 md:w-56 ${step.position}`}
                                    style={{
                                        borderColor: `${step.color}88`,
                                        clipPath: index % 2 === 0
                                            ? 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)'
                                            : 'polygon(22px 0, 100% 0, 100% 100%, 0 100%, 0 22px)',
                                        opacity: local,
                                        transform: `translate(${(1 - local) * step.fromX}px, ${(1 - local) * step.fromY}px) rotate(${(1 - local) * step.rotate}deg) scale(${0.76 + (local * 0.24)})`,
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: step.color }}>{step.label}</p>
                                            <p className="mt-2 text-sm text-slate-200">{step.detail}</p>
                                        </div>
                                        <span className="border px-2 py-1 text-[10px]" style={{ borderColor: `${step.color}66`, color: step.color }}>
                                            {step.value}
                                        </span>
                                    </div>
                                    <div className="mt-4 h-1 bg-white/10">
                                        <div className="h-full" style={{ width: `${local * 100}%`, backgroundColor: step.color }} />
                                    </div>
                                </div>
                            );
                        })}

                        <div
                            className="absolute left-1/2 top-[calc(50%+125px)] z-10 h-2 w-2 border border-emerald-300 bg-[#050807]"
                            style={{
                                opacity: pulseProgress,
                                transform: `translateX(${(-220 + (pulseProgress * 440))}px) rotate(45deg) scale(${0.8 + (pulseProgress * 0.6)})`,
                                boxShadow: '0 0 18px rgba(16,185,129,0.75)',
                            }}
                        />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 border-t border-emerald-400/15 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400 pb-3">
                        <div className="border-r border-emerald-400/15 p-4 pt-2">
                            <p className="text-slate-500">Throughput</p>
                            <p className="mt-1 text-emerald-300">{Math.round(190 + (progress * 810))} tx/min</p>
                        </div>
                        <div className="border-r border-emerald-400/15 p-4 pt-2">
                            <p className="text-slate-500">Risk</p>
                            <p className="mt-1 text-sky-300">{progress > 0.58 ? 'cleared' : 'scanning'}</p>
                        </div>
                        <div className="p-4 pt-2">
                            <p className="text-slate-500">Settlement</p>
                            <p className="mt-1 text-amber-300">{progress > 0.82 ? 'complete' : 'pending'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
