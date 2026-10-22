import React, { useState, useEffect } from 'react';
import { 
  PlugZap, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Activity, 
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';
import { TopHeader } from '../components/TopHeader';

interface ScreenChargingSlotProps {
  vehicleType: '2W' | '4W';
  currentLocation: string;
  destination: string;
  routeDistanceKm: number;
  onBack: () => void;
  onReset: () => void;
}

interface ChargingSlotOption {
  id: string;
  stationName: string;
  distanceKm: number;
  etaMins: number;
  chargerType: string;
  availableTime: string;
  waitingTime: string;
  chargingDuration: string;
  bayId: string;
  stationLoad: string;
  reason: string;
  badge: string;
}

export const ScreenChargingSlot: React.FC<ScreenChargingSlotProps> = ({
  vehicleType,
  currentLocation,
  destination,
  routeDistanceKm,
  onBack,
  onReset,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [slotList, setSlotList] = useState<ChargingSlotOption[]>([]);
  const [processingSlotId, setProcessingSlotId] = useState<string | null>(null);
  const [reservedSlotId, setReservedSlotId] = useState<string | null>(null);
  const [bookingPassCode, setBookingPassCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Recommendations calculated based on vehicle category and location/route
  const initialRecommendations: ChargingSlotOption[] = vehicleType === '2W'
    ? [
        {
          id: 'slot-2w-1',
          stationName: 'VoltHub North Metro Express',
          distanceKm: 1.2,
          etaMins: 3,
          chargerType: 'VoltFast 7.4 kW AC Smart Dock',
          availableTime: 'Immediate Access (Slot Open)',
          waitingTime: '0 min wait (Bay 03 Ready)',
          chargingDuration: '14 mins (~28 km emergency boost)',
          bayId: 'BAY-03 (AC Rapid)',
          stationLoad: 'Low Load (22%)',
          reason: 'Fastest arrival corridor, zero queue, high-efficiency 7.4kW thermal-regulated dock.',
          badge: 'Fastest Arrival • 0 Min Wait',
        },
        {
          id: 'slot-2w-2',
          stationName: 'VoltHub EcoPark Solar Grid',
          distanceKm: 2.1,
          etaMins: 5,
          chargerType: 'VoltFast 3.3 kW Dual Dock',
          availableTime: 'Immediate Access',
          waitingTime: '1 min wait (Bay 01 Open)',
          chargingDuration: '18 mins (~30 km boost)',
          bayId: 'BAY-01 (Eco Solar)',
          stationLoad: 'Minimal Load (15%)',
          reason: '100% solar microgrid power, off-peak zero tariff, sheltered bay.',
          badge: 'Eco Green Tier',
        },
      ]
    : [
        {
          id: 'slot-4w-1',
          stationName: 'VoltHub Express FastGrid',
          distanceKm: 1.6,
          etaMins: 4,
          chargerType: '50 kW CCS2 Ultra-DC Fast Coupler',
          availableTime: 'Immediate Access',
          waitingTime: '0 min wait (Bay 05 Ready)',
          chargingDuration: '11 mins (~30 km emergency boost)',
          bayId: 'BAY-05 (DC High-Rate)',
          stationLoad: 'Moderate Load (35%)',
          reason: 'Fastest arrival route, 50kW CCS2 compatibility, zero-car queue, active liquid cooling.',
          badge: 'Fastest DC Route • Zero Queue',
        },
        {
          id: 'slot-4w-2',
          stationName: 'VoltHub West Highway Gateway',
          distanceKm: 2.8,
          etaMins: 7,
          chargerType: '60 kW CCS2 Dual-Gun Fast Charger',
          availableTime: 'Immediate Access',
          waitingTime: '2 min wait (Bay 02 Pre-cleared)',
          chargingDuration: '10 mins (~30 km boost)',
          bayId: 'BAY-02 (DC Ultra)',
          stationLoad: 'Low Load (20%)',
          reason: 'High-power 60kW DC bus, wide parking apron, 24/7 technical operator on-site.',
          badge: 'High Power 60kW',
        },
      ];

  // Automatic recommendation generation on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setSlotList(initialRecommendations);
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [vehicleType, currentLocation, destination]);

  // Direct Immediate Reservation Process
  const handleImmediateBooking = (option: ChargingSlotOption) => {
    // Prevent duplicate reservations while processing
    if (processingSlotId !== null) return;

    // Check if slot is already reserved
    if (reservedSlotId === option.id) {
      setErrorMessage('This charging slot is already reserved.');
      return;
    }

    setProcessingSlotId(option.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Process booking directly without secondary confirmation dialogs
    setTimeout(() => {
      try {
        const passId = `SLOT-${Math.floor(1000 + Math.random() * 9000)}`;
        setBookingPassCode(passId);
        setReservedSlotId(option.id);

        // Update slot availability in state so it is no longer shown as available
        setSlotList(prev => prev.map(s => {
          if (s.id === option.id) {
            return {
              ...s,
              availableTime: 'Reserved by You',
              waitingTime: 'Bay Locked',
              badge: '✓ Reserved Slot',
            };
          }
          return s;
        }));

        setProcessingSlotId(null);
        setSuccessMessage(`Charging slot reserved successfully! ${option.bayId} locked at ${option.stationName}. Pass: ${passId}`);
      } catch (err) {
        setProcessingSlotId(null);
        setErrorMessage('Reservation failed. Please choose an alternative slot.');
      }
    }, 400);
  };

  return (
    <div className="h-full w-full max-w-md mx-auto flex flex-col justify-between p-4 sm:p-5 select-none animate-in fade-in">
      
      {/* Top App Bar */}
      <TopHeader 
        currentScreen="charging-slot" 
        onBack={onBack} 
        stepIndicator={reservedSlotId ? 'Booked' : '3 / 3'}
        vehicleType={vehicleType}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-3 py-12 text-center animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Activity className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-blue-300 uppercase">
                AI Slot Optimizer Active
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Scanning queue times and charger compatibility...
              </p>
            </div>
          </div>
        )}

        {/* AUTOMATIC RECOMMENDATIONS & DIRECT RESERVATION */}
        {!isLoading && (
          <div className="space-y-2.5 animate-in fade-in">
            
            {/* Context Summary Strip */}
            <div className="p-2.5 rounded-xl bg-space-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="truncate max-w-[200px]">
                <span className="text-slate-400 block text-[9px] uppercase">Destination Route</span>
                <span className="text-white font-bold truncate block">{destination}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-slate-400 block text-[9px] uppercase">Target Boost</span>
                <span className="text-cyan-400 font-bold">25–30 km Emergency</span>
              </div>
            </div>

            {/* Direct Success Message Banner */}
            {successMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs font-mono flex items-start gap-2 shadow-lg shadow-emerald-950/50 animate-in fade-in slide-in-from-top-1">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <div className="font-bold text-white text-[11px]">Charging slot reserved successfully!</div>
                  <div className="text-[10px] text-emerald-300 mt-0.5">{successMessage}</div>
                </div>
              </div>
            )}

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-950/90 border border-rose-500/60 text-rose-300 text-xs font-mono flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="text-[11px]">{errorMessage}</span>
              </div>
            )}

            <div className="text-center space-y-0.5">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-[10px] font-mono text-blue-300">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>MULTIPLE CHARGING SLOTS FOUND ({slotList.length})</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Recommended Charging Slots
              </h2>
            </div>

            {/* Multiple Compact Cards */}
            <div className="space-y-2">
              {slotList.map((slot) => {
                const isThisSlotReserved = reservedSlotId === slot.id;
                const isThisSlotProcessing = processingSlotId === slot.id;
                const isAnotherProcessing = processingSlotId !== null && processingSlotId !== slot.id;

                return (
                  <div
                    key={slot.id}
                    className={`p-3 rounded-2xl glass-panel-glow border transition-all space-y-2 text-xs font-mono ${
                      isThisSlotReserved
                        ? 'border-emerald-500/60 bg-emerald-950/20'
                        : 'border-blue-500/30 hover:border-blue-400'
                    }`}
                  >
                    {/* Card Header: Station & Distance */}
                    <div className="flex items-start justify-between pb-1.5 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-xs">{slot.stationName}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            isThisSlotReserved
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                              : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                          }`}>
                            {slot.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-cyan-300">
                          {slot.distanceKm} km away • ~{slot.etaMins} min ETA
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold ${
                        isThisSlotReserved ? 'text-emerald-400' : 'text-emerald-400'
                      }`}>
                        {slot.waitingTime}
                      </span>
                    </div>

                    {/* Charging Details & Explanation */}
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-300">
                        <span>Availability: <strong className={isThisSlotReserved ? 'text-emerald-400' : 'text-white'}>{slot.availableTime}</strong></span>
                        <span>Bay: <strong className="text-cyan-300">{slot.bayId}</strong></span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span>Charger: <strong className="text-slate-200">{slot.chargerType}</strong></span>
                        <span>Duration: <strong className="text-emerald-400">{slot.chargingDuration.split(' ')[0]} {slot.chargingDuration.split(' ')[1]}</strong></span>
                      </div>

                      {/* Short Reason */}
                      <div className="p-1.5 rounded-lg bg-space-950/80 border border-slate-800 text-[10px] text-slate-300 leading-snug">
                        <strong className="text-blue-400 block mb-0.5">Why This Slot:</strong>
                        {slot.reason}
                      </div>
                    </div>

                    {/* Direct Immediate Action Button (No Second Confirmation Step) */}
                    {isThisSlotReserved ? (
                      <div className="w-full py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-default">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Reserved by You ({bookingPassCode})</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleImmediateBooking(slot)}
                        disabled={isThisSlotProcessing || isAnotherProcessing}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isThisSlotProcessing ? (
                          <>
                            <Activity className="w-3.5 h-3.5 animate-spin" />
                            <span>Reserving Slot...</span>
                          </>
                        ) : (
                          <>
                            <PlugZap className="w-3.5 h-3.5" />
                            <span>Book Slot</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>



          </div>
        )}

      </div>

      {/* Micro Footer */}
      <div className="text-center text-[10px] font-mono text-slate-500">
        Immediate reservation • Direct booking confirmation
      </div>

    </div>
  );
};
