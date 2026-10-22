import React, { useState } from 'react';
import { ScreenBatteryStatus } from './screens/ScreenBatteryStatus';
import { ScreenSelectService } from './screens/ScreenSelectService';
import { ScreenBatteryTakeaway } from './screens/ScreenBatteryTakeaway';
import { ScreenChargingSlot } from './screens/ScreenChargingSlot';

export type ScreenState = 'battery-status' | 'select-service' | 'battery-takeaway' | 'charging-slot';

export const App: React.FC = () => {
  // Screen navigation state
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('battery-status');
  
  // Persistent user, location & vehicle data state across screens
  const [currentLocation, setCurrentLocation] = useState<string>('Detecting location...');
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'gps' | 'manual' | 'error'>('detecting');
  const [destination, setDestination] = useState<string>('North Metro Bypass');
  const [routeDistanceKm, setRouteDistanceKm] = useState<number>(28);
  const [vehicleType, setVehicleType] = useState<'2W' | '4W'>('2W');
  const [batteryPct] = useState<number>(18);

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
    <div className="relative h-screen h-[100dvh] w-screen overflow-hidden bg-space-950 text-slate-100 flex flex-col justify-center items-center select-none">
      
      {/* High-Tech Background Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Screen Container - strictly 100% viewport constrained */}
      <div className="relative z-10 w-full h-full max-h-[100dvh] overflow-hidden flex flex-col">
        {currentScreen === 'battery-status' && (
          <ScreenBatteryStatus
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            locationStatus={locationStatus}
            setLocationStatus={setLocationStatus}
            destination={destination}
            setDestination={setDestination}
            routeDistanceKm={routeDistanceKm}
            setRouteDistanceKm={setRouteDistanceKm}
            onSelectVehicle={handleSelectVehicle}
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

    </div>
  );
};

export default App;
