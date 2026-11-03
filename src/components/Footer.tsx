import React from 'react';
import { Zap, ShieldCheck, BatteryCharging, Radio, ExternalLink, HelpCircle } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="border-t border-slate-800 bg-space-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">VoltShare Network</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              An intelligent, distributed emergency battery-sharing ecosystem. Like exchanging an LPG cylinder, EV drivers swap depleted modules for verified charged packs or mobile DC booster rescue without stranded downtime.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Network Online: 42 Hubs Active
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">99.94% Uptime</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Platform Pages</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => { setActiveTab('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">
                  User Dashboard & Calculator
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('stations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">
                  Find Participating Stations
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('return'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">
                  Return Depleted Modules
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('operator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition-colors">
                  Station Operator Telemetry
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Categories */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">EV Architectures</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Electric 2-Wheelers (48V / 72V)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>Electric 3-Wheelers (Commercial Auto/Cargo)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>Electric 4-Wheelers (VoltRescue CCS2 DC Booster)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>Dynamic Voltage Handshake CAN bus</span>
              </li>
            </ul>
          </div>

          {/* Safety & Standards */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Safety Certifications</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="font-semibold text-slate-200">ISO 26262 ASIL-C</p>
                <p className="text-[11px] text-slate-400">Automotive functional safety standard</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="font-semibold text-slate-200">UN 38.3 & AIS-156</p>
                <p className="text-[11px] text-slate-400">Thermal runaway & drop shock compliance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} VoltShare Smart EV Emergency Battery-Sharing Network. Designed for next-generation electromobility.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Calculated Range Estimates</span>
            <span>•</span>
            <span>Simulated Telemetry Mode</span>
            <span>•</span>
            <button onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-cyan-400 hover:underline">
              Technical Documentation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
