export type VehicleCategory = '2W' | '3W' | '4W';

export interface VehicleModel {
  id: string;
  name: string;
  category: VehicleCategory;
  nominalVoltage: number; // in Volts, e.g. 51.2V for 2W, 400V for 4W
  voltageRange: [number, number]; // [min, max]
  batteryCapacityKwh: number;
  consumptionKwhPerKm: number; // e.g. 0.028 for 2W, 0.065 for 3W, 0.145 for 4W
  defaultConnector: string; // e.g., 'VoltDock-2W proprietary', 'Type 2 / CCS2 DC Boost'
  image: string;
  architectureDescription: string;
}

export type BatteryChemistry = 'LFP' | 'NMC' | 'Solid-State';

export interface BatteryModule {
  id: string;
  serialNumber: string;
  nominalVoltage: number; // e.g. 48V, 60V, or 400V booster
  capacityKwh: number;
  chemistry: BatteryChemistry;
  weightKg: number;
  maxDischargeAmps: number;
  targetCategory: VehicleCategory[];
  compatibleConnectors: string[];
  dimensionsMm: [number, number, number];
  isPortableSwap: boolean; // true for 2W/3W swappable modules, false for 4W mobile DC rescue booster
}

export type BatteryStatus = 'Available' | 'Charging' | 'Reserved' | 'In Use' | 'Under Inspection' | 'Faulty';

export interface StationBay {
  bayId: string;
  moduleSerial: string;
  moduleType: string;
  voltage: number;
  nominalVoltage: number;
  capacityKwh: number;
  currentAmps: number;
  temperatureC: number;
  stateOfCharge: number; // 0 - 100%
  stateOfHealth: number; // 0 - 100%
  status: BatteryStatus;
  lastUpdated: string;
  targetCategory: VehicleCategory[];
}

export interface Station {
  id: string;
  name: string;
  address: string;
  area: string;
  pinCode: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  operatorName: string;
  operatorContact: string;
  operatingHours: string;
  totalBays: number;
  bays: StationBay[];
  supportedCategories: VehicleCategory[];
  fastChargingBayCount: number;
  isLiveFeed: boolean;
  hasDropoffSlot: boolean;
  availableReturnSlots: number;
  availabilityStatus?: string;
  dataSource?: string;
}

export interface CompatibilityCheck {
  isCompatible: boolean;
  category: VehicleCategory;
  vehicleModelName: string;
  requiredEnergyKwh: number;
  desiredRangeKm: number;
  moduleCount: number;
  moduleType: string;
  moduleVoltage: number;
  totalDeliveredKwh: number;
  estimatedExtraRangeKm: number;
  connectionMethod: string;
  safetyMarginPct: number;
  totalWeightKg: number;
  disclaimer: string;
  warnings: string[];
}

export type ReservationStatus = 
  | 'Available'
  | 'Reserved'
  | 'Ready for Collection'
  | 'In Use'
  | 'Returned'
  | 'Under Inspection'
  | 'Cancelled';

export interface Reservation {
  id: string;
  reservationCode: string;
  qrCodeUrl: string;
  createdAt: string;
  expiresAt: string;
  status: ReservationStatus;
  vehicle: {
    category: VehicleCategory;
    modelName: string;
    nominalVoltage: number;
    currentSoC: number;
    desiredRangeKm: number;
  };
  station: {
    id: string;
    name: string;
    address: string;
    area: string;
  };
  assignedBayId: string;
  moduleSerial: string;
  configurationDescription: string;
  requiredEnergyKwh: number;
  usableEnergyKwh: number;
  estimatedRangeKm: number;
  securityDeposit: number;
  energyFee: number;
  totalEstimate: number;
  pickupTimeWindow: string;
  returnDueTime: string;
  returnStationId?: string;
  returnBayId?: string;
  returnInspectionNotes?: string;
}

export interface ReturnInspectionResult {
  passed: boolean;
  inspectionId: string;
  timestamp: string;
  voltageVerified: boolean;
  measuredVoltage: number;
  temperatureC: number;
  thermalSafetyCheck: 'Pass' | 'Warning' | 'Fail';
  casingIntegrity: 'Pristine' | 'Minor Scratches' | 'Damaged';
  internalBmsHealth: number; // SoH %
  energyConsumedKwh: number;
  finalBilledAmount: number;
  depositRefunded: number;
  officerSignoff: string;
}
