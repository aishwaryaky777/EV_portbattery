import React from 'react';
import { ArrowLeft, Zap, ShieldCheck, MapPin } from 'lucide-react';

interface TopHeaderProps {
  currentScreen: 'battery-status' | 'select-service' | 'battery-takeaway' | 'charging-slot';
  onBack?: () => void;
  stepIndicator?: string;
  vehicleType?: '2W' | '4W' | null;
  onOpenMap?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentScreen,
  onBack,
  stepIndicator,
  vehicleType,
  onOpenMap,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-2 px-1 border-b border-cyan-500/15">
      {/* Left: Back button or Logo */}
      <div className="flex items-center gap-2">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-400 active:scale-95 transition-all"
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Back</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Zap className="w-4 h-4 text-space-950 fill-space-950" />
            </div>
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              VoltShare
            </span>
          </div>
        )}
      </div>

      {/* Center: Active Vehicle or Service Badge */}
      <div className="flex items-center gap-1.5">
        {vehicleType && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
            {vehicleType === '2W' ? '2-Wheeler' : '4-Wheeler'}
          </span>
        )}
      </div>

      {/* Right: Map Button, Step Indicator & Network Status */}
      <div className="flex items-center gap-2">
        {onOpenMap && (
          <button
            onClick={onOpenMap}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold transition-all active:scale-95 shadow-sm"
            title="Open Live EV Charging Station Map"
          >
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>Map</span>
          </button>
        )}
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Grid Active
        </span>
        {stepIndicator && (
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900/90 text-slate-400 border border-slate-800">
            {stepIndicator}
          </span>
        )}
      </div>
    </header>
  );
};
