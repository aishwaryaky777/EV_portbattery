import React, { useState } from 'react';
import { Station, Reservation, ReturnInspectionResult } from '../types';
import { 
  RotateCcw, 
  CheckCircle, 
  QrCode, 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  ArrowRight,
  Receipt,
  Download
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface ReturnBatteryPageProps {
  stations: Station[];
  activeReservation: Reservation | null;
  onReturnCompleted: (resId: string, result: ReturnInspectionResult) => void;
  onNavigate: (tab: string) => void;
}

export const ReturnBatteryPage: React.FC<ReturnBatteryPageProps> = ({
  stations,
  activeReservation,
  onReturnCompleted,
  onNavigate,
}) => {
  // If no real active reservation exists, create a default active demo session so the user can test the return flow right away!
  const demoActiveReservation: Reservation = {
    id: 'res-demo-active',
    reservationCode: 'VLT-7712-B9',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=RETURN_VLT_7712_B9',
    createdAt: 'Today, 10:15 AM',
    expiresAt: 'Open Window',
    status: 'In Use',
    vehicle: {
      category: '2W',
      modelName: 'Ather 450X Gen 3',
      nominalVoltage: 51.2,
      currentSoC: 22,
      desiredRangeKm: 40,
    },
    station: {
      id: 'station-dt-01',
      name: 'VoltHub Downtown Metro Central',
      address: '42 Silicon Avenue, Outer Ring Road Junction',
      area: 'Downtown Tech Zone',
    },
    assignedBayId: 'BAY-02',
    moduleSerial: 'VP50-LFP-8822',
    configurationDescription: 'VoltPack-50 (48V/51.2V 1.8kWh LFP Module)',
    requiredEnergyKwh: 1.8,
    usableEnergyKwh: 1.8,
    estimatedRangeKm: 48,
    securityDeposit: 1200,
    energyFee: 42,
    totalEstimate: 1242,
    pickupTimeWindow: 'Collected',
    returnDueTime: 'Flexible (Any Station)',
  };

  const currentBorrow = activeReservation || demoActiveReservation;

  // Selected return station
  const [selectedReturnStationId, setSelectedReturnStationId] = useState<string>(stations[1]?.id || stations[0]?.id || '');
  const [returnQrInput, setReturnQrInput] = useState<string>(currentBorrow.reservationCode);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionStep, setInspectionStep] = useState(0);
  const [inspectionResult, setInspectionResult] = useState<ReturnInspectionResult | null>(null);

  const selectedStation = stations.find(s => s.id === selectedReturnStationId) || stations[0];

  const handleStartReturnInspection = () => {
    setIsInspecting(true);
    setInspectionStep(1);

    // Simulated automated multi-step return diagnostic sequence
    setTimeout(() => setInspectionStep(2), 1000); // Voltage & Pin Resistance Check
    setTimeout(() => setInspectionStep(3), 2000); // Thermal & Cell Balance Check
    setTimeout(() => setInspectionStep(4), 3000); // Physical Casing & BMS SoH Readout

    setTimeout(() => {
      const result: ReturnInspectionResult = {
        passed: true,
        inspectionId: `INSP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        voltageVerified: true,
        measuredVoltage: 48.6, // safe discharge voltage
        temperatureC: 27.8, // normal operating temp
        thermalSafetyCheck: 'Pass',
        casingIntegrity: 'Pristine',
        internalBmsHealth: 99, // 99% SoH
        energyConsumedKwh: 1.45,
        finalBilledAmount: 38,
        depositRefunded: currentBorrow.securityDeposit,
        officerSignoff: `${selectedStation.operatorName} (Certified Auto-Gate)`,
      };

      setInspectionResult(result);
      setIsInspecting(false);
      onReturnCompleted(currentBorrow.id, result);
    }, 3800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          UNIVERSAL RETURN ANYWHERE PORTAL
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          Return Depleted Battery Modules
        </h1>
        <p className="text-slate-400 text-sm">
          Return borrowed modules to any participating hub across the city. Automated diagnostics verify state of health and release your deposit instantly.
        </p>
      </div>

      {!inspectionResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Active Borrow Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl glass-panel-glow border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold uppercase text-cyan-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  Active Module Borrowed
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {currentBorrow.status}
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Reservation ID:</span>
                  <span className="font-bold text-white">{currentBorrow.reservationCode}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Module Serial:</span>
                  <span className="text-cyan-300">{currentBorrow.moduleSerial}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Borrowed At:</span>
                  <span className="text-slate-300">{currentBorrow.station.name.split(' ')[1]} Hub</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Held Security Deposit:</span>
                  <span className="text-emerald-400 font-bold">₹{currentBorrow.securityDeposit}</span>
                </div>
              </div>

              {/* QR Code for Station Bay Scanner */}
              <div className="p-4 rounded-xl bg-space-950 border border-slate-800 text-center space-y-2">
                <div className="bg-white p-2 rounded-lg inline-block">
                  <img src={currentBorrow.qrCodeUrl} alt="Return QR" className="w-28 h-28 mx-auto" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Scan this QR code at the automated return bay gate.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <div className="font-bold text-slate-200">Return Anywhere Flexibility</div>
              <p>
                Unlike proprietary charging cables, you never need to journey back to your origin station. Our smart balancing algorithm dynamically redistributes packs across the grid.
              </p>
            </div>
          </div>

          {/* Return Station Selection & Automated Return Terminal */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-cyan-500/30 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Select Participating Return Hub</span>
              </h3>

              {/* Station dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Target Station
                </label>
                <select
                  value={selectedReturnStationId}
                  onChange={(e) => setSelectedReturnStationId(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-space-950 border border-slate-700 text-white text-xs font-medium focus:border-cyan-400 focus:outline-none"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.distanceKm ?? 2.5} km • {st.availableReturnSlots} Dropoff Bays Available)
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Station Return Readiness Indicator */}
              <div className="p-4 rounded-xl bg-space-950/80 border border-emerald-500/20 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Return Bay Status:</span>
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Ready for Module Ingress
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Compatible Return Slots:</span>
                  <span className="font-mono text-white">{selectedStation.availableReturnSlots} Empty Bays</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Station Supervisor:</span>
                  <span className="text-slate-300">{selectedStation.operatorName}</span>
                </div>
              </div>

              {/* Bay Verification Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Confirm Reservation / Serial Code
                </label>
                <input
                  type="text"
                  value={returnQrInput}
                  onChange={(e) => setReturnQrInput(e.target.value)}
                  placeholder="e.g. VLT-7712-B9"
                  className="w-full px-4 py-3 rounded-xl bg-space-950 border border-slate-700 text-white font-mono text-sm tracking-wider focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Return Diagnostics Simulator Button */}
              {!isInspecting ? (
                <button
                  onClick={handleStartReturnInspection}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-space-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Insert Into Bay & Run Automated Inspection</span>
                </button>
              ) : (
                /* Inspection Progress Steps */
                <div className="p-5 rounded-xl bg-space-950 border border-cyan-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span className="flex items-center gap-2">
                      <Activity className="w-4 h-4 animate-spin text-cyan-400" />
                      AUTOMATED BMS DIAGNOSTIC IN PROGRESS...
                    </span>
                    <span>Step {inspectionStep} / 4</span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                      style={{ width: `${(inspectionStep / 4) * 100}%` }}
                    ></div>
                  </div>

                  <div className="text-xs font-mono space-y-1 pt-1">
                    <div className={inspectionStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}>
                      ✓ Step 1: Physical docking lock engagement
                    </div>
                    <div className={inspectionStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}>
                      {inspectionStep >= 2 ? '✓ Step 2: Bus voltage & insulation resistance check (48.6V OK)' : '○ Step 2: Checking voltage & isolation...'}
                    </div>
                    <div className={inspectionStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}>
                      {inspectionStep >= 3 ? '✓ Step 3: Thermal safety probe (27.8°C Normal - Pass)' : '○ Step 3: Probing cell thermal status...'}
                    </div>
                    <div className={inspectionStep >= 4 ? 'text-emerald-400' : 'text-slate-600'}>
                      {inspectionStep >= 4 ? '✓ Step 4: BMS CAN handshake & State of Health verified (99% SoH)' : '○ Step 4: Finalizing signoff...'}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      ) : (
        /* Return Success & Deposit Refund Settlement Receipt */
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-space-900 border border-emerald-500/40 shadow-2xl space-y-6 animate-in zoom-in-95">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase">
              Module Return Cleared & Certified
            </span>
            <h2 className="text-2xl font-black text-white">Deposit Settlement Receipt</h2>
            <p className="text-xs text-slate-400">
              Module <strong className="text-cyan-300 font-mono">{currentBorrow.moduleSerial}</strong> successfully returned to <strong className="text-white">{selectedStation.name}</strong>.
            </p>
          </div>

          {/* Diagnostic Report Grid */}
          <div className="p-4 rounded-xl bg-space-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider pb-1 border-b border-slate-800">
              Diagnostic Health Inspection Report
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-slate-400">Inspection ID:</div>
              <div className="text-right text-white font-bold">{inspectionResult.inspectionId}</div>

              <div className="text-slate-400">Inspected Voltage:</div>
              <div className="text-right text-cyan-300">{inspectionResult.measuredVoltage} V (Discharge OK)</div>

              <div className="text-slate-400">Cell Temperature:</div>
              <div className="text-right text-emerald-400">{inspectionResult.temperatureC} °C (Thermal Pass)</div>

              <div className="text-slate-400">BMS Battery SoH:</div>
              <div className="text-right text-emerald-400 font-bold">{inspectionResult.internalBmsHealth}% (Pristine Health)</div>

              <div className="text-slate-400">Casing Enclosure:</div>
              <div className="text-right text-white">{inspectionResult.casingIntegrity}</div>

              <div className="text-slate-400">Station Sign-off:</div>
              <div className="text-right text-slate-300 text-[11px]">{inspectionResult.officerSignoff}</div>
            </div>
          </div>

          {/* Financial Settlement */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Original Security Deposit Held:</span>
              <span className="font-mono text-white">₹{currentBorrow.securityDeposit}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Actual Energy Consumed ({inspectionResult.energyConsumedKwh} kWh):</span>
              <span className="font-mono text-slate-200">₹{inspectionResult.finalBilledAmount}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm">
              <span className="text-white">Security Deposit Refund Issued:</span>
              <span className="font-mono text-emerald-400">₹{inspectionResult.depositRefunded}</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Refund credited instantly to your linked payment method.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setInspectionResult(null);
                onNavigate('dashboard');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-space-950 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Return to User Dashboard
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
