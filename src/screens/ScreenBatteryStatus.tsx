import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Bike, 
  Car, 
  Zap
} from 'lucide-react';
import { TopHeader } from '../components/TopHeader';

interface ScreenBatteryStatusProps {
  currentLocation: string;
  setCurrentLocation: (loc: string) => void;
  locationStatus: 'detecting' | 'gps' | 'manual' | 'error';
  setLocationStatus: (status: 'detecting' | 'gps' | 'manual' | 'error') => void;
  destination: string;
  setDestination: (dest: string) => void;
  routeDistanceKm: number;
  setRouteDistanceKm: (km: number) => void;
  onSelectVehicle: (type: '2W' | '4W') => void;
}

export const ScreenBatteryStatus: React.FC<ScreenBatteryStatusProps> = ({
  currentLocation,
  setCurrentLocation,
  locationStatus,
  setLocationStatus,
  destination,
  setDestination,
  routeDistanceKm,
  setRouteDistanceKm,
  onSelectVehicle,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);

  // Quick destination suggestions
  const destinationSuggestions = [
    { name: 'North Metro Bypass', distance: 28 },
    { name: 'Airport Expressway', distance: 30 },
    { name: 'Outer Ring Road Hub', distance: 25 },
    { name: 'Electronic City Gate', distance: 27 },
  ];

  // Browser Geolocation API function
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('manual');
      setCurrentLocation('Central Urban District (Manual)');
      return;
    }

    setIsDetecting(true);
    setLocationStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim with 2.5s timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood || '';
            const city = data.address?.city || data.address?.town || data.address?.county || '';
            const formatted = road && city ? `${road}, ${city}` : data.display_name?.split(',').slice(0, 2).join(',') || `GPS: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
            setCurrentLocation(formatted);
            setLocationStatus('gps');
          } else {
            setCurrentLocation(`GPS: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
            setLocationStatus('gps');
          }
        } catch {
          // Graceful fallback showing actual verified coordinates
          setCurrentLocation(`GPS: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
          setLocationStatus('gps');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        setLocationStatus('manual');
        if (!currentLocation || currentLocation === 'Detecting location...') {
          setCurrentLocation('Downtown Tech Zone (GPS Denied)');
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
    );
  };

  // Run location detection on initial mount if not yet detected
  useEffect(() => {
    if (locationStatus === 'detecting' || !currentLocation || currentLocation === 'Detecting location...') {
      detectLocation();
    }
  }, []);

  const handleDestinationChange = (newDest: string) => {
    setDestination(newDest);
    // Approximate route distance calculation
    const match = destinationSuggestions.find(s => s.name.toLowerCase() === newDest.toLowerCase());
    if (match) {
      setRouteDistanceKm(match.distance);
    } else {
      // Dynamic fallback between 25-30 km emergency window
      const pseudoKm = 25 + (newDest.length % 6);
      setRouteDistanceKm(pseudoKm);
    }
  };

  return (
    <div className="h-full w-full max-w-md mx-auto flex flex-col justify-between p-4 sm:p-5 select-none animate-in fade-in">
      
      {/* App Bar */}
      <TopHeader currentScreen="battery-status" stepIndicator="1 / 3" />

      {/* Main Content Area: GPS Tracker & Destination Input */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2 space-y-3.5">
        
        {/* Title Tag */}
        <div className="text-center space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>EMERGENCY ROUTE & LOCATION TRACKER</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Plan Emergency Power Route
          </h2>
        </div>

        {/* DESTINATION INPUT CARD */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Enter Your Destination</span>
            </label>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              ~{routeDistanceKm} km route
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              placeholder="e.g. Airport Expressway, North Hub..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-700 text-white text-xs font-medium placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Quick Suggestions Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 no-scrollbar">
            {destinationSuggestions.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => handleDestinationChange(s.name)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all ${
                  destination.toLowerCase() === s.name.toLowerCase()
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'bg-space-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {s.name} ({s.distance} km)
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Range Notice */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <span>Target Emergency Window:</span>
          <span className="text-emerald-400 font-bold">25–30 km Max</span>
        </div>

      </div>

      {/* Bottom Section: Prominent Vehicle Buttons (PRESERVED UNCHANGED) */}
      <div className="space-y-2 pt-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 text-center font-semibold">
          Select Vehicle Category
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 2 Wheeler Button */}
          <button
            onClick={() => onSelectVehicle('2W')}
            className="p-3.5 sm:p-4 rounded-2xl glass-panel-glow hover:border-cyan-400 flex flex-col items-center justify-center gap-2 group transition-all duration-200 active:scale-95 text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-space-950 transition-all">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                2 Wheeler
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                48V–72V Swappable
              </div>
            </div>
          </button>

          {/* 4 Wheeler Button */}
          <button
            onClick={() => onSelectVehicle('4W')}
            className="p-3.5 sm:p-4 rounded-2xl glass-panel-glow hover:border-cyan-400 flex flex-col items-center justify-center gap-2 group transition-all duration-200 active:scale-95 text-center"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-space-950 transition-all">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                4 Wheeler
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                300V–400V DC Booster
              </div>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};
