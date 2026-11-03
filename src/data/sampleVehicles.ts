import { VehicleModel } from '../types';

export const SAMPLE_VEHICLES: VehicleModel[] = [
  // Two Wheelers (2W) - 48V to 72V
  {
    id: 'ather-450x',
    name: 'Ather 450X Gen 3',
    category: '2W',
    nominalVoltage: 51.2,
    voltageRange: [42.0, 58.4],
    batteryCapacityKwh: 3.7,
    consumptionKwhPerKm: 0.026, // 26 Wh/km
    defaultConnector: 'VoltSnap-2W Magnetic Dock (51.2V LFP)',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    architectureDescription: 'Compact 51.2V architecture with high discharge capability; compatible with standard VoltPack-50 modules.',
  },
  {
    id: 'ola-s1-pro',
    name: 'Ola S1 Pro Gen 2',
    category: '2W',
    nominalVoltage: 72.0,
    voltageRange: [60.0, 84.0],
    batteryCapacityKwh: 4.0,
    consumptionKwhPerKm: 0.030, // 30 Wh/km
    defaultConnector: 'VoltSnap-72 Dual-Lug High Current',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    architectureDescription: 'High-voltage 72V platform requiring specialized 72V-certified swappable packs with active CAN bus handshake.',
  },
  {
    id: 'tvs-iqube',
    name: 'TVS iQube S',
    category: '2W',
    nominalVoltage: 51.2,
    voltageRange: [44.0, 57.6],
    batteryCapacityKwh: 3.04,
    consumptionKwhPerKm: 0.028, // 28 Wh/km
    defaultConnector: 'VoltSnap-2W Standard',
    image: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=600&q=80',
    architectureDescription: 'Dual parallel pack bay layout, allows single or dual modular battery insertion.',
  },

  // Three Wheelers (3W) - 48V to 60V High Current (Cargo & Passenger Autos)
  {
    id: 'mahindra-treo',
    name: 'Mahindra Treo Auto',
    category: '3W',
    nominalVoltage: 48.0,
    voltageRange: [40.0, 54.6],
    batteryCapacityKwh: 7.37,
    consumptionKwhPerKm: 0.062, // 62 Wh/km
    defaultConnector: 'VoltHeavy-3W Dual-Modular Tray',
    image: 'https://images.unsplash.com/photo-1527603815363-e7738847be40?auto=format&fit=crop&w=600&q=80',
    architectureDescription: 'Heavy-duty 48V commercial platform. Requires 2 to 3 synchronized modular battery blocks locked into under-seat chassis.',
  },
  {
    id: 'piaggio-ape-ecity',
    name: 'Piaggio Ape E-City FX',
    category: '3W',
    nominalVoltage: 48.0,
    voltageRange: [42.0, 54.0],
    batteryCapacityKwh: 5.4,
    consumptionKwhPerKm: 0.058, // 58 Wh/km
    defaultConnector: 'VoltHeavy-3W Standard Lock',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
    architectureDescription: 'Modular battery bay with quick slide-out tray; accepts 2x 2.5kWh swappable LFP bricks.',
  },

  // Four Wheelers (4W) - High Voltage (300V - 450V+)
  {
    id: 'tata-nexon-ev',
    name: 'Tata Nexon.ev Max',
    category: '4W',
    nominalVoltage: 320.0,
    voltageRange: [280.0, 380.0],
    batteryCapacityKwh: 40.5,
    consumptionKwhPerKm: 0.142, // 142 Wh/km
    defaultConnector: 'VoltRescue DC Mobile Cart (CCS2 Coupler)',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    architectureDescription: 'High-voltage 320V architecture. Requires high-voltage DC-to-DC mobile rescue booster with CCS2 DC fast handshake.',
  },
  {
    id: 'mg-zs-ev',
    name: 'MG ZS EV Long Range',
    category: '4W',
    nominalVoltage: 399.0,
    voltageRange: [340.0, 450.0],
    batteryCapacityKwh: 50.3,
    consumptionKwhPerKm: 0.155, // 155 Wh/km
    defaultConnector: 'VoltRescue DC High-Voltage CCS2 Tether',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    architectureDescription: '400V high-voltage bus. Direct physical battery swap is non-viable; emergency range delivered via VoltRescue DC booster pack.',
  },
  {
    id: 'hyundai-ioniq-5',
    name: 'Hyundai Ioniq 5',
    category: '4W',
    nominalVoltage: 697.0, // 800V class
    voltageRange: [580.0, 800.0],
    batteryCapacityKwh: 72.6,
    consumptionKwhPerKm: 0.170, // 170 Wh/km
    defaultConnector: 'VoltRescue 800V Ultra-DC Booster',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
    architectureDescription: 'Next-gen 800V multi-charging platform. Emergency power is delivered via station-deployed 800V rapid DC battery pack.',
  }
];
