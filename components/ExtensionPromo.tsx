"use client";

import React from 'react';

export const ExtensionPromo = () => {
    return (
        <section className="bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 border border-blue-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

            <div className="space-y-4 relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    New Release
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                    Get y4yes for Chrome
                </h2>
                <p className="text-zinc-300 text-lg leading-relaxed">
                    Access your favorite network tools instantly from any tab. Check your IP, inspect websites, and run speed tests without leaving your current page.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M20 6 9 17l-5-5" /></svg>
                        <span>Instant IP Check</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M20 6 9 17l-5-5" /></svg>
                        <span>Site Inspection</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M20 6 9 17l-5-5" /></svg>
                        <span>One-click Tools</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 shrink-0">
                <a
                    href="#"
                    className="group flex items-center gap-3 bg-white text-zinc-950 px-6 py-3.5 rounded-xl font-bold hover:bg-zinc-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    onClick={(e) => {
                        e.preventDefault();
                        alert("The extension is currently under review by the Chrome Web Store. Check back soon!");
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" x2="12" y1="8" y2="8" /><line x1="3.95" x2="8.54" y1="6.06" y2="14" /><line x1="10.88" x2="15.46" y1="21.94" y2="14" /></svg>
                    Add to Chrome
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </a>
                <p className="text-center text-xs text-zinc-500 mt-2">Version 1.0 • Free</p>
            </div>
        </section>
    );
};
