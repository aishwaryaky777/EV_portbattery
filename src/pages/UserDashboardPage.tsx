import React, { useState, useMemo } from 'react';
import { 
  VehicleCategory, 
  VehicleModel, 
  Station, 
  Reservation,
  CompatibilityCheck 
} from '../types';
import { SAMPLE_VEHICLES } from '../data/sampleVehicles';
import { calculateEnergyAndCompatibility } from '../services/energyCalculator';
import { 
  Cpu, 
  Battery, 
  Navigation, 
  Compass, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  MapPin, 
  RotateCcw,
  Sparkles,
  Info,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { ReservationModal } from '../components/ReservationModal';

interface UserDashboardPageProps {
  selectedCategory: VehicleCategory;
  onSelectCategory: (cat: VehicleCategory) => void;
  stations: Station[];
  activeReservation: Reservation | null;
  reservationsHistory: Reservation[];
  onNavigate: (tab: string) => void;
  onReservationCreated: (res: Reservation) => void;
  onCancelReservation: (resId: string) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  selectedCategory,
  onSelectCategory,
  stations,
  activeReservation,
  reservationsHistory,
  onNavigate,
  onReservationCreated,
  onCancelReservation
}) => {
  // Filter vehicles by category
  const categoryVehicles = useMemo(() => {
    return SAMPLE_VEHICLES.filter(v => v.category === selectedCategory);
  }, [selectedCategory]);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(categoryVehicles[0]?.id || 'ather-450x');
  const [isCustomVehicle, setIsCustomVehicle] = useState(false);

  // Custom vehicle specs state
  const [customVoltage, setCustomVoltage] = useState<number>(selectedCategory === '2W' ? 51.2 : selectedCategory === '3W' ? 48.0 : 350.0);
  const [customConsumption, setCustomConsumption] = useState<number>(selectedCategory === '2W' ? 0.028 : selectedCategory === '3W' ? 0.065 : 0.150);
  
  // Trip / Battery state inputs
  const [currentSoC, setCurrentSoC] = useState<number>(18); // 18% remaining
  const [desiredRangeKm, setDesiredRangeKm] = useState<number>(35); // 35 km emergency travel
  const [currentLocation, setCurrentLocation] = useState<string>('Downtown Tech Zone');
  const [destination, setDestination] = useState<string>('Metro Airport Terminal');

  // Modal reservation trigger
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [targetStationForReservation, setTargetStationForReservation] = useState<Station | null>(null);

  // Current selected vehicle model object
  const activeVehicle = useMemo(() => {
    if (isCustomVehicle) return null;
    return SAMPLE_VEHICLES.find(v => v.id === selectedVehicleId) || categoryVehicles[0];
  }, [isCustomVehicle, selectedVehicleId, categoryVehicles]);

  // Run Smart Energy Estimation Engine
  const compatibilityResult: CompatibilityCheck = useMemo(() => {
    return calculateEnergyAndCompatibility({
      category: selectedCategory,
      model: activeVehicle || undefined,
      customNominalVoltage: isCustomVehicle ? customVoltage : undefined,
      customConsumptionKwhPerKm: isCustomVehicle ? customConsumption : undefined,
      currentSoC,
      desiredRangeKm,
    });
  }, [selectedCategory, activeVehicle, isCustomVehicle, customVoltage, customConsumption, currentSoC, desiredRangeKm]);

  // Find stations compatible with this vehicle configuration
  const compatibleStations = useMemo(() => {
    return stations.filter(st => {
      // Must support this vehicle category
      if (!st.supportedCategories.includes(selectedCategory)) return false;
      // Must have at least one bay with status 'Available'
      const hasAvailableBay = st.bays.some(b => b.status === 'Available' && b.targetCategory.includes(selectedCategory));
      return hasAvailableBay;
    });
  }, [stations, selectedCategory]);

  const handleStartReservation = (st: Station) => {
    setTargetStationForReservation(st);
    setIsReservationModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Active Reservation Banner (if user currently has an active reservation) */}
      {activeReservation && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/50 shadow-2xl animate-in slide-in-from-top-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                  Active Booking • {activeReservation.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  (PIN: <strong className="text-white">{activeReservation.reservationCode}</strong>)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {activeReservation.station.name} — Bay {activeReservation.assignedBayId}
              </h3>
              <p className="text-xs text-slate-300">
                Module: <span className="font-mono text-cyan-300">{activeReservation.moduleSerial}</span> • Extra Range: <span className="text-emerald-400 font-bold font-mono">+{activeReservation.estimatedRangeKm} km</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('return')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-space-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return Battery</span>
              </button>
              <button
                onClick={() => onCancelReservation(activeReservation.id)}
                className="px-3.5 py-2.5 rounded-xl border border-rose-500/40 hover:bg-rose-500/10 text-rose-300 text-xs font-semibold transition-all"
              >
                Cancel Hold
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Title & Intro */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3 h-3" />
          SMART ENERGY ESTIMATION & BATTERY DISCOVERY
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          User Power Command Center
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Configure your vehicle parameters, simulate energy requirements under real-world losses, and securely reserve compatible battery modules.
        </p>
      </div>

      {/* Main Grid: Left Config Panel + Right Compatibility & Stations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Vehicle & Trip Configuration */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-2xl glass-panel-glow border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>1. Vehicle Profile</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Step 1 of 2</span>
            </div>

            {/* Category Selector Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select EV Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['2W', '3W', '4W'] as VehicleCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onSelectCategory(cat);
                      const matching = SAMPLE_VEHICLES.filter(v => v.category === cat);
                      if (matching.length > 0) setSelectedVehicleId(matching[0].id);
                      setIsCustomVehicle(false);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-space-950 shadow-lg shadow-cyan-500/30 font-extrabold'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {cat === '2W' ? '2-Wheeler' : cat === '3W' ? '3-Wheeler' : '4-Wheeler'}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Model Selector or Custom Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Vehicle Model
                </label>
                <button
                  onClick={() => setIsCustomVehicle(!isCustomVehicle)}
                  className="text-xs text-cyan-400 hover:underline font-mono"
                >
                  {isCustomVehicle ? 'Choose Pre-configured Model' : '+ Custom Specs'}
                </button>
              </div>

              {!isCustomVehicle ? (
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-space-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  {categoryVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.nominalVoltage}V • {v.batteryCapacityKwh} kWh)
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-4 rounded-xl bg-space-950 border border-cyan-500/20 space-y-3 animate-in fade-in">
                  <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    Custom Electrical Parameters
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Nominal System Voltage (V)
                    </label>
                    <input
                      type="number"
                      value={customVoltage}
                      onChange={(e) => setCustomVoltage(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Consumption (kWh / km)
                    </label>
                    <input
                      type="number"
                      step="0.005"
                      value={customConsumption}
                      onChange={(e) => setCustomConsumption(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Active Vehicle Architecture Preview */}
              {activeVehicle && !isCustomVehicle && (
                <div className="p-3.5 rounded-xl bg-space-950/70 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Architecture:</span>
                    <span className="font-mono text-cyan-300">{activeVehicle.nominalVoltage}V Platform</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Rated Consumption:</span>
                    <span className="font-mono text-slate-200">{(activeVehicle.consumptionKwhPerKm * 1000).toFixed(0)} Wh/km</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    {activeVehicle.architectureDescription}
                  </div>
                </div>
              )}
            </div>

            {/* Current State of Charge (SoC Slider) */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Battery className="w-3.5 h-3.5 text-amber-400" />
                  Current Battery (SoC)
                </label>
                <span className="text-sm font-bold font-mono text-amber-400">
                  {currentSoC}%
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="80"
                value={currentSoC}
                onChange={(e) => setCurrentSoC(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Critical (2%)</span>
                <span>Low (20%)</span>
                <span>Sub-optimal (50%)</span>
              </div>
            </div>

            {/* Desired Additional Travel Distance (km) */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  Desired Extra Range
                </label>
                <span className="text-sm font-bold font-mono text-cyan-300">
                  +{desiredRangeKm} km
                </span>
              </div>
              <input
                type="range"
                min="10"
                max={selectedCategory === '2W' ? 80 : selectedCategory === '3W' ? 100 : 140}
                step="5"
                value={desiredRangeKm}
                onChange={(e) => setDesiredRangeKm(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10 km (Hop)</span>
                <span>40 km (City)</span>
                <span>Max Safe Emergency</span>
              </div>
            </div>

            {/* Location Selector */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Current Location
              </label>
              <select
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-700 text-white text-xs font-medium focus:border-cyan-400 focus:outline-none"
              >
                <option value="Downtown Tech Zone">Downtown Tech Zone (Sector 1)</option>
                <option value="North City Corridor">North City Corridor (Highway bypass)</option>
                <option value="West Logistics Belt">West Logistics Belt (Industrial corridor)</option>
                <option value="South Cyber Valley">South Cyber Valley (Electronics Plaza)</option>
                <option value="East Airport Highway">East Airport Highway (Expressway Toll)</option>
              </select>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Engineering Compatibility Result & Available Stations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Engineering Synthesis Output Card */}
          <div className="p-6 rounded-2xl glass-panel-glow border border-cyan-500/40 relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Compatibility Verified
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Formula: E = (d × c / (η × DoD)) × 1.15
              </span>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Required Energy</div>
                <div className="text-base font-bold text-white mt-1">
                  {compatibilityResult.requiredEnergyKwh} kWh
                </div>
              </div>
              <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Modules Needed</div>
                <div className="text-base font-bold text-cyan-300 mt-1">
                  {compatibilityResult.moduleCount}x Module
                </div>
              </div>
              <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Total Payload</div>
                <div className="text-base font-bold text-indigo-300 mt-1">
                  {compatibilityResult.totalWeightKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Calculated Range</div>
                <div className="text-base font-bold text-emerald-400 mt-1">
                  +{compatibilityResult.estimatedExtraRangeKm} km
                </div>
              </div>
            </div>

            {/* Recommended Module Configuration Details */}
            <div className="p-4 rounded-xl bg-space-950/90 border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Coupling Method:</span>
                <span className="text-cyan-300 font-mono font-semibold">
                  {compatibilityResult.connectionMethod}
                </span>
              </div>
              <div className="text-xs text-white">
                <strong>Pack Spec:</strong> {compatibilityResult.moduleType}
              </div>
              <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1">
                <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{compatibilityResult.disclaimer}</span>
              </div>
            </div>

            {/* Warnings list if applicable */}
            {compatibilityResult.warnings.length > 0 && (
              <div className="space-y-1.5">
                {compatibilityResult.warnings.map((w, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compatible Stations List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Compatible Stations Near {currentLocation}
                </h3>
                <p className="text-xs text-slate-400">
                  Showing stations with verified charged modules matching this voltage profile.
                </p>
              </div>
              <button
                onClick={() => onNavigate('stations')}
                className="text-xs text-cyan-400 hover:underline font-mono flex items-center gap-1"
              >
                <span>Full Map</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {compatibleStations.map((station) => {
                const availableBays = station.bays.filter(
                  b => b.status === 'Available' && b.targetCategory.includes(selectedCategory)
                );

                return (
                  <div
                    key={station.id}
                    className="p-4 sm:p-5 rounded-2xl bg-space-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                          {station.distanceKm ?? 2.1} km
                        </span>
                        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          {availableBays.length} Compatible Packs Ready
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {station.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{station.address}</p>
                      <div className="text-[11px] font-mono text-slate-400">
                        Avg Battery SoH: <strong className="text-emerald-400">98.5%</strong> • Operating: {station.operatingHours}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartReservation(station)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 flex-shrink-0 active:scale-95"
                    >
                      <span>Reserve Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past Bookings / Reservation History */}
          {reservationsHistory.length > 0 && (
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Reservation History
              </h3>
              <div className="space-y-2">
                {reservationsHistory.slice(0, 3).map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{res.station.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Code: {res.reservationCode} • Bay {res.assignedBayId} • {res.createdAt}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      res.status === 'Returned' 
                        ? 'bg-slate-800 text-slate-300' 
                        : res.status === 'Cancelled'
                        ? 'bg-rose-950/60 text-rose-300'
                        : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Reservation Modal Component */}
      {targetStationForReservation && (
        <ReservationModal
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
          station={targetStationForReservation}
          vehicle={activeVehicle}
          category={selectedCategory}
          desiredRangeKm={desiredRangeKm}
          currentSoC={currentSoC}
          usableEnergyKwh={compatibilityResult.requiredEnergyKwh}
          estimatedExtraRangeKm={compatibilityResult.estimatedExtraRangeKm}
          moduleType={compatibilityResult.moduleType}
          onSuccess={(res) => {
            onReservationCreated(res);
          }}
        />
      )}

    </div>
  );
};
