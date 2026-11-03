import React, { useState, useEffect } from 'react';
import { Station, StationBay, VehicleModel, VehicleCategory, Reservation } from '../types';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Zap, 
  QrCode, 
  MapPin, 
  ArrowRight,
  Info
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: Station;
  vehicle: VehicleModel | null;
  category: VehicleCategory;
  desiredRangeKm: number;
  currentSoC: number;
  usableEnergyKwh: number;
  estimatedExtraRangeKm: number;
  moduleType: string;
  onSuccess: (reservation: Reservation) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  station,
  vehicle,
  category,
  desiredRangeKm,
  currentSoC,
  usableEnergyKwh,
  estimatedExtraRangeKm,
  moduleType,
  onSuccess
}) => {
  if (!isOpen) return null;

  // Find first available compatible bay in station
  const targetBay = station.bays.find(b => 
    b.status === 'Available' && 
    b.targetCategory.includes(category)
  ) || station.bays.find(b => b.status === 'Available') || station.bays[0];

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900); // 15 mins hold
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationConfirmed, setReservationConfirmed] = useState<Reservation | null>(null);

  // Deposit and energy cost calculation
  const energyCost = Math.round(usableEnergyKwh * 14); // approximate energy fee
  const deposit = category === '2W' ? 1200 : category === '3W' ? 2500 : 5000;
  const totalAmount = energyCost + deposit;

  // Countdown timer for bay hold
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleConfirmReservation = () => {
    setIsSubmitting(true);

    const reservationCode = `VLT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      reservationCode,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VOLTSHARE_${reservationCode}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresAt: new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Reserved',
      vehicle: {
        category,
        modelName: vehicle ? vehicle.name : `Custom ${category} EV`,
        nominalVoltage: vehicle ? vehicle.nominalVoltage : (category === '2W' ? 51.2 : category === '3W' ? 48 : 400),
        currentSoC,
        desiredRangeKm,
      },
      station: {
        id: station.id,
        name: station.name,
        address: station.address,
        area: station.area,
      },
      assignedBayId: targetBay?.bayId || 'BAY-01',
      moduleSerial: targetBay?.moduleSerial || 'VP50-LFP-8821',
      configurationDescription: moduleType,
      requiredEnergyKwh: usableEnergyKwh,
      usableEnergyKwh,
      estimatedRangeKm: estimatedExtraRangeKm,
      securityDeposit: deposit,
      energyFee: energyCost,
      totalEstimate: totalAmount,
      pickupTimeWindow: 'Within 15 minutes (Slot Reserved)',
      returnDueTime: 'Flexible (Return to any participating station)',
    };

    setTimeout(() => {
      storageService.saveReservation(newReservation);
      setIsSubmitting(false);
      setReservationConfirmed(newReservation);
      onSuccess(newReservation);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-space-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!reservationConfirmed ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Reserve Emergency Battery Module</h3>
                <p className="text-xs text-slate-400">
                  Bay slot locked for <span className="text-cyan-400 font-mono font-bold">{formatTime(timeLeftSeconds)}</span> minutes
                </p>
              </div>
            </div>

            {/* Target Station Details */}
            <div className="mt-5 p-4 rounded-xl bg-space-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Target Station
                </span>
                <span className="font-mono text-cyan-300 font-bold">{station.distanceKm ?? 2.1} km away</span>
              </div>
              <div className="text-sm font-bold text-white">{station.name}</div>
              <div className="text-xs text-slate-400">{station.address}</div>
            </div>

            {/* Vehicle & Battery Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 uppercase font-mono">Compatible Vehicle</div>
                <div className="text-sm font-bold text-white">
                  {vehicle ? vehicle.name : `Custom ${category} Platform`}
                </div>
                <div className="text-xs text-slate-400">
                  Current SoC: <span className="text-amber-400 font-mono font-bold">{currentSoC}%</span> • Target Range: <span className="text-cyan-400 font-mono font-bold">+{desiredRangeKm} km</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 uppercase font-mono">Assigned Rack Bay</div>
                <div className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {targetBay ? `${targetBay.bayId} (${targetBay.moduleSerial})` : 'BAY-01 (Verified)'}
                </div>
                <div className="text-xs text-slate-400">
                  Module Charge: <span className="text-emerald-400 font-mono font-bold">{targetBay?.stateOfCharge ?? 98}%</span> • SoH: <span className="text-emerald-400 font-mono font-bold">{targetBay?.stateOfHealth ?? 99}%</span>
                </div>
              </div>
            </div>

            {/* Battery Configuration Spec */}
            <div className="mt-4 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300 font-bold uppercase tracking-wider">Configured Battery Pack</span>
                <span className="text-slate-400">Usable: ~{usableEnergyKwh} kWh</span>
              </div>
              <p className="text-xs text-slate-200 font-medium">
                {moduleType}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Range estimate: <strong className="text-emerald-400 font-mono">+{estimatedExtraRangeKm} km</strong> (calculated with 90% DoD & 15% safety reserve).</span>
              </div>
            </div>

            {/* Pricing / Deposit Breakdown */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Emergency Energy Transfer Fee:</span>
                <span className="font-mono text-slate-200">₹{energyCost} (~$1.75)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Refundable Battery Security Deposit:</span>
                <span className="font-mono text-slate-200">₹{deposit} (Returned upon module check-in)</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm text-white">
                <span>Total Authorization at Pickup:</span>
                <span className="font-mono text-cyan-300">₹{totalAmount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-1/3 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleConfirmReservation}
                className="w-full sm:w-2/3 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Bay...</span>
                ) : (
                  <>
                    <span>Confirm & Hold Bay Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Success View */
          <div className="text-center py-4 space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase">
                Bay Slot Successfully Reserved
              </span>
              <h3 className="text-2xl font-black text-white mt-2">Ready for Collection</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Present this digital QR pass or Reservation PIN at <strong className="text-white">{station.name}</strong>.
              </p>
            </div>

            {/* QR Code and Code box */}
            <div className="p-5 rounded-2xl bg-space-950 border border-cyan-500/30 max-w-sm mx-auto space-y-3">
              <div className="bg-white p-3 rounded-xl inline-block shadow-lg shadow-cyan-500/10">
                <img 
                  src={reservationConfirmed.qrCodeUrl} 
                  alt="Bay Unlock QR" 
                  className="w-36 h-36 mx-auto"
                />
              </div>
              <div className="font-mono text-sm">
                <span className="text-slate-400 text-xs block">Pickup PIN Code</span>
                <span className="text-xl font-bold tracking-widest text-cyan-300">{reservationConfirmed.reservationCode}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Assigned Bay: <strong className="text-white font-mono">{reservationConfirmed.assignedBayId}</strong> • Serial: <span className="font-mono text-cyan-400">{reservationConfirmed.moduleSerial}</span>
              </div>
            </div>

            {/* Return Instructions Reminder */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-200">Return Policy & Flexibility</div>
              <p>
                You may return this battery module to <strong>ANY</strong> participating station in the VoltShare grid once your journey is complete. Your deposit will be released immediately following automated bay inspection.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all"
              >
                Got It • Proceed to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
