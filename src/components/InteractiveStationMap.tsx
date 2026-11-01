import React, { useState, useMemo } from 'react';
import { Station, VehicleCategory } from '../types';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  ShieldCheck,
  BatteryCharging,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Radio,
  Zap
} from 'lucide-react';
import { calculateDistanceKm } from '../services/chargingStationService';

interface InteractiveStationMapProps {
  stations: Station[];
  selectedStation: Station | null;
  onSelectStation: (station: Station) => void;
  filterCategory: VehicleCategory | 'ALL';
  userLocationName: string;
  userCoords?: { lat: number; lng: number } | null;
  onRefreshLocation?: () => void;
  isRefreshingLocation?: boolean;
  onRefreshStations?: () => void;
  isLoadingStations?: boolean;
  locationError?: string | null;
  dataSourceName?: string;
}

export const InteractiveStationMap: React.FC<InteractiveStationMapProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  filterCategory,
  userLocationName,
  userCoords,
  onRefreshLocation,
  isRefreshingLocation = false,
  onRefreshStations,
  isLoadingStations = false,
  locationError,
  dataSourceName = 'OpenStreetMap & Open Charge Map',
}) => {
  const [mapLayer, setMapLayer] = useState<'cyber' | 'radar'>('cyber');

  // Compute dynamic map bounding box around the real user coordinates & all nearby real stations
  const bounds = useMemo(() => {
    const lats: number[] = [];
    const lngs: number[] = [];

    if (userCoords && typeof userCoords.lat === 'number' && typeof userCoords.lng === 'number') {
      lats.push(userCoords.lat);
      lngs.push(userCoords.lng);
    }

    stations.forEach((s) => {
      if (typeof s.lat === 'number' && !isNaN(s.lat)) lats.push(s.lat);
      if (typeof s.lng === 'number' && !isNaN(s.lng)) lngs.push(s.lng);
    });

    if (lats.length === 0 || lngs.length === 0) {
      return { minLat: 12.85, maxLat: 13.08, minLng: 77.48, maxLng: 77.68 };
    }

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Add 18% padding so pins are comfortably within the SVG viewport
    const latSpan = Math.max(0.015, maxLat - minLat);
    const lngSpan = Math.max(0.015, maxLng - minLng);

    return {
      minLat: minLat - latSpan * 0.18,
      maxLat: maxLat + latSpan * 0.18,
      minLng: minLng - lngSpan * 0.18,
      maxLng: maxLng + lngSpan * 0.18,
    };
  }, [userCoords, stations]);

  // Project real (lat, lng) to SVG container percentage coordinates (0% to 100%)
  const projectToMap = (lat: number, lng: number) => {
    const latRange = bounds.maxLat - bounds.minLat || 0.05;
    const lngRange = bounds.maxLng - bounds.minLng || 0.05;

    const x = ((lng - bounds.minLng) / lngRange) * 82 + 9;
    const y = ((bounds.maxLat - lat) / latRange) * 74 + 13;

    return {
      x: Math.max(7, Math.min(93, isNaN(x) ? 50 : x)),
      y: Math.max(12, Math.min(88, isNaN(y) ? 50 : y)),
    };
  };

  // User real GPS position on the map
  const userPos = useMemo(() => {
    if (userCoords) {
      return projectToMap(userCoords.lat, userCoords.lng);
    }
    return { x: 50, y: 50 };
  }, [userCoords, bounds]);

  return (
    <div className="relative w-full h-[440px] sm:h-[490px] rounded-2xl overflow-hidden bg-space-950 border border-cyan-500/30 shadow-2xl select-none flex flex-col justify-between">
      
      {/* Map Background Grid & Radar rings */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)]"></div>

      {/* Radar sweep effect if in radar mode */}
      {mapLayer === 'radar' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-cyan-500/25"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-cyan-500/30"></div>
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] origin-top-left bg-gradient-to-br from-cyan-500/15 to-transparent rotate-45 animate-spin"></div>
        </div>
      )}

      {/* Map Overlay HUD controls: Left */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 flex-wrap max-w-[85%]">
        <div className="px-2.5 py-1 rounded-lg bg-space-950/90 backdrop-blur-md border border-cyan-500/40 text-[10px] sm:text-[11px] font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>
            {userCoords ? `GPS: ${userCoords.lat.toFixed(4)}°, ${userCoords.lng.toFixed(4)}°` : 'DETECTING LIVE GPS...'}
          </span>
        </div>

        {/* Refresh GPS Button */}
        {onRefreshLocation && (
          <button
            onClick={onRefreshLocation}
            disabled={isRefreshingLocation}
            title="Refresh GPS Location"
            className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-[10px] font-mono text-slate-300 flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 text-cyan-400 ${isRefreshingLocation ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh GPS</span>
          </button>
        )}

        {/* Refresh Stations Button */}
        {onRefreshStations && (
          <button
            onClick={onRefreshStations}
            disabled={isLoadingStations}
            title="Refresh Nearby Stations"
            className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-[10px] font-mono text-slate-300 flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Radio className={`w-3 h-3 text-emerald-400 ${isLoadingStations ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">Refresh Stations</span>
          </button>
        )}
      </div>

      {/* Map Overlay HUD controls: Right */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1 bg-space-950/85 backdrop-blur-md p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setMapLayer('cyber')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
              mapLayer === 'cyber' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            Tactical
          </button>
          <button
            onClick={() => setMapLayer('radar')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
              mapLayer === 'radar' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            Radar
          </button>
        </div>
      </div>

      {/* Location Permission / Error Alert Banner */}
      {locationError && (
        <div className="absolute top-12 left-3 right-3 z-20 p-2 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center justify-between gap-2 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-1.5 truncate">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="truncate">{locationError}</span>
          </div>
          {onRefreshLocation && (
            <button
              onClick={onRefreshLocation}
              className="px-2 py-0.5 rounded bg-rose-900 hover:bg-rose-800 text-[10px] font-bold text-white flex-shrink-0"
            >
              Retry GPS
            </button>
          )}
        </div>
      )}

      {/* SVG Map Canvas: Arteries, Rescue Trajectories & Pins */}
      <svg className="w-full h-full relative z-10 pointer-events-none">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Arterial Navigation Vectors */}
        <path d="M 5 25 Q 40 45 95 35" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="3" />
        <path d="M 15 90 Q 50 55 85 10" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="3" />
        <path d="M 10 50 Q 50 60 90 85" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="2" strokeDasharray="6,6" />
        <circle cx="50%" cy="50%" r="35%" fill="none" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1" strokeDasharray="4,8" />

        {/* Dynamic trajectory line from user position to selected station */}
        {selectedStation && userCoords && (() => {
          const target = projectToMap(selectedStation.lat, selectedStation.lng);
          return (
            <g>
              <line
                x1={`${userPos.x}%`}
                y1={`${userPos.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="url(#routeGradient)"
                strokeWidth="2.5"
                strokeDasharray="6,4"
                className="animate-pulse"
                filter="url(#glow)"
              />
              <circle
                cx={`${target.x}%`}
                cy={`${target.y}%`}
                r="18"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="1.5"
                className="animate-ping"
                opacity="0.4"
              />
            </g>
          );
        })()}
      </svg>

      {/* USER LIVE GPS PIN */}
      {userCoords && (
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none transition-all duration-500 ease-out"
          style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center animate-pulse shadow-lg shadow-cyan-400/50">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-space-950/95 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 font-semibold whitespace-nowrap shadow-md max-w-[170px] truncate">
            You ({userLocationName || 'Current GPS'})
          </div>
        </div>
      )}

      {/* REAL PARTICIPATING EV CHARGING STATION MARKERS */}
      {stations.map((st) => {
        const pos = projectToMap(st.lat, st.lng);
        const isSelected = selectedStation?.id === st.id;
        const availableBays = st.bays.filter((b) => b.status === 'Available').length;
        const distanceKm = userCoords
          ? calculateDistanceKm(userCoords.lat, userCoords.lng, st.lat, st.lng)
          : st.distanceKm ?? 1.5;

        // Distinguish live telemetry vs. unverified status
        const isLiveReported = st.isLiveFeed;
        const statusColor = isLiveReported ? 'bg-emerald-400' : 'bg-cyan-400';

        return (
          <div
            key={st.id}
            onClick={() => onSelectStation(st)}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform duration-200 hover:scale-125"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className="relative flex flex-col items-center">
              {/* Pin Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-tr from-cyan-400 to-indigo-600 text-space-950 scale-110 shadow-lg shadow-cyan-400/60 ring-4 ring-cyan-400/30'
                    : 'bg-slate-900/90 border border-cyan-500/40 text-cyan-400 hover:border-cyan-400 hover:shadow-md hover:shadow-cyan-400/30'
                }`}
              >
                <BatteryCharging className="w-5 h-5" />
              </div>

              {/* Station Label Tooltip */}
              <div className="mt-1 px-2 py-0.5 rounded bg-space-950/95 border border-slate-700/80 text-[10px] font-mono text-slate-200 whitespace-nowrap shadow-md flex items-center gap-1.5 group-hover:border-cyan-400">
                <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`}></span>
                <span className="font-semibold max-w-[120px] truncate">{st.name}</span>
                <span className="text-cyan-400 font-bold">{distanceKm} km</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Selected Station Detail Card at Bottom */}
      {selectedStation && (
        <div className="absolute bottom-3 left-3 right-3 z-30 bg-space-950/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-3 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30">
                {userCoords
                  ? `${calculateDistanceKm(userCoords.lat, userCoords.lng, selectedStation.lat, selectedStation.lng)} km away`
                  : `${selectedStation.distanceKm ?? 1.5} km away`}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ETA: ~{Math.round(((selectedStation.distanceKm ?? 2.0) / 28) * 60) + 3} mins
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {selectedStation.isLiveFeed ? 'Live Telemetry' : 'Operating (Registry Verified)'}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">{selectedStation.name}</h4>
            <p className="text-[11px] text-slate-400 line-clamp-1">{selectedStation.address}</p>
            <div className="text-[10px] font-mono text-slate-400">
              Operator: <strong className="text-slate-200">{selectedStation.operatorName}</strong> • {selectedStation.operatingHours}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="text-right hidden sm:block font-mono text-[11px] pr-2">
              <div className="text-slate-400">Slots</div>
              <div className="text-cyan-300 font-bold">
                {selectedStation.bays.filter((b) => b.status === 'Available').length} / {selectedStation.bays.length} Available
              </div>
            </div>
            <button
              onClick={() => onSelectStation(selectedStation)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 text-[11px] font-bold uppercase tracking-wider shadow-md shadow-cyan-500/30 transition-all active:scale-95"
            >
              <span>Select Station</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Map Legend & Source Disclaimer */}
      <div className="absolute bottom-2 left-3 hidden md:flex items-center gap-3 text-[9px] font-mono text-slate-400 bg-space-950/85 px-2.5 py-1 rounded-lg border border-slate-800">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span> You (Live GPS)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Telemetry
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-300"></span> OSM Verified Hub
        </span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400">Data: {dataSourceName}</span>
      </div>

    </div>
  );
};
