import React, { useState, useEffect } from 'react';
import { BatteryCharging, Zap, Shield, Activity, RefreshCw, Cpu, Gauge } from 'lucide-react';
import { VehicleCategory } from '../types';

export const HeroEnergyVisualizer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('2W');
  const [isSimulating, setIsSimulating] = useState(true);
  const [powerFlowKw, setPowerFlowKw] = useState(3.6);
  const [socPct, setSocPct] = useState(24);
  const [tempC, setTempC] = useState(28.4);
  const [voltage, setVoltage] = useState(53.2);

  // Dynamic parameters based on vehicle category
  useEffect(() => {
    if (selectedCategory === '2W') {
      setVoltage(51.2);
      setPowerFlowKw(3.3);
      setTempC(28.2);
    } else if (selectedCategory === '3W') {
      setVoltage(48.0);
      setPowerFlowKw(6.8);
      setTempC(31.5);
    } else {
      setVoltage(410.0);
      setPowerFlowKw(45.0);
      setTempC(29.8);
    }
  }, [selectedCategory]);

  // Subtle live fluctuation effect for realism
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setSocPct((prev) => (prev >= 95 ? 24 : prev + 1));
      setTempC((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
    }, 1800);
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <div className="relative rounded-2xl glass-panel-glow p-5 sm:p-7 overflow-hidden border border-cyan-500/30">
      
      {/* Background Glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header & Architecture Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Activity className="w-3 h-3 animate-spin text-cyan-400" />
              LIVE SIMULATION
            </span>
            <span className="text-xs text-slate-400">Intelligent Power Coupling</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1">
            Dynamic EV Energy Flow & Handshake
          </h3>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedCategory('2W')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === '2W'
                ? 'bg-cyan-500 text-space-950 shadow-md shadow-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2W Swappable
          </button>
          <button
            onClick={() => setSelectedCategory('3W')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === '3W'
                ? 'bg-cyan-500 text-space-950 shadow-md shadow-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3W Dual Tray
          </button>
          <button
            onClick={() => setSelectedCategory('4W')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === '4W'
                ? 'bg-cyan-500 text-space-950 shadow-md shadow-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4W DC Booster
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram */}
      <div className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Station Bay Source (Left) */}
          <div className="lg:col-span-4 bg-slate-900/70 rounded-xl p-4 border border-slate-800 relative group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                Participating Station Bay
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                BAY-04 / Verified
              </span>
            </div>

            <div className="p-3 rounded-lg bg-space-950/80 border border-cyan-500/20 mb-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Selected Module:</span>
                <span className="font-mono font-bold text-white">
                  {selectedCategory === '2W' 
                    ? 'VoltPack-50 (LFP)' 
                    : selectedCategory === '3W' 
                    ? '2x VoltHeavy-48' 
                    : 'VoltRescue CCS2 400V'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Module Capacity:</span>
                <span className="font-mono text-cyan-300">
                  {selectedCategory === '2W' ? '1.8 kWh' : selectedCategory === '3W' ? '5.2 kWh (2x)' : '16.0 kWh DC Pack'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Bay Cell Temp:</span>
                <span className="font-mono text-emerald-400">{tempC} °C (Optimal)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>BMS Handshake: OK</span>
              <span className="text-emerald-400 font-bold">100% HEALTH (SoH)</span>
            </div>
          </div>

          {/* Central Power Flow Conduit */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center py-2 px-1">
            <div className="relative w-full flex items-center justify-center">
              {/* Animated dotted transfer line */}
              <div className="w-full h-1 bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-white/60 w-1/3 animate-flow"></div>
              </div>

              {/* Energy Badge Center */}
              <div className="absolute -top-5 p-2 rounded-full bg-space-950 border-2 border-cyan-400 shadow-lg shadow-cyan-400/30 text-cyan-400">
                <Zap className="w-5 h-5 fill-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                {selectedCategory === '4W' ? '45 kW Rapid DC Coupling' : 'Modular Direct Physical Dock'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {selectedCategory === '4W' 
                  ? 'ISO 15118 Digital Protocol Handshake' 
                  : 'Zero-spark mechanical locking interlock'}
              </p>
            </div>
          </div>

          {/* Target EV Vehicle (Right) */}
          <div className="lg:col-span-4 bg-slate-900/70 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Target Electric Vehicle
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300">
                {voltage}V Architecture
              </span>
            </div>

            {/* Battery Level Visual */}
            <div className="p-3 rounded-lg bg-space-950/80 border border-slate-700/60 mb-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Vehicle SoC State:</span>
                <span className="font-mono font-bold text-cyan-300">{socPct}% Available</span>
              </div>
              
              <div className="w-full bg-slate-800 rounded-full h-3 p-0.5 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${socPct}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Rescued Range Added:</span>
                <span className="font-mono font-bold text-emerald-400">
                  +{selectedCategory === '2W' ? '45' : selectedCategory === '3W' ? '55' : '85'} km
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Ready for Road</span>
              <span className="text-cyan-400">Zero Wait Queue</span>
            </div>
          </div>

        </div>
      </div>

      {/* Real-time Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-center font-mono">
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-[10px] uppercase text-slate-500">Bus Voltage</div>
          <div className="text-sm font-bold text-white mt-0.5">{voltage} V</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-[10px] uppercase text-slate-500">Transfer Current</div>
          <div className="text-sm font-bold text-cyan-300">
            {selectedCategory === '4W' ? '112.5 A' : '32.0 A'}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-[10px] uppercase text-slate-500">Cell Temp</div>
          <div className="text-sm font-bold text-emerald-400">{tempC} °C</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-[10px] uppercase text-slate-500">Swap Time</div>
          <div className="text-sm font-bold text-amber-300">
            {selectedCategory === '4W' ? '~12 mins boost' : '< 90 seconds'}
          </div>
        </div>
      </div>

    </div>
  );
};
