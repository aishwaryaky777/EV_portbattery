import React from 'react';
import { BatteryCharging, PlugZap, ArrowRight, Bike, Car, Shield, Clock, Zap } from 'lucide-react';
import { TopHeader } from '../components/TopHeader';

interface ScreenSelectServiceProps {
  vehicleType: '2W' | '4W';
  batteryPct: number;
  onSelectService: (service: 'battery-takeaway' | 'charging-slot') => void;
  onBack: () => void;
}

export const ScreenSelectService: React.FC<ScreenSelectServiceProps> = ({
  vehicleType,
  batteryPct,
  onSelectService,
  onBack,
}) => {
  return (
    <div className="h-full w-full max-w-md mx-auto flex flex-col justify-between p-4 sm:p-5 select-none animate-in fade-in">
      
      {/* Top App Bar with Back Button */}
      <TopHeader 
        currentScreen="select-service" 
        onBack={onBack} 
        stepIndicator="2 / 3" 
        vehicleType={vehicleType}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2 space-y-4">
        
        {/* Selected Vehicle Badge Summary */}
        <div className="p-3 rounded-xl bg-space-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              {vehicleType === '2W' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {vehicleType === '2W' ? 'Electric 2-Wheeler' : 'Electric 4-Wheeler'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {vehicleType === '2W' ? '48V–72V Architecture' : '300V–400V High Voltage'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono font-bold text-amber-400">
              {batteryPct}% SoC
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              ~{Math.round(batteryPct * 0.95)} km Left
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center space-y-0.5">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Choose Emergency Service
          </h2>
          <p className="text-xs text-slate-400">
            Select how you would like to restore your driving range
          </p>
        </div>

        {/* Service Option 1: Battery Takeaway */}
        <button
          onClick={() => onSelectService('battery-takeaway')}
          className="w-full p-4 rounded-2xl glass-panel-glow hover:border-cyan-400 flex items-center justify-between gap-3 text-left transition-all active:scale-[0.98] group"
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 text-space-950 flex items-center justify-center flex-shrink-0 shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <BatteryCharging className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Battery Takeaway
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Instant
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Get emergency battery energy for approximately 25–30 km.
              </p>
              <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 pt-0.5">
                <Zap className="w-3 h-3" />
                <span>Modular exchange • Return anywhere</span>
              </div>
            </div>
          </div>

          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500 group-hover:text-space-950 transition-all flex-shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Service Option 2: Charging Slot Booking */}
        <button
          onClick={() => onSelectService('charging-slot')}
          className="w-full p-4 rounded-2xl glass-panel-glow hover:border-blue-400 flex items-center justify-between gap-3 text-left transition-all active:scale-[0.98] group"
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <PlugZap className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  Charging Slot Booking
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                  Zero Wait
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Find a suitable charging slot with minimal waiting.
              </p>
              <div className="text-[10px] text-blue-400 font-mono flex items-center gap-1 pt-0.5">
                <Clock className="w-3 h-3" />
                <span>Reserved bay • Fast route match</span>
              </div>
            </div>
          </div>

          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all flex-shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

      </div>

      {/* Bottom Hint */}
      <div className="text-center text-[11px] font-mono text-slate-400 py-1">
        Tap a service card to open its recommendation screen
      </div>

    </div>
  );
};
