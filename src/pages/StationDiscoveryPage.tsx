import React, { useState, useMemo } from 'react';
import { Station, VehicleCategory, Reservation } from '../types';
import { InteractiveStationMap } from '../components/InteractiveStationMap';
import { ReservationModal } from '../components/ReservationModal';
import { 
  Search, 
  MapPin, 
  Filter, 
  BatteryCharging, 
  Radio, 
  ShieldCheck, 
  Clock, 
  Phone, 
  ArrowRight,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

interface StationDiscoveryPageProps {
  stations: Station[];
  onReservationCreated: (res: Reservation) => void;
}

export const StationDiscoveryPage: React.FC<StationDiscoveryPageProps> = ({
  stations,
  onReservationCreated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<VehicleCategory | 'ALL'>('ALL');
  const [selectedStation, setSelectedStation] = useState<Station | null>(stations[0] || null);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Modal reservation state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTargetStation, setModalTargetStation] = useState<Station | null>(null);

  // Filter stations based on search query & category
  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const matchesSearch = 
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.pinCode.includes(searchQuery);

      const matchesCategory = 
        selectedCategoryFilter === 'ALL' || 
        station.supportedCategories.includes(selectedCategoryFilter);

      return matchesSearch && matchesCategory;
    });
  }, [stations, searchQuery, selectedCategoryFilter]);

  const handleOpenReservation = (station: Station) => {
    setModalTargetStation(station);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Title & Live Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            REAL-TIME STATION DISCOVERY & MAP
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            Find Nearby Battery Hubs
          </h1>
          <p className="text-slate-400 text-sm">
            Locate verified participating battery swap hubs and emergency DC charging units across the city.
          </p>
        </div>

        {/* Live vs Demo Telemetry Toggle */}
        <div className="flex items-center gap-3 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-400 px-2">Data Source:</span>
          <button
            onClick={() => setIsDemoMode(false)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              !isDemoMode ? 'bg-emerald-500 text-space-950 font-bold shadow-md shadow-emerald-500/20' : 'text-slate-400'
            }`}
          >
            Live Sensor Feed
          </button>
          <button
            onClick={() => setIsDemoMode(true)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              isDemoMode ? 'bg-cyan-500 text-space-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400'
            }`}
          >
            Demo Simulation
          </button>
        </div>
      </div>

      {/* Interactive Map Component */}
      <InteractiveStationMap
        stations={filteredStations}
        selectedStation={selectedStation}
        onSelectStation={(st) => setSelectedStation(st)}
        filterCategory={selectedCategoryFilter}
        userLocationName="Current GPS Point"
      />

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
        
        {/* Search Bar */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by area, road name, or PIN code (e.g. 560100)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-space-950 border border-slate-700/80 text-white text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', '2W', '3W', '4W'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-cyan-500 text-space-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-space-950 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Vehicles' : `${cat} Only`}
            </button>
          ))}
        </div>

      </div>

      {/* Nearby Stations List Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Displaying {filteredStations.length} matching stations</span>
          <span>Sorted by shortest physical distance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStations.map((st) => {
            const availableBays = st.bays.filter(b => b.status === 'Available');
            const chargingBays = st.bays.filter(b => b.status === 'Charging');
            const isSelected = selectedStation?.id === st.id;

            return (
              <div
                key={st.id}
                onClick={() => setSelectedStation(st)}
                className={`p-6 rounded-2xl glass-panel cursor-pointer transition-all border flex flex-col justify-between space-y-5 ${
                  isSelected 
                    ? 'border-cyan-400 bg-space-900/90 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/40' 
                    : 'border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                          {st.distanceKm ?? 2.1} km
                        </span>
                        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          {availableBays.length} Available
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight mt-1.5">
                        {st.name}
                      </h3>
                      <p className="text-xs text-slate-400">{st.address} • PIN {st.pinCode}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                        {st.supportedCategories.map(c => (
                          <span key={c} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bay Inventory Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-lg bg-space-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Total Bays</div>
                      <div className="font-bold text-white">{st.totalBays}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-space-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Charged Packs</div>
                      <div className="font-bold text-emerald-400">{availableBays.length}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-space-950 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Charging Bay</div>
                      <div className="font-bold text-amber-400">{chargingBays.length}</div>
                    </div>
                  </div>

                  {/* Operational Details */}
                  <div className="p-3 rounded-xl bg-space-950/70 border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        Hours:
                      </span>
                      <span className="text-slate-200">{st.operatingHours}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        Operator:
                      </span>
                      <span className="text-slate-200">{st.operatorName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        BMS Health Avg:
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">98.8% SoH</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="text-[11px] font-mono text-slate-400">
                    Est. Collection ETA: <strong className="text-cyan-300">~{Math.round(((st.distanceKm ?? 2.1) / 25) * 60) + 4} min</strong>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenReservation(st);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Reserve Pack</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Reservation Modal */}
      {modalTargetStation && (
        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          station={modalTargetStation}
          vehicle={null}
          category={selectedCategoryFilter === 'ALL' ? '2W' : selectedCategoryFilter}
          desiredRangeKm={35}
          currentSoC={15}
          usableEnergyKwh={2.8}
          estimatedExtraRangeKm={45}
          moduleType="VoltPack-50 Modular LFP Pack (Compatible Standard)"
          onSuccess={(res) => {
            onReservationCreated(res);
          }}
        />
      )}

    </div>
  );
};
