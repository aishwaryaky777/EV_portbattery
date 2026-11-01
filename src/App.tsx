import React, { useState, useEffect } from 'react';
import { ScreenBatteryStatus } from './screens/ScreenBatteryStatus';
import { ScreenSelectService } from './screens/ScreenSelectService';
import { ScreenBatteryTakeaway } from './screens/ScreenBatteryTakeaway';
import { ScreenChargingSlot } from './screens/ScreenChargingSlot';
import { InteractiveStationMap } from './components/InteractiveStationMap';
import { fetchRealChargingStations } from './services/chargingStationService';
import { Station } from './types';
import { X, MapPin } from 'lucide-react';

export type ScreenState = 'battery-status' | 'select-service' | 'battery-takeaway' | 'charging-slot';

export const App: React.FC = () => {
  // Screen navigation state
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('battery-status');
  
  // Persistent user, location & vehicle data state across screens
  const [currentLocation, setCurrentLocation] = useState<string>('Detecting location...');
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'gps' | 'manual' | 'error'>('detecting');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destination, setDestination] = useState<string>('North Metro Bypass');
  const [routeDistanceKm, setRouteDistanceKm] = useState<number>(28);
  const [vehicleType, setVehicleType] = useState<'2W' | '4W'>('2W');
  const [batteryPct] = useState<number>(18);

  // Real charging stations and map state
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  const [dataSourceName, setDataSourceName] = useState<string>('OpenStreetMap & Open Charge Map');

  // Load real stations when userCoords is detected or on mount
  useEffect(() => {
    let isCancelled = false;
    const loadStations = async () => {
      setIsLoadingStations(true);
      const targetLat = userCoords?.lat ?? 12.9716;
      const targetLng = userCoords?.lng ?? 77.5946;
      try {
        const result = await fetchRealChargingStations({
          lat: targetLat,
          lng: targetLng,
          radiusKm: 25,
        });
        if (!isCancelled) {
          setStations(result.stations);
          setDataSourceName(result.source);
          if (result.stations.length > 0) {
            setSelectedStation((prev) => prev || result.stations[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching real EV stations:', err);
      } finally {
        if (!isCancelled) setIsLoadingStations(false);
      }
    };

    loadStations();
    return () => {
      isCancelled = true;
    };
  }, [userCoords]);

  const handleRefreshStations = async () => {
    setIsLoadingStations(true);
    const targetLat = userCoords?.lat ?? 12.9716;
    const targetLng = userCoords?.lng ?? 77.5946;
    try {
      const result = await fetchRealChargingStations({
        lat: targetLat,
        lng: targetLng,
        radiusKm: 25,
        forceRefresh: true,
      });
      setStations(result.stations);
      setDataSourceName(result.source);
    } finally {
      setIsLoadingStations(false);
    }
  };

  // Screen 1: Vehicle selected -> automatically advances to Screen 2
  const handleSelectVehicle = (type: '2W' | '4W') => {
    setVehicleType(type);
    setCurrentScreen('select-service');
  };

  // Screen 2: Service selected -> automatically advances to Screen 3A or 3B
  const handleSelectService = (service: 'battery-takeaway' | 'charging-slot') => {
    setCurrentScreen(service);
  };

  // Back navigation handlers that preserve state
  const handleBackToStatus = () => {
    setCurrentScreen('battery-status');
  };

  const handleBackToService = () => {
    setCurrentScreen('select-service');
  };

  // Return to home screen
  const handleReset = () => {
    setCurrentScreen('battery-status');
  };

  return (
    <div className="ev-bg ev-energy-stream relative h-screen h-[100dvh] w-screen overflow-hidden text-slate-100 flex flex-col justify-center items-center select-none">
      
      {/* EV Background Layers */}
      {/* Fine grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Charging station glow — top left */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      {/* Road / ground glow — bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />
      {/* Station power arc — top right */}
      <div className="absolute -top-16 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />
      {/* EV headlight beam — center bottom */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-400/8 rounded-full blur-[110px] pointer-events-none" />
      {/* Subtle purple volt accent */}
      <div className="absolute top-1/2 -left-32 w-64 h-64 bg-violet-600/6 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Screen Container - strictly 100% viewport constrained */}
      <div className="relative z-10 w-full h-full max-h-[100dvh] overflow-hidden flex flex-col">
        {currentScreen === 'battery-status' && (
          <ScreenBatteryStatus
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            locationStatus={locationStatus}
            setLocationStatus={setLocationStatus}
            userCoords={userCoords}
            setUserCoords={setUserCoords}
            destination={destination}
            setDestination={setDestination}
            routeDistanceKm={routeDistanceKm}
            setRouteDistanceKm={setRouteDistanceKm}
            onSelectVehicle={handleSelectVehicle}
            onOpenMap={() => setIsMapOpen(true)}
          />
        )}

        {currentScreen === 'select-service' && (
          <ScreenSelectService
            vehicleType={vehicleType}
            batteryPct={batteryPct}
            onSelectService={handleSelectService}
            onBack={handleBackToStatus}
          />
        )}

        {currentScreen === 'battery-takeaway' && (
          <ScreenBatteryTakeaway
            vehicleType={vehicleType}
            currentLocation={currentLocation}
            destination={destination}
            routeDistanceKm={routeDistanceKm}
            onBack={handleBackToService}
            onReset={handleReset}
          />
        )}

        {currentScreen === 'charging-slot' && (
          <ScreenChargingSlot
            vehicleType={vehicleType}
            currentLocation={currentLocation}
            destination={destination}
            routeDistanceKm={routeDistanceKm}
            onBack={handleBackToService}
            onReset={handleReset}
          />
        )}
      </div>

      {/* LIVE EV CHARGING STATION MAP MODAL */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-space-950/85 backdrop-blur-md animate-in fade-in select-none">
          <div className="relative w-full max-w-2xl max-h-[96vh] rounded-2xl glass-panel border border-cyan-500/40 p-3 sm:p-4 flex flex-col gap-2.5 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span>Live EV Charging Station Map</span>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/30">
                      {stations.length} Real Stations
                    </span>
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-mono text-cyan-300">
                    {userCoords
                      ? `GPS: ${userCoords.lat.toFixed(4)}°N, ${userCoords.lng.toFixed(4)}°E`
                      : currentLocation}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMapOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white transition-all active:scale-95"
                title="Close Map"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 w-full overflow-hidden rounded-xl">
              <InteractiveStationMap
                stations={stations}
                selectedStation={selectedStation}
                onSelectStation={(st) => setSelectedStation(st)}
                filterCategory={vehicleType || 'ALL'}
                userLocationName={currentLocation}
                userCoords={userCoords}
                onRefreshStations={handleRefreshStations}
                isLoadingStations={isLoadingStations}
                dataSourceName={dataSourceName}
                locationError={locationStatus === 'error' ? 'Location permission was denied. Enter manual location or click Retry GPS.' : null}
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default App;
