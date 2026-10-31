import React, { useState, useEffect, useCallback } from 'react';
import {
  PlugZap,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Sparkles,
  Zap,
  Lock,
  Timer,
  Users,
  XCircle,
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

interface SlotBay {
  bayId: string;
  status: 'available' | 'occupied' | 'reserved';
  occupiedUntilMins: number | null;
  reservedByPass: string | null;
}

interface ChargingSlotOption {
  id: string;
  stationName: string;
  distanceKm: number;
  etaMins: number;
  chargerType: string;
  chargingDuration: string;
  stationLoad: string;
  reason: string;
  badge: string;
  bays: SlotBay[];
}

interface BayAIResult {
  aiStatus: 'book-now' | 'reserve-ahead' | 'join-queue';
  aiMessage: string;
  estimatedWaitMins: number;
}

interface StationQueueEntry {
  stationId: string;
  bayId: string;
  passCode: string;
  queuePosition: number;
  estimatedWaitMins: number;
}

function computeSlotIntelligence(bay: SlotBay, userEtaMins: number): BayAIResult {
  if (bay.status === 'available') {
    return {
      aiStatus: 'book-now',
      aiMessage: 'Book Now — slot is open',
      estimatedWaitMins: 0,
    };
  }

  const effectiveUntil =
    bay.status === 'reserved'
      ? 20
      : (bay.occupiedUntilMins ?? 0);

  if (bay.status === 'occupied' && effectiveUntil <= userEtaMins) {
    return {
      aiStatus: 'reserve-ahead',
      aiMessage: `Reserve Ahead — free in ~${effectiveUntil}m`,
      estimatedWaitMins: 0,
    };
  }

  // join-queue
  const wait = effectiveUntil - userEtaMins;
  return {
    aiStatus: 'join-queue',
    aiMessage: `Queue — ~${wait}m wait after arrival`,
    estimatedWaitMins: wait,
  };
}

function generatePassCode(): string {
  return `SLOT-${Math.floor(1000 + Math.random() * 9000)}`;
}

const build2WStations = (): ChargingSlotOption[] => [
  {
    id: 'station-2w-1',
    stationName: 'VoltHub North Metro Express',
    distanceKm: 1.2,
    etaMins: 3,
    chargerType: 'VoltFast 7.4 kW AC Smart Dock',
    chargingDuration: '14 mins (~28 km)',
    stationLoad: 'Low Load (22%)',
    reason: 'Fastest arrival corridor, zero queue, high-efficiency 7.4kW thermal-regulated dock.',
    badge: 'Fastest Arrival • 0 Min Wait',
    bays: [
      { bayId: 'BAY-A', status: 'occupied', occupiedUntilMins: 10, reservedByPass: null },
      { bayId: 'BAY-B', status: 'available', occupiedUntilMins: null, reservedByPass: null },
    ],
  },
  {
    id: 'station-2w-2',
    stationName: 'VoltHub EcoPark Solar Grid',
    distanceKm: 2.1,
    etaMins: 5,
    chargerType: 'VoltFast 3.3 kW Dual Dock',
    chargingDuration: '18 mins (~30 km)',
    stationLoad: 'Minimal Load (15%)',
    reason: '100% solar microgrid power, off-peak zero tariff, sheltered bay.',
    badge: 'Eco Green Tier',
    bays: [
      { bayId: 'BAY-A', status: 'occupied', occupiedUntilMins: 8, reservedByPass: null },
      { bayId: 'BAY-B', status: 'occupied', occupiedUntilMins: 22, reservedByPass: null },
    ],
  },
];

const build4WStations = (): ChargingSlotOption[] => [
  {
    id: 'station-4w-1',
    stationName: 'VoltHub Express FastGrid',
    distanceKm: 1.6,
    etaMins: 4,
    chargerType: '50 kW CCS2 Ultra-DC',
    chargingDuration: '11 mins (~30 km)',
    stationLoad: 'Moderate Load (35%)',
    reason: 'Fastest arrival route, 50kW CCS2 compatibility, zero-car queue, active liquid cooling.',
    badge: 'Fastest DC Route • Zero Queue',
    bays: [
      { bayId: 'BAY-A', status: 'available', occupiedUntilMins: null, reservedByPass: null },
      { bayId: 'BAY-B', status: 'occupied', occupiedUntilMins: 6, reservedByPass: null },
    ],
  },
  {
    id: 'station-4w-2',
    stationName: 'VoltHub West Highway Gateway',
    distanceKm: 2.8,
    etaMins: 7,
    chargerType: '60 kW CCS2 Dual-Gun',
    chargingDuration: '10 mins (~30 km)',
    stationLoad: 'Low Load (20%)',
    reason: 'High-power 60kW DC bus, wide parking apron, 24/7 technical operator on-site.',
    badge: 'High Power 60kW',
    bays: [
      { bayId: 'BAY-A', status: 'occupied', occupiedUntilMins: 15, reservedByPass: null },
      { bayId: 'BAY-B', status: 'occupied', occupiedUntilMins: 25, reservedByPass: null },
    ],
  },
];

export const ScreenChargingSlot: React.FC<ScreenChargingSlotProps> = ({
  vehicleType,
  currentLocation,
  destination,
  routeDistanceKm,
  onBack,
  onReset,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stationList, setStationList] = useState<ChargingSlotOption[]>([]);
  const [reservedBay, setReservedBay] = useState<{ stationId: string; bayId: string; passCode: string } | null>(null);
  const [queueEntry, setQueueEntry] = useState<StationQueueEntry | null>(null);
  const [processingKey, setProcessingKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // tickCount triggers re-render when timer fires so AI results recalculate
  const [tickCount, setTickCount] = useState(0);

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setStationList(vehicleType === '2W' ? build2WStations() : build4WStations());
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [vehicleType, currentLocation, destination]);

  // 30-second countdown timer — decrements occupiedUntilMins by 0.5
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setStationList(prev =>
        prev.map(station => ({
          ...station,
          bays: station.bays.map(bay => {
            if (bay.status === 'occupied' && bay.occupiedUntilMins !== null) {
              const newMins = Math.max(0, bay.occupiedUntilMins - 0.5);
              return {
                ...bay,
                occupiedUntilMins: newMins,
                status: newMins <= 0 ? 'available' : 'occupied',
              };
            }
            return bay;
          }),
        }))
      );
      setTickCount(c => c + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // When tick fires, recalculate queue wait and notify if ready
  useEffect(() => {
    if (!queueEntry || stationList.length === 0) return;
    const station = stationList.find(s => s.id === queueEntry.stationId);
    if (!station) return;
    const bay = station.bays.find(b => b.bayId === queueEntry.bayId);
    if (!bay) return;
    const ai = computeSlotIntelligence(bay, station.etaMins);
    if (ai.estimatedWaitMins <= 0) {
      setSuccessMessage('Your queue slot is now available! Head to the station.');
      setQueueEntry(null);
    } else {
      setQueueEntry(prev => prev ? { ...prev, estimatedWaitMins: ai.estimatedWaitMins } : prev);
    }
  }, [tickCount]);

  const handleBookNow = useCallback(
    (station: ChargingSlotOption, bay: SlotBay, aiStatus: 'book-now' | 'reserve-ahead') => {
      const key = `${station.id}-${bay.bayId}`;
      if (processingKey !== null) return;
      if (reservedBay?.stationId === station.id && reservedBay?.bayId === bay.bayId) {
        setErrorMessage('This bay is already reserved by you.');
        return;
      }
      setProcessingKey(key);
      setErrorMessage(null);
      setSuccessMessage(null);

      setTimeout(() => {
        const passCode = generatePassCode();
        setStationList(prev =>
          prev.map(s => {
            if (s.id !== station.id) return s;
            return {
              ...s,
              bays: s.bays.map(b => {
                if (b.bayId !== bay.bayId) return b;
                return { ...b, status: 'reserved' as const, reservedByPass: passCode };
              }),
            };
          })
        );
        setReservedBay({ stationId: station.id, bayId: bay.bayId, passCode });
        setProcessingKey(null);
        const msg =
          aiStatus === 'reserve-ahead'
            ? `Slot pre-reserved — it will be ready on your arrival. Pass: ${passCode}`
            : `Charging slot reserved! ${bay.bayId} locked at ${station.stationName}. Pass: ${passCode}`;
        setSuccessMessage(msg);
      }, 400);
    },
    [processingKey, reservedBay]
  );

  const handleJoinQueue = useCallback(
    (station: ChargingSlotOption, bay: SlotBay, estimatedWaitMins: number) => {
      const key = `${station.id}-${bay.bayId}`;
      if (processingKey !== null) return;
      setProcessingKey(key);
      setErrorMessage(null);
      setSuccessMessage(null);

      setTimeout(() => {
        const passCode = generatePassCode();
        const queuePosition = 1;
        setQueueEntry({
          stationId: station.id,
          bayId: bay.bayId,
          passCode,
          queuePosition,
          estimatedWaitMins,
        });
        setProcessingKey(null);
        setSuccessMessage(`Joined queue at ${station.stationName} / ${bay.bayId}. Queue position: #${queuePosition}. Pass: ${passCode}`);
      }, 400);
    },
    [processingKey]
  );

  const handleCancelQueue = useCallback(() => {
    setQueueEntry(null);
    setSuccessMessage(null);
    setErrorMessage(null);
  }, []);

  // Count total available bays
  const totalAvailableBays = stationList.reduce(
    (acc, station) => acc + station.bays.filter(b => b.status === 'available').length,
    0
  );

  // Show reserved count for header pill
  const totalBays = stationList.reduce((acc, s) => acc + s.bays.length, 0);
  const headerCount = totalBays || stationList.length * 2;

  return (
    <div className="h-full w-full max-w-md mx-auto flex flex-col justify-between p-4 sm:p-5 select-none animate-in fade-in">

      {/* Top App Bar */}
      <TopHeader
        currentScreen="charging-slot"
        onBack={onBack}
        stepIndicator={reservedBay ? 'Booked' : '3 / 3'}
        vehicleType={vehicleType}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2 overflow-y-auto">

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

        {/* Station cards + controls */}
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

            {/* Success Message Banner */}
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

            {/* Header badge + title */}
            <div className="text-center space-y-0.5">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-[10px] font-mono text-blue-300">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>MULTIPLE CHARGING SLOTS FOUND ({headerCount})</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Recommended Charging Slots
              </h2>
            </div>

            {/* Station Cards */}
            <div className="space-y-2">
              {stationList.map(station => {
                const isStationReserved = reservedBay?.stationId === station.id;

                return (
                  <div
                    key={station.id}
                    className={`p-3 rounded-2xl glass-panel-glow border transition-all space-y-2 text-xs font-mono ${
                      isStationReserved
                        ? 'border-emerald-500/60 bg-emerald-950/20'
                        : 'border-blue-500/30 hover:border-blue-400'
                    }`}
                  >
                    {/* Station Header */}
                    <div className="flex items-start justify-between pb-1.5 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-white text-xs">{station.stationName}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            isStationReserved
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                              : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                          }`}>
                            {station.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-cyan-300 mt-0.5">
                          {station.distanceKm} km away • ~{station.etaMins} min ETA
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[9px] text-slate-400 uppercase">{station.stationLoad}</div>
                        <div className="text-[10px] text-slate-300">{station.chargerType}</div>
                      </div>
                    </div>

                    {/* Charger info row */}
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Duration: <strong className="text-emerald-400">{station.chargingDuration}</strong></span>
                    </div>

                    {/* Bay rows */}
                    <div className="space-y-1.5">
                      {station.bays.map(bay => {
                        const ai = computeSlotIntelligence(bay, station.etaMins);
                        const key = `${station.id}-${bay.bayId}`;
                        const isProcessing = processingKey === key;
                        const isAnotherProcessing = processingKey !== null && processingKey !== key;
                        const isThisBayReservedByUser =
                          reservedBay?.stationId === station.id && reservedBay?.bayId === bay.bayId;
                        const isInQueueHere =
                          queueEntry?.stationId === station.id && queueEntry?.bayId === bay.bayId;

                        return (
                          <div
                            key={bay.bayId}
                            className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1"
                          >
                            {/* Bay label + status pill */}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                {bay.bayId}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${
                                bay.status === 'available'
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                                  : bay.status === 'occupied'
                                  ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                                  : 'bg-blue-950 text-blue-300 border-blue-500/30'
                              }`}>
                                {bay.status === 'available'
                                  ? 'Available'
                                  : bay.status === 'occupied'
                                  ? `Occupied ~${bay.occupiedUntilMins?.toFixed(0)}m left`
                                  : 'Reserved'}
                              </span>
                            </div>

                            {/* AI recommendation line */}
                            <div className="text-[10px] text-slate-400 font-mono">
                              <span className={`${
                                ai.aiStatus === 'book-now'
                                  ? 'text-emerald-400'
                                  : ai.aiStatus === 'reserve-ahead'
                                  ? 'text-cyan-400'
                                  : 'text-violet-400'
                              }`}>
                                ◆ {ai.aiMessage}
                              </span>
                            </div>

                            {/* Action button per bay */}
                            {isThisBayReservedByUser ? (
                              <div className="w-full py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-default">
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                <span>Reserved ✓ {reservedBay?.passCode}</span>
                              </div>
                            ) : isInQueueHere ? (
                              <div className="flex items-center justify-between gap-1">
                                <div className="flex-1 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center justify-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>Queue #{queueEntry?.queuePosition} • ~{queueEntry?.estimatedWaitMins}m wait</span>
                                </div>
                                <button
                                  onClick={handleCancelQueue}
                                  className="text-[9px] text-rose-400 hover:text-rose-300 underline px-1 flex-shrink-0"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : ai.aiStatus === 'book-now' || ai.aiStatus === 'reserve-ahead' ? (
                              <button
                                onClick={() => handleBookNow(station, bay, ai.aiStatus as 'book-now' | 'reserve-ahead')}
                                disabled={isProcessing || isAnotherProcessing}
                                className="w-full py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-[10px] uppercase tracking-wider shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isProcessing ? (
                                  <>
                                    <Activity className="w-3 h-3 animate-spin" />
                                    <span>Reserving...</span>
                                  </>
                                ) : (
                                  <>
                                    <PlugZap className="w-3 h-3" />
                                    <span>Book Slot</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleJoinQueue(station, bay, ai.estimatedWaitMins)}
                                disabled={isProcessing || isAnotherProcessing || queueEntry !== null}
                                className="w-full py-1.5 rounded-lg bg-gradient-to-r from-violet-700 to-purple-600 hover:from-violet-600 hover:to-purple-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-md shadow-violet-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isProcessing ? (
                                  <>
                                    <Activity className="w-3 h-3 animate-spin" />
                                    <span>Joining...</span>
                                  </>
                                ) : (
                                  <>
                                    <Users className="w-3 h-3" />
                                    <span>Join Queue</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Why this station reason */}
                    <div className="p-1.5 rounded-lg bg-space-950/80 border border-slate-800 text-[10px] text-slate-300 leading-snug">
                      <strong className="text-blue-400 block mb-0.5">Why This Station:</strong>
                      {station.reason}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Queue Panel — inline, shown when user is in queue */}
            {queueEntry && (
              <div className="p-2.5 rounded-xl bg-violet-950/80 border border-violet-500/40 text-violet-200 text-xs font-mono animate-in fade-in">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-[11px]">
                    <Users className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                    <span>
                      Queue Position: <strong className="text-white">#{queueEntry.queuePosition}</strong>
                    </span>
                    <span>|</span>
                    <span>
                      Est. Wait: <strong className="text-violet-300">~{queueEntry.estimatedWaitMins}m</strong>
                    </span>
                  </div>
                  <button
                    onClick={handleCancelQueue}
                    className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5 underline"
                  >
                    <XCircle className="w-3 h-3" />
                    Cancel Queue
                  </button>
                </div>
                <div className="text-[10px] text-violet-300/80 mt-1 truncate">
                  Station: {stationList.find(s => s.id === queueEntry.stationId)?.stationName} • Bay: {queueEntry.bayId}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Micro Footer */}
      <div className="text-center text-[10px] font-mono text-slate-500">
        AI Queue Management • Real-time slot tracking
      </div>

    </div>
  );
};
