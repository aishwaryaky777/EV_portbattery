import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Bike, 
  Car, 
  Zap,
  MapPin,
  RefreshCw,
  AlertCircle,
  Activity,
  CheckCircle,
  Search,
  PlugZap,
  Clock,
  XCircle
} from 'lucide-react';
import { TopHeader } from '../components/TopHeader';

// Must match the key used in ScreenChargingSlot.tsx
const CHARGING_BOOKING_KEY = 'voltshare_charging_booking_v1';

interface ChargingBookingRecord {
  stationName: string;
  slotLabel: string;
  passCode: string;
  bookedAt: string;
  destination: string;
}

interface ScreenBatteryStatusProps {
  currentLocation: string;
  setCurrentLocation: (loc: string) => void;
  locationStatus: 'detecting' | 'gps' | 'manual' | 'error';
  setLocationStatus: (status: 'detecting' | 'gps' | 'manual' | 'error') => void;
  userCoords?: { lat: number; lng: number } | null;
  setUserCoords?: (coords: { lat: number; lng: number } | null) => void;
  destination: string;
  setDestination: (dest: string) => void;
  routeDistanceKm: number;
  setRouteDistanceKm: (km: number) => void;
  onSelectVehicle: (type: '2W' | '4W') => void;
  onOpenMap?: () => void;
  onRefreshLocation?: () => void;
  isDetectingLocation?: boolean;
}

