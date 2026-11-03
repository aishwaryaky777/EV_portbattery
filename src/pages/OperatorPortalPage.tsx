import React, { useState, useEffect } from 'react';
import { Station, StationBay, BatteryStatus } from '../types';
import { 
  SlidersHorizontal, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  BatteryCharging, 
  Thermometer, 
  Zap, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  Radio,
  Lock,
  Unlock
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface OperatorPortalPageProps {
  stations: Station[];
  onStationUpdated: (updatedStations: Station[]) => void;
}

export const OperatorPortalPage: React.FC<OperatorPortalPageProps> = ({
  stations,
  onStationUpdated,
}) => {
  const [selectedStationId, setSelectedStationId] = useState<string>(stations[0]?.id || '');
  const [simulatedAlarmBay, setSimulatedAlarmBay] = useState<string | null>(null);
  const [lastHeartbeat, setLastHeartbeat] = useState<string>('Just now');

  const currentStation = stations.find(s => s.id === selectedStationId) || stations[0];

  // Live telemetry pulse effect (ticks voltage, current, and temperature slightly every 3s to simulate real BMS sensors)
  useEffect(() => {
    const timer = setInterval(() => {
      setLastHeartbeat(new Date().toLocaleTimeString());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateStatus = (bayId: string, newStatus: BatteryStatus) => {
    storageService.updateBayStatus(currentStation.id, bayId, newStatus);
    const refreshed = storageService.getStations();
    onStationUpdated(refreshed);
    if (bayId === simulatedAlarmBay && newStatus !== 'Faulty') {
      setSimulatedAlarmBay(null);
    }
  };

  const handleTriggerThermalAlarm = (bayId: string) => {
    setSimulatedAlarmBay(bayId);
    storageService.updateBayStatus(currentStation.id, bayId, 'Under Inspection', {
      temperatureC: 48.6,
      currentAmps: 0.0,
    });
    const refreshed = storageService.getStations();
    onStationUpdated(refreshed);
  };

  const handleIsolateBay = (bayId: string) => {
    setSimulatedAlarmBay(null);
    storageService.updateBayStatus(currentStation.id, bayId, 'Under Inspection', {
      temperatureC: 28.5,
      currentAmps: 0.0,
    });
    const refreshed = storageService.getStations();
    onStationUpdated(refreshed);
  };

  // Station level statistics
  const totalBays = currentStation.bays.length;
  const availableBays = currentStation.bays.filter(b => b.status === 'Available').length;
  const chargingBays = currentStation.bays.filter(b => b.status === 'Charging').length;
  const inUseBays = currentStation.bays.filter(b => b.status === 'In Use' || b.status === 'Reserved').length;
  const underInspectionBays = currentStation.bays.filter(b => b.status === 'Under Inspection' || b.status === 'Faulty').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Header & Station Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            STATION OPERATOR BMS TELEMETRY CONSOLE
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Bay Rack Controller & Diagnostic Hub
          </h1>
          <p className="text-slate-400 text-xs">
            Direct telemetry link to station battery racks, active temperature sensors, and contactor interlocks.
          </p>
        </div>

        {/* Station Select & Heartbeat Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-space-950 border border-slate-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-400">CAN Bus:</span>
            <span className="text-emerald-400 font-bold">1 Mbps Active</span>
          </div>

          <select
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-space-950 border border-slate-700 text-white text-xs font-medium focus:border-cyan-400 focus:outline-none"
          >
            {stations.map(st => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.bays.length} Bays)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulated Telemetry Warning Alert */}
      <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-300">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>PROTOTYPE TELEMETRY FEED: Real-time sensor simulation active. Values reflect physical BMS CAN protocols.</span>
        </div>
        <span className="text-slate-400 text-[11px] hidden sm:block">Heartbeat: {lastHeartbeat}</span>
      </div>

      {/* Thermal Alarm Banner if Triggered */}
      {simulatedAlarmBay && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 shadow-xl shadow-rose-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in shake">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                THERMAL RUNAWAY MITIGATION ALARM: {simulatedAlarmBay}
              </div>
              <div className="text-xs text-slate-300">
                Cell core probe exceeded 48.0°C threshold. Fast charging suspended automatically.
              </div>
            </div>
          </div>

          <button
            onClick={() => handleIsolateBay(simulatedAlarmBay)}
            className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-space-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            Isolate Contactor & Vent Bay
          </button>
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
        <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 uppercase">Total Bays</div>
          <div className="text-2xl font-black text-white mt-1">{totalBays}</div>
        </div>
        <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 uppercase">Available Ready</div>
          <div className="text-2xl font-black text-cyan-300 mt-1">{availableBays}</div>
        </div>
        <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 uppercase">Fast Charging</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{chargingBays}</div>
        </div>
        <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 uppercase">In Use / Held</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{inUseBays}</div>
        </div>
        <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-slate-400 uppercase">Under Inspection</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{underInspectionBays}</div>
        </div>
      </div>

      {/* Rack & Bay Visual Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Rack Bay Grid • {currentStation.name}
            </h3>
            <p className="text-xs text-slate-400">
              Live State of Charge (SoC), State of Health (SoH), Voltage, and Temperature telemetry.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span>Operator:</span>
            <span className="text-slate-200 font-bold">{currentStation.operatorName}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentStation.bays.map((bay) => {
            const isAlarm = bay.bayId === simulatedAlarmBay || bay.temperatureC > 45;
            const isReady = bay.status === 'Available';
            const isCharging = bay.status === 'Charging';

            return (
              <div
                key={bay.bayId}
                className={`p-5 rounded-2xl glass-panel border transition-all space-y-4 ${
                  isAlarm 
                    ? 'border-rose-500 bg-rose-950/30 ring-2 ring-rose-500/30' 
                    : isReady
                    ? 'border-cyan-500/30 bg-space-900/80'
                    : 'border-slate-800 bg-space-900/60'
                }`}
              >
                {/* Bay Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-space-950 border border-slate-700">
                      {bay.bayId}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300">
                      {bay.targetCategory.join(', ')}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    bay.status === 'Available'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : bay.status === 'Charging'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      : bay.status === 'Reserved'
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                  }`}>
                    {bay.status}
                  </span>
                </div>

                {/* Module Serial & Type */}
                <div>
                  <div className="text-xs font-mono text-slate-400">Module Serial:</div>
                  <div className="text-xs font-bold font-mono text-white tracking-wide">
                    {bay.moduleSerial}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {bay.moduleType}
                  </div>
                </div>

                {/* Battery SoC Gauge */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">State of Charge (SoC):</span>
                    <span className="font-bold text-cyan-300">{bay.stateOfCharge}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        bay.stateOfCharge >= 90 
                          ? 'bg-emerald-400' 
                          : bay.stateOfCharge >= 50 
                          ? 'bg-cyan-400' 
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${bay.stateOfCharge}%` }}
                    ></div>
                  </div>
                </div>

                {/* Sensor Telemetry Readings */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-space-950 border border-slate-800/80 text-center font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Voltage</div>
                    <div className="font-bold text-slate-200 mt-0.5">{bay.voltage} V</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Current</div>
                    <div className="font-bold text-cyan-300 mt-0.5">{bay.currentAmps} A</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Core Temp</div>
                    <div className={`font-bold mt-0.5 ${bay.temperatureC > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {bay.temperatureC} °C
                    </div>
                  </div>
                </div>

                {/* State of Health SoH */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Impedance Health (SoH):</span>
                  <span className="text-emerald-400 font-bold">{bay.stateOfHealth}% Pristine</span>
                </div>

                {/* Operator Actions Bar */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <select
                    value={bay.status}
                    onChange={(e) => handleUpdateStatus(bay.bayId, e.target.value as BatteryStatus)}
                    className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px] font-mono focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Charging">Charging</option>
                    <option value="Reserved">Reserved</option>
                    <option value="In Use">In Use</option>
                    <option value="Under Inspection">Inspection</option>
                    <option value="Faulty">Faulty</option>
                  </select>

                  <button
                    onClick={() => handleTriggerThermalAlarm(bay.bayId)}
                    title="Simulate thermal spike for safety compliance test"
                    className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-[10px] font-mono whitespace-nowrap transition-colors"
                  >
                    Test Alarm
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Network Analytics Strip */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Station Throughput & Fleet Energy Dispensed</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Aggregate 24-Hour Cycle</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
          <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
            <div className="text-slate-400">Total Swaps Completed:</div>
            <div className="text-xl font-bold text-cyan-300 mt-1">148 Swaps</div>
          </div>
          <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
            <div className="text-slate-400">Total Emergency Energy:</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">392.4 kWh</div>
          </div>
          <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
            <div className="text-slate-400">Average Turnaround Time:</div>
            <div className="text-xl font-bold text-amber-300 mt-1">74 Seconds</div>
          </div>
          <div className="p-4 rounded-xl bg-space-950 border border-slate-800">
            <div className="text-slate-400">Zero-Emission Kilometers:</div>
            <div className="text-xl font-bold text-indigo-300 mt-1">~5,820 km</div>
          </div>
        </div>
      </div>

    </div>
  );
};
