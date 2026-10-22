import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  BatteryCharging, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Zap, 
  RotateCcw,
  ArrowRight,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { TopHeader } from '../components/TopHeader';

interface ScreenBatteryTakeawayProps {
  vehicleType: '2W' | '4W';
  currentLocation: string;
  destination: string;
  routeDistanceKm: number;
  onBack: () => void;
  onReset: () => void;
}

interface BatteryRecommendation {
  id: string;
  stationName: string;
  distanceKm: number;
  etaMins: number;
  moduleName: string;
  nominalVoltage: string;
  capacityKwh: number;
  usableKwh: number;
  estimatedExtraRangeKm: number;
  bayId: string;
  moduleSerial: string;
  chargePct: number;
  healthPct: number;
  depositAmount: string;
  badge: string;
}

export const ScreenBatteryTakeaway: React.FC<ScreenBatteryTakeawayProps> = ({
  vehicleType,
  currentLocation,
  destination,
  routeDistanceKm,
  onBack,
  onReset,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<BatteryRecommendation | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<BatteryRecommendation | null>(null);

  // Target emergency distance: capped at 25-30 km max as specified
  const targetEmergencyKm = Math.min(30, Math.max(25, routeDistanceKm));

  // Vehicle energy calculation
  // 2W: ~0.028 kWh/km (28 Wh/km), 51.2V nominal
  // 4W: ~0.145 kWh/km (145 Wh/km), 400V nominal
  const consumptionRate = vehicleType === '2W' ? 0.028 : 0.145;
  const netEnergyKwh = targetEmergencyKm * consumptionRate;
  // Apply 90% usable DoD, 92% inverter efficiency, and 15% safety reserve
  const requiredUsableEnergyKwh = +( (netEnergyKwh / (0.90 * 0.92)) * 1.15 ).toFixed(1);

  // Dynamic recommendations: multiple ranked options
  const recommendations: BatteryRecommendation[] = vehicleType === '2W'
    ? [
        {
          id: 'opt-2w-1',
          stationName: 'VoltHub Downtown Central',
          distanceKm: 1.2,
          etaMins: 4,
          moduleName: 'VoltPack-50 Swappable LFP Module',
          nominalVoltage: '51.2V LFP Platform',
          capacityKwh: 1.8,
          usableKwh: requiredUsableEnergyKwh,
          estimatedExtraRangeKm: targetEmergencyKm,
          bayId: 'BAY-02',
          moduleSerial: 'VP50-LFP-8822',
          chargePct: 100,
          healthPct: 99,
          depositAmount: '₹1,200',
          badge: 'Top Match • Nearest',
        },
        {
          id: 'opt-2w-2',
          stationName: 'VoltHub North Metro Flyover',
          distanceKm: 2.4,
          etaMins: 6,
          moduleName: 'VoltPack-72 High-Drain Modular Pack',
          nominalVoltage: '72V / 51.2V Smart Bus',
          capacityKwh: 2.2,
          usableKwh: +(requiredUsableEnergyKwh + 0.3).toFixed(1),
          estimatedExtraRangeKm: Math.min(30, targetEmergencyKm + 2),
          bayId: 'BAY-04',
          moduleSerial: 'VP72-NMC-4109',
          chargePct: 98,
          healthPct: 98,
          depositAmount: '₹1,400',
          badge: 'High Capacity',
        },
      ]
    : [
        {
          id: 'opt-4w-1',
          stationName: 'VoltHub Express FastGrid',
          distanceKm: 1.8,
          etaMins: 5,
          moduleName: 'VoltRescue DC Mobile Unit (CCS2)',
          nominalVoltage: '400V High-Voltage Bus',
          capacityKwh: 16.0,
          usableKwh: requiredUsableEnergyKwh,
          estimatedExtraRangeKm: targetEmergencyKm,
          bayId: 'BAY-06 (DC Fast)',
          moduleSerial: 'VR400-DC-1090',
          chargePct: 98,
          healthPct: 100,
          depositAmount: '₹3,500',
          badge: 'Optimal Route • Zero Queue',
        },
        {
          id: 'opt-4w-2',
          stationName: 'VoltHub West Industrial Gateway',
          distanceKm: 3.2,
          etaMins: 8,
          moduleName: 'VoltRescue Ultra-DC Booster Unit',
          nominalVoltage: '400V / 800V Architecture',
          capacityKwh: 20.0,
          usableKwh: +(requiredUsableEnergyKwh + 0.8).toFixed(1),
          estimatedExtraRangeKm: 30,
          bayId: 'BAY-01 (Tether)',
          moduleSerial: 'VR400-DC-1095',
          chargePct: 100,
          healthPct: 99,
          depositAmount: '₹3,500',
          badge: 'Alternative Hub',
        },
      ];

  // Automatic recommendation generation on screen entry
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setSelectedOption(recommendations[0]);
    }, 450);
    return () => clearTimeout(timer);
  }, [vehicleType, currentLocation, destination]);

  const handleReserve = (opt: BatteryRecommendation) => {
    setConfirmedReservation(opt);
  };

  return (
    <div className="h-full w-full max-w-md mx-auto flex flex-col justify-between p-4 sm:p-5 select-none animate-in fade-in">
      
      {/* Top App Bar */}
      <TopHeader 
        currentScreen="battery-takeaway" 
        onBack={confirmedReservation ? () => setConfirmedReservation(null) : onBack} 
        stepIndicator={confirmedReservation ? 'Confirmed' : '3 / 3'}
        vehicleType={vehicleType}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-3 py-12 text-center animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Activity className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-cyan-300 uppercase">
                AI Compatibility Engine Active
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Matching available battery configurations along your route...
              </p>
            </div>
          </div>
        )}

        {/* STAGE 1: AUTOMATIC MULTIPLE RECOMMENDATIONS */}
        {!isLoading && !confirmedReservation && (
          <div className="space-y-3 animate-in fade-in">
            
            {/* Context Summary Strip */}
            <div className="p-2.5 rounded-xl bg-space-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="truncate max-w-[200px]">
                <span className="text-slate-400 block text-[9px] uppercase">Route Corridor</span>
                <span className="text-white font-bold truncate block">{destination}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-slate-400 block text-[9px] uppercase">Target Emergency Range</span>
                <span className="text-cyan-400 font-bold">~{targetEmergencyKm} km Max</span>
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>MULTIPLE SUITABLE OPTIONS FOUND ({recommendations.length})</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Recommended Battery Takeaway
              </h2>
            </div>

            {/* Multiple Compact Recommendation Cards */}
            <div className="space-y-2.5">
              {recommendations.map((rec, index) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-2xl glass-panel-glow border border-cyan-500/30 hover:border-cyan-400 transition-all space-y-2 text-xs font-mono"
                >
                  {/* Card Header: Station & Distance */}
                  <div className="flex items-start justify-between pb-1.5 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">{rec.stationName}</span>
                        <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 text-[9px] border border-cyan-500/30 font-bold">
                          {rec.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-300">
                        {rec.distanceKm} km away • ~{rec.etaMins} min ETA
                      </div>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-bold">
                      {rec.bayId}
                    </span>
                  </div>

                  {/* Config & Energy Specs */}
                  <div className="space-y-1 text-[11px]">
                    <div className="text-slate-300">
                      <strong className="text-white">{rec.moduleName}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>Energy Available: <strong className="text-cyan-300">{rec.usableKwh} kWh</strong></span>
                      <span>Added Range: <strong className="text-emerald-400">+{rec.estimatedExtraRangeKm} km</strong></span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>SoC: <strong className="text-white">{rec.chargePct}%</strong> • SoH: <strong className="text-emerald-400">{rec.healthPct}%</strong></span>
                      <span>Deposit: <strong className="text-slate-300">{rec.depositAmount}</strong></span>
                    </div>
                  </div>

                  {/* One-Click Reserve Button */}
                  <button
                    onClick={() => handleReserve(rec)}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <BatteryCharging className="w-3.5 h-3.5" />
                    <span>Reserve Battery</span>
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* STAGE 2: IN-SCREEN CONFIRMATION */}
        {confirmedReservation && (
          <div className="space-y-3 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div className="space-y-0.5">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase">
                Battery Bay {confirmedReservation.bayId} Locked
              </div>
              <h2 className="text-lg font-black text-white">Reservation Confirmed</h2>
              <p className="text-[11px] text-slate-400">
                Collect at <strong className="text-white">{confirmedReservation.stationName}</strong>
              </p>
            </div>

            {/* PIN & Serial Pass */}
            <div className="p-3 rounded-2xl bg-space-950 border border-cyan-500/30 max-w-xs mx-auto space-y-1 font-mono">
              <div className="text-[10px] uppercase text-slate-400">Pickup Pass PIN</div>
              <div className="text-xl font-black text-cyan-300 tracking-widest">
                VLT-{Math.floor(1000 + Math.random() * 9000)}
              </div>
              <div className="text-[10px] text-slate-400">
                Held for 15 mins • Serial: {confirmedReservation.moduleSerial}
              </div>
            </div>

            {/* Return Policy Notice */}
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-[11px] text-slate-400">
              <strong className="text-slate-200 block">Return Anywhere Freedom:</strong>
              Return depleted modules to any participating station. Your security deposit ({confirmedReservation.depositAmount}) will be refunded immediately.
            </div>

            {/* Done Action */}
            <button
              onClick={onReset}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Done • Return to Home
            </button>
          </div>
        )}

      </div>

      {/* Bottom Micro Footer */}
      <div className="text-center text-[10px] font-mono text-slate-500">
        AI Ranked by electrical compatibility & proximity • 25–30 km range
      </div>

    </div>
  );
};