export const ScreenBatteryStatus: React.FC<ScreenBatteryStatusProps> = ({
  currentLocation,
  setCurrentLocation,
  locationStatus,
  setLocationStatus,
  userCoords,
  setUserCoords,
  destination,
  setDestination,
  routeDistanceKm,
  setRouteDistanceKm,
  onSelectVehicle,
  onOpenMap,
  onRefreshLocation,
  isDetectingLocation = false,
}) => {
  const [localDetecting, setLocalDetecting] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [isGeocodingManual, setIsGeocodingManual] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  // Active charging slot booking (persisted in localStorage)
  const [chargingBooking, setChargingBooking] = useState<ChargingBookingRecord | null>(null);

  // Read booking from localStorage on mount and whenever the screen is visited
  useEffect(() => {
    const readBooking = () => {
      try {
        const raw = localStorage.getItem(CHARGING_BOOKING_KEY);
        setChargingBooking(raw ? (JSON.parse(raw) as ChargingBookingRecord) : null);
      } catch {
        setChargingBooking(null);
      }
    };
    readBooking();
    // Re-read when the tab gains focus (handles page refresh and back-navigation)
    window.addEventListener('focus', readBooking);
    return () => window.removeEventListener('focus', readBooking);
  }, []);

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
      setLocationStatus('error');
      setCurrentLocation('Geolocation not supported by browser');
      if (setUserCoords) setUserCoords(null);
      return;
    }

    setLocalDetecting(true);
    setLocationStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        if (setUserCoords) {
          setUserCoords({ lat: latitude, lng: longitude });
        }

        try {
          // Reverse geocoding via OpenStreetMap Nominatim with 3s timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16`,
            { 
              signal: controller.signal,
              headers: { 'User-Agent': 'VoltShare-EV-App/1.0 (contact@voltshare.app)' }
            }
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
          // Graceful fallback to verified real GPS coordinates
          setCurrentLocation(`GPS: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`);
          setLocationStatus('gps');
        } finally {
          setLocalDetecting(false);
        }
      },
      (error) => {
        setLocalDetecting(false);
        setLocationStatus('error');
        if (setUserCoords) setUserCoords(null);

        if (error.code === error.PERMISSION_DENIED) {
          setCurrentLocation('Location access permission denied');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setCurrentLocation('GPS position unavailable');
        } else {
          setCurrentLocation('Location detection timed out');
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  // Watch position as user moves
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (setUserCoords) {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 15000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [setUserCoords]);

  // Initial location detection
  useEffect(() => {
    if (locationStatus === 'detecting' || !currentLocation || currentLocation === 'Detecting location...') {
      detectLocation();
    }
  }, []);

  // Handle Manual Location Geocoding via Nominatim
  const handleManualLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    setIsGeocodingManual(true);
    setManualError(null);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualInput.trim())}&limit=1`,
        { headers: { 'User-Agent': 'VoltShare-EV-App/1.0 (contact@voltshare.app)' } }
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const first = results[0];
          const lat = parseFloat(first.lat);
          const lng = parseFloat(first.lon);
          if (setUserCoords) {
            setUserCoords({ lat, lng });
          }
          const shortName = first.display_name.split(',').slice(0, 2).join(',');
          setCurrentLocation(`${shortName} (Manual)`);
          setLocationStatus('manual');
          setManualInput('');
        } else {
          setManualError('Place not found. Please try a different city or area name.');
        }
      }
    } catch {
      setManualError('Network error geocoding location. Please retry.');
    } finally {
      setIsGeocodingManual(false);
    }
  };

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

  const isDetecting = localDetecting || isDetectingLocation;

  // Cancel the active charging booking
  const handleCancelChargingBooking = () => {
    try {
      localStorage.removeItem(CHARGING_BOOKING_KEY);
    } catch { /* best effort */ }
    setChargingBooking(null);
  };

  return (
    <div className="h-full w-full max-w-md mx-auto flex flex-col justify-between p-4 sm:p-5 select-none animate-in fade-in">
      
      {/* App Bar with Map Button */}
      <TopHeader 
        currentScreen="battery-status" 
        stepIndicator="1 / 3" 
        onOpenMap={onOpenMap}
      />

      {/* Main Content Area: Grouped Destination & Vehicle Selection (Compact, Balanced Spacing) */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2 space-y-2.5 sm:space-y-3">
        
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

        {/* LIVE GPS / LOCATION STATUS BAR */}
        <div className="p-2.5 rounded-xl glass-panel border border-slate-800 space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 truncate">
              {locationStatus === 'gps' ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
              ) : locationStatus === 'detecting' ? (
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin flex-shrink-0" />
              ) : locationStatus === 'error' ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              )}
              <span className="text-[10px] uppercase text-slate-400">Location:</span>
              <span className={`text-[11px] font-semibold truncate ${locationStatus === 'error' ? 'text-rose-300' : 'text-cyan-300'}`}>
                {currentLocation}
              </span>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Refresh Location Button */}
              <button
                type="button"
                onClick={() => {
                  if (onRefreshLocation) onRefreshLocation();
                  detectLocation();
                }}
                disabled={isDetecting}
                title="Refresh GPS"
                className="p-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 text-cyan-400 ${isDetecting ? 'animate-spin' : ''}`} />
              </button>

              {/* View on Map Button */}
              {onOpenMap && (
                <button
                  type="button"
                  onClick={onOpenMap}
                  title="View on Live Station Map"
                  className="px-2 py-0.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold flex items-center gap-1 transition-all"
                >
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>Map</span>
                </button>
              )}
            </div>
          </div>

          {/* Manual Location Form if GPS Error / Denied */}
          {locationStatus === 'error' && (
            <form onSubmit={handleManualLocationSubmit} className="pt-1.5 border-t border-slate-800 space-y-1">
              <div className="text-[10px] text-rose-300">
                GPS access denied. Enter your city or area manually:
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. Indiranagar, Bangalore or Downtown"
                  className="flex-1 px-2.5 py-1 rounded-lg bg-space-950 border border-slate-700 text-white text-[11px] placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isGeocodingManual || !manualInput.trim()}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-space-950 font-bold text-[10px] uppercase transition-all disabled:opacity-50 flex items-center gap-1"
                >
                  {isGeocodingManual ? <Activity className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                  <span>Set</span>
                </button>
              </div>
              {manualError && (
                <div className="text-[10px] text-rose-400">{manualError}</div>
              )}
            </form>
          )}
        </div>

        {/* DESTINATION INPUT CARD */}
        <div className="p-3.5 sm:p-4 rounded-2xl glass-panel border border-slate-800 space-y-2 sm:space-y-2.5">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-space-950/90 border border-slate-700 text-white text-xs font-medium placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition-colors"
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

          {/* Emergency Range Notice */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Target Emergency Window:</span>
            <span className="text-emerald-400 font-bold">25–30 km Max</span>
          </div>
        </div>

        {/* Vehicle Selection Section — positioned right below destination card */}
        <div className="space-y-1.5 sm:space-y-2 pt-0.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 text-center font-semibold">
            Select Vehicle Category
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {/* 2 Wheeler Button */}
            <button
              onClick={() => onSelectVehicle('2W')}
              className="p-3 sm:p-3.5 rounded-2xl glass-panel-glow hover:border-cyan-400 flex flex-col items-center justify-center gap-1.5 sm:gap-2 group transition-all duration-200 active:scale-95 text-center"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-space-950 transition-all">
                <Bike className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
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
              className="p-3 sm:p-3.5 rounded-2xl glass-panel-glow hover:border-cyan-400 flex flex-col items-center justify-center gap-1.5 sm:gap-2 group transition-all duration-200 active:scale-95 text-center"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-space-950 transition-all">
                <Car className="w-5 h-5 sm:w-6 sm:h-6" />
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

      {/* MY BOOKING STATUS CARD — compact, near bottom, persists across refreshes */}
      {chargingBooking && (
        <div className="px-0 pb-1 animate-in fade-in">
          <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono space-y-1.5 shadow-lg shadow-emerald-950/40">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <PlugZap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">My Booking — Confirmed</span>
              </div>
              <button
                onClick={handleCancelChargingBooking}
                title="Cancel booking"
                className="p-0.5 rounded hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Booking details */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Station</div>
                <div className="text-[10px] text-white font-semibold leading-tight truncate">{chargingBooking.stationName}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Slot</div>
                <div className="text-[10px] text-cyan-300 font-bold">{chargingBooking.slotLabel}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Pass Code</div>
                <div className="text-[10px] text-emerald-300 font-bold">{chargingBooking.passCode}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />Booked</div>
                <div className="text-[10px] text-slate-300">
                  {new Date(chargingBooking.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Micro Footer matching Slides 2 and 3 for balanced vertical anchoring */}
      <div className="text-center text-[10px] font-mono text-slate-500 py-0.5">
        Modular swappable battery network • Instant range rescue
      </div>

    </div>
  );
};
