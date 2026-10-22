import React, { useState } from 'react';
import { Station, VehicleCategory } from '../types';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, BatteryCharging, ArrowRight } from 'lucide-react';

interface InteractiveStationMapProps {
  stations: Station[];
  selectedStation: Station | null;
  onSelectStation: (station: Station) => void;
  filterCategory: VehicleCategory | 'ALL';
  userLocationName: string;
}

export const InteractiveStationMap: React.FC<InteractiveStationMapProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  filterCategory,
  userLocationName,
}) => {
  const [mapZoom, setMapZoom] = useState(1);
  const [mapLayer, setMapLayer] = useState<'cyber' | 'radar'>('cyber');

  // Relative coordinate projection inside a high-tech SVG map container (bounds roughly 12.8 to 13.1 Lat, 77.45 to 77.7 Lng)
  const minLat = 12.82;
  const maxLat = 13.08;
  const minLng = 77.48;
  const maxLng = 77.68;

  const projectToMap = (lat: number, lng: number) => {
    // Map latitude to Y (inverted) and longitude to X (0 to 100%)
    const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 75 + 12;
    return { 
      x: Math.max(5, Math.min(95, x)), 
      y: Math.max(8, Math.min(92, y)) 
    };
  };

  // User simulated position (around Downtown Central)
  const userPos = { x: 48, y: 52 };

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden bg-space-950 border border-cyan-500/30 shadow-2xl select-none">
      
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

      {/* Map Overlay HUD controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-space-950/85 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>ZONE: METRO URBAN GRID</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-space-950/85 backdrop-blur-md p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setMapLayer('cyber')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              mapLayer === 'cyber' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            Tactical Map
          </button>
          <button
            onClick={() => setMapLayer('radar')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              mapLayer === 'radar' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            Radar Radar
          </button>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <span className="text-[11px] font-mono text-slate-400 bg-space-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
          Showing {stations.length} Participating Hubs
        </span>
      </div>

      {/* SVG Map Lines, Routes, and Pins */}
      <svg className="w-full h-full relative z-10">
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

        {/* Ambient Arterial Roads */}
        <path d="M 5 25 Q 40 45 95 35" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="3" />
        <path d="M 15 90 Q 50 55 85 10" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="3" />
        <path d="M 10 50 Q 50 60 90 85" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="2" strokeDasharray="6,6" />
        <circle cx="50%" cy="50%" r="35%" fill="none" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1" strokeDasharray="4,8" />

        {/* If a station is selected, draw animated rescue trajectory from user location to that station */}
        {selectedStation && (() => {
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

      {/* User Position Pin */}
      <div 
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
        style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center animate-pulse shadow-lg shadow-cyan-400/50">
            <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <div className="mt-1 px-2 py-0.5 rounded bg-space-950/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-semibold whitespace-nowrap shadow-md">
          You ({userLocationName})
        </div>
      </div>

      {/* Participating Station Markers */}
      {stations.map((st) => {
        const pos = projectToMap(st.lat, st.lng);
        const isSelected = selectedStation?.id === st.id;
        const availableBays = st.bays.filter(b => b.status === 'Available').length;
        const has4W = st.supportedCategories.includes('4W');

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
                <span className={`w-1.5 h-1.5 rounded-full ${availableBays > 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                <span className="font-semibold">{st.name.split(' ')[1] || st.name.split(' ')[0]}</span>
                <span className="text-cyan-400 font-bold">({availableBays})</span>
              </div>

            </div>
          </div>
        );
      })}

      {/* Selected Station Mini Detail Card at Bottom */}
      {selectedStation && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-space-950/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-3 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30">
                {selectedStation.distanceKm ?? 2.1} km away
              </span>
              <span className="text-xs text-slate-400">• ETA: ~{Math.round(((selectedStation.distanceKm ?? 2.1) / 25) * 60) + 4} mins</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Open Now
              </span>
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">{selectedStation.name}</h4>
            <p className="text-xs text-slate-400 line-clamp-1">{selectedStation.address}</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="text-right hidden sm:block font-mono text-xs pr-2">
              <div className="text-slate-400">Available Packs</div>
              <div className="text-cyan-300 font-bold">
                {selectedStation.bays.filter(b => b.status === 'Available').length} Ready Bays
              </div>
            </div>
            <button
              onClick={() => onSelectStation(selectedStation)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 text-xs font-bold uppercase tracking-wider shadow-md shadow-cyan-500/30 transition-all active:scale-95"
            >
              <span>View & Reserve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 hidden md:flex items-center gap-3 text-[10px] font-mono text-slate-400 bg-space-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span> You
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Available Bay
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span> Fast Charging
        </span>
      </div>

    </div>
  );
};
