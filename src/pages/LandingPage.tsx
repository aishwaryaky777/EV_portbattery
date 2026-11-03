import React from 'react';
import { 
  Zap, 
  BatteryCharging, 
  MapPin, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  Gauge, 
  Cpu, 
  Layers,
  Sparkles,
  ChevronRight,
  Check
} from 'lucide-react';
import { HeroEnergyVisualizer } from '../components/HeroEnergyVisualizer';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onSelectCategory: (category: '2W' | '3W' | '4W') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate,
  onSelectCategory
}) => {
  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>SMART EV EMERGENCY BATTERY-SHARING PLATFORM</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Emergency Power. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Wherever Your EV Needs It.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
              Find compatible charged batteries nearby, get back on the road in minutes, and return depleted modules at any participating station. Like exchanging an LPG cylinder for continuous clean energy.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('stations')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 text-sm font-bold tracking-wider uppercase shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2.5 active:scale-95 group"
              >
                <BatteryCharging className="w-5 h-5 text-space-950" />
                <span>Find a Battery Station</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl glass-panel text-slate-200 hover:text-white hover:border-cyan-500/40 text-sm font-semibold tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <span>How It Works</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            {/* Key Metrics Strip */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left font-mono">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase">Swap Time</div>
                <div className="text-lg font-bold text-cyan-300 mt-0.5">&lt; 90 Sec</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase">Active Hubs</div>
                <div className="text-lg font-bold text-white mt-0.5">42 Grid Hubs</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase">Vehicles</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">2W, 3W & 4W</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase">Return Model</div>
                <div className="text-lg font-bold text-indigo-300 mt-0.5">Any-Station</div>
              </div>
            </div>

          </div>

          {/* Hero Visualizer Component */}
          <div className="mt-14 max-w-5xl mx-auto">
            <HeroEnergyVisualizer />
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase px-3 py-1 rounded-full bg-rose-950/40 border border-rose-500/30">
            The Current EV Bottleneck
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Traditional EV Charging Leaves Drivers Stranded
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Fixed charging plugs fail when you face critical mid-journey battery depletion without convenient access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-space-900/70 border border-rose-500/20 hover:border-rose-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Sudden Low Battery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unexpected traffic, extreme weather, or AC usage drains the battery faster than estimated, leaving the driver stranded with zero juice.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-space-900/70 border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Distant Charging Plugs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Charging stations are clustered in central hubs and often 8 to 15 km away—unreachable when your remaining range is under 5 km.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-space-900/70 border border-cyan-500/20 hover:border-cyan-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Crippling Queue Times</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Even when a fast charger is found, queues of 30 to 90 minutes destroy schedules, disrupt cargo deliveries, and cause missed appointments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-space-900/70 border border-purple-500/20 hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Persistent Range Anxiety</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Constant psychological fear of running out of power restricts EV adoption, limiting long-distance travel and fleet scalability.
            </p>
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION SECTION (LPG Analogy) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-space-900 to-space-950 border border-cyan-500/30 p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                <Sparkles className="w-3.5 h-3.5" />
                THE VOLTSHARE PARADIGM
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Smart Battery-Sharing: <br />
                <span className="text-cyan-400">The LPG Cylinder Model for Electric Vehicles</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                When a household runs out of cooking gas, they don’t wait 3 hours for the gas tanker to fill their tank at home—they simply exchange the empty cylinder for a certified full one.
              </p>

              <p className="text-slate-400 text-sm leading-relaxed">
                VoltShare adapts this proven, frictionless model to electromobility. Instead of being tethered to a cable, you swap or receive an emergency modular pack at any participating station, drive to your destination, and drop it off wherever your journey ends.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                  <span>Zero waiting at slow charging bays</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                  <span>Universal participating station return</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                  <span>Certified 98%+ Battery State of Health</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                  <span>BMS CAN-bus voltage verification</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-space-950/90 rounded-2xl border border-cyan-500/25 p-6 space-y-4">
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Network Protocol</span>
                <span>ISO 26262 Certified</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Empty Module In:</span>
                  <span className="text-rose-400 font-bold">Automatic Bay Locking</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Diagnostic Check:</span>
                  <span className="text-emerald-400 font-bold">Cell Balance & Thermal OK</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Charged Module Out:</span>
                  <span className="text-cyan-400 font-bold">100% SoC In Under 90s</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-space-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                Estimate Your Energy Needs
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (5-Step Process) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30">
            Frictionless Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How VoltShare Emergency Grid Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Five simple steps to eliminate range anxiety and get your EV moving without delay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '01',
              title: 'Vehicle Input',
              desc: 'Enter your vehicle category (2W/3W/4W), model, and current battery percentage.',
              icon: Cpu,
            },
            {
              step: '02',
              title: 'Location & Target',
              desc: 'Select current GPS point and desired extra distance needed to reach safety.',
              icon: MapPin,
            },
            {
              step: '03',
              title: 'Compatibility Match',
              desc: 'Our engine verifies voltage compatibility and locates stations with charged packs.',
              icon: ShieldCheck,
            },
            {
              step: '04',
              title: 'Reserve & Collect',
              desc: 'Lock a bay slot, receive your digital QR pass, and swap or connect the emergency pack.',
              icon: BatteryCharging,
            },
            {
              step: '05',
              title: 'Return Anywhere',
              desc: 'Drop off depleted modules at any participating hub when your journey ends.',
              icon: RotateCcw,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-space-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-cyan-400/40 group-hover:text-cyan-400 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-300 group-hover:border-cyan-400 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center text-[11px] font-mono text-cyan-400">
                  <span>Step {item.step} of 05</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. VEHICLE COMPATIBILITY ARCHITECTURE (2W, 3W, 4W) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/30">
            Engineered Compatibility
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tailored For Every EV Architecture
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            No fixed module count. Configurations are mathematically derived from nominal voltage, power draw, and required usable kWh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2-Wheelers Card */}
          <div className="rounded-2xl bg-space-900/80 border border-cyan-500/30 hover:border-cyan-400 p-6 flex flex-col justify-between transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300">
                  CATEGORY: 2W
                </span>
                <span className="text-xs text-slate-400 font-mono">48V - 72V</span>
              </div>

              <h3 className="text-xl font-bold text-white">Electric Two-Wheelers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scooters and commuter motorcycles (Ather, Ola, TVS, etc.). Designed for portable lightweight modules easily handled by an individual.
              </p>

              <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Module Spec:</span>
                  <span className="text-cyan-300">VoltPack-50 (1.8 kWh LFP)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Weight:</span>
                  <span className="text-slate-200">11.5 kg / pack</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Physical Limit:</span>
                  <span className="text-slate-200">1 or 2 bays</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Added Range:</span>
                  <span className="text-emerald-400 font-bold">+40 to +80 km</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  onSelectCategory('2W');
                  onNavigate('dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <span>Select 2W Platform</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3-Wheelers Card */}
          <div className="rounded-2xl bg-space-900/80 border border-sky-500/30 hover:border-sky-400 p-6 flex flex-col justify-between transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-sky-950/80 border border-sky-500/40 text-[11px] font-mono font-bold text-sky-300">
                  CATEGORY: 3W
                </span>
                <span className="text-xs text-slate-400 font-mono">48V - 60V High Current</span>
              </div>

              <h3 className="text-xl font-bold text-white">Electric Three-Wheelers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Passenger auto-rickshaws and urban cargo haulers (Mahindra Treo, Piaggio Ape). High discharge capacity for heavy payload support.
              </p>

              <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Module Spec:</span>
                  <span className="text-sky-300">VoltHeavy-48 (2.6 kWh LFP)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Weight:</span>
                  <span className="text-slate-200">19.0 kg / module</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Configuration:</span>
                  <span className="text-slate-200">2 to 4 parallel tray blocks</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Added Range:</span>
                  <span className="text-emerald-400 font-bold">+50 to +110 km</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  onSelectCategory('3W');
                  onNavigate('dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <span>Select 3W Platform</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4-Wheelers Card */}
          <div className="rounded-2xl bg-space-900/80 border border-indigo-500/30 hover:border-indigo-400 p-6 flex flex-col justify-between transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-indigo-950/80 border border-indigo-500/40 text-[11px] font-mono font-bold text-indigo-300">
                  CATEGORY: 4W
                </span>
                <span className="text-xs text-slate-400 font-mono">300V - 800V High Voltage</span>
              </div>

              <h3 className="text-xl font-bold text-white">Electric Four-Wheelers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Passenger cars & SUVs (Tata Nexon, MG ZS, Hyundai Ioniq). High voltage prevents direct handheld battery swapping.
              </p>

              <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Method:</span>
                  <span className="text-indigo-300">VoltRescue DC Mobile Unit</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Booster Size:</span>
                  <span className="text-slate-200">16 kWh to 25 kWh</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Handshake:</span>
                  <span className="text-slate-200">CCS2 / ISO 15118 protocol</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Added Range:</span>
                  <span className="text-emerald-400 font-bold">+70 to +120 km</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => {
                  onSelectCategory('4W');
                  onNavigate('dashboard');
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <span>Select 4W Platform</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. KEY BENEFITS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30">
            Engineered For Reliability
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Drivers Depend On VoltShare
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-space-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Reduced Range Anxiety</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drive with total confidence knowing that an emergency battery station is always within reach before your energy reaches zero.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-space-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Zero Dependence on Charger Queues</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bypass occupied charging bays. Swap modules or receive high-speed emergency booster energy without losing hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-space-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Return-Anywhere Freedom</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Borrow from one hub and return to another across town. The network automatically routes and reconciles inventory.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-space-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Verified Battery Health</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every bay performs impedance and State of Health (SoH) diagnostics. Depleted or degraded packs are automatically flagged and retired.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-space-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Flexible Emergency Sizing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Only pay for the emergency energy you actually need to reach your destination, rather than full battery replacement fees.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-space-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Real-Time Grid Telemetry</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live bay sensors monitor cell temperature, charging current, and voltage before releasing packs to ensure safe operation.
            </p>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-900/50 via-space-900 to-indigo-950/60 border border-cyan-500/40 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience the Emergency Power Network Now
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Test the live energy calculator, discover nearby battery hubs, and simulate reservations with zero risk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3.5 rounded-xl bg-cyan-400 text-space-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-400/25 hover:bg-cyan-300 transition-all"
            >
              Open User Dashboard
            </button>
            <button
              onClick={() => onNavigate('stations')}
              className="px-8 py-3.5 rounded-xl glass-panel text-slate-200 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Explore Station Map
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
