import { CompatibilityCheck, VehicleCategory, VehicleModel } from '../types';

export interface EnergyCalculationParams {
  category: VehicleCategory;
  model?: VehicleModel;
  customNominalVoltage?: number;
  customConsumptionKwhPerKm?: number;
  customCapacityKwh?: number;
  currentSoC: number; // 0 - 100%
  desiredRangeKm: number;
}

export function calculateEnergyAndCompatibility(params: EnergyCalculationParams): CompatibilityCheck {
  const {
    category,
    model,
    customNominalVoltage,
    customConsumptionKwhPerKm,
    currentSoC,
    desiredRangeKm,
  } = params;

  // Resolve nominal voltage
  const nominalVoltage = model ? model.nominalVoltage : (customNominalVoltage || (category === '2W' ? 51.2 : category === '3W' ? 48 : 350));
  
  // Resolve consumption (kWh/km)
  const defaultConsumption = category === '2W' ? 0.028 : category === '3W' ? 0.065 : 0.150;
  const consumptionKwhPerKm = model ? model.consumptionKwhPerKm : (customConsumptionKwhPerKm || defaultConsumption);

  const modelName = model ? model.name : `Custom ${category} (${nominalVoltage}V)`;

  // 1. Raw required energy based on desired distance
  const rawEnergyRequiredKwh = desiredRangeKm * consumptionKwhPerKm;

  // 2. Engineering factors:
  // - Usable depth of discharge (DoD) of swappable/emergency modules ~ 90% (0.90)
  // - Power conversion & thermal losses ~ 8% (efficiency = 0.92)
  // - Safety reserve margin buffer ~ 15% (factor 1.15) for emergency safety
  const dodFactor = 0.90;
  const efficiency = 0.92;
  const safetyMarginPct = 15;
  const safetyFactor = 1 + (safetyMarginPct / 100);

  const effectiveRequiredKwh = (rawEnergyRequiredKwh / (dodFactor * efficiency)) * safetyFactor;
  const roundedRequiredKwh = parseFloat(effectiveRequiredKwh.toFixed(2));

  const warnings: string[] = [];

  // Determine modular configuration based on voltage and category engineering constraints
  if (category === '2W') {
    // 2W vehicles generally use 48V-52V (VoltPack-50, 1.8kWh) or 72V (VoltPack-72, 2.2kWh)
    let moduleType = 'VoltPack-50 (48V/51.2V 1.8kWh LFP)';
    let singleModuleKwh = 1.8;
    let singleModuleVoltage = 51.2;
    let singleModuleWeight = 11.5; // kg

    if (nominalVoltage >= 68) {
      moduleType = 'VoltPack-72 (72V 2.2kWh NMC High-Drain)';
      singleModuleKwh = 2.2;
      singleModuleVoltage = 72.0;
      singleModuleWeight = 13.8;
    }

    // Number of modules needed (typically 1 or 2 modules fit on a 2W bike)
    const neededModules = Math.max(1, Math.ceil(roundedRequiredKwh / singleModuleKwh));
    const practicalModules = Math.min(neededModules, 2);

    if (neededModules > 2) {
      warnings.push(`Most two-wheelers have a physical limit of 2 modular bays. ${neededModules} modules requested; capped at 2 modules (~${(2 * singleModuleKwh * 0.90 / consumptionKwhPerKm).toFixed(0)} km safe range).`);
    }

    const totalDeliveredKwh = practicalModules * singleModuleKwh;
    const estimatedExtraRangeKm = Math.round((totalDeliveredKwh * dodFactor * efficiency) / consumptionKwhPerKm);

    return {
      isCompatible: true,
      category: '2W',
      vehicleModelName: modelName,
      requiredEnergyKwh: roundedRequiredKwh,
      desiredRangeKm,
      moduleCount: practicalModules,
      moduleType,
      moduleVoltage: singleModuleVoltage,
      totalDeliveredKwh: parseFloat(totalDeliveredKwh.toFixed(2)),
      estimatedExtraRangeKm,
      connectionMethod: practicalModules > 1 ? 'Dual-bay parallel docking with CAN-synchronization' : 'Single-bay quick-dock latch (5-pin insulated IP67)',
      safetyMarginPct,
      totalWeightKg: practicalModules * singleModuleWeight,
      disclaimer: 'Estimates calculated with 90% usable DoD and 15% emergency safety reserve under standard urban driving conditions.',
      warnings,
    };
  } else if (category === '3W') {
    // 3W commercial passenger or cargo: 48V VoltHeavy blocks (2.6kWh each)
    const singleModuleKwh = 2.6;
    const singleModuleVoltage = 48.0;
    const singleModuleWeight = 19.0;
    const moduleType = 'VoltHeavy-48 (48V 2.6kWh Commercial LFP Pack)';

    // 3W can house up to 3 or 4 modules in under-chassis bay
    const neededModules = Math.max(1, Math.ceil(roundedRequiredKwh / singleModuleKwh));
    const practicalModules = Math.min(neededModules, 4);

    if (neededModules > 4) {
      warnings.push(`Commercial 3-wheelers can house a maximum of 4 swappable tray modules simultaneously. Selected 4 modules.`);
    }

    const totalDeliveredKwh = practicalModules * singleModuleKwh;
    const estimatedExtraRangeKm = Math.round((totalDeliveredKwh * dodFactor * efficiency) / consumptionKwhPerKm);

    return {
      isCompatible: true,
      category: '3W',
      vehicleModelName: modelName,
      requiredEnergyKwh: roundedRequiredKwh,
      desiredRangeKm,
      moduleCount: practicalModules,
      moduleType,
      moduleVoltage: singleModuleVoltage,
      totalDeliveredKwh: parseFloat(totalDeliveredKwh.toFixed(2)),
      estimatedExtraRangeKm,
      connectionMethod: 'Slide-in under-floor chassis tray with automated BMS bus bar interlock',
      safetyMarginPct,
      totalWeightKg: practicalModules * singleModuleWeight,
      disclaimer: 'Calculated with heavy-duty commercial load dynamics and 8% powertrain thermal compensation.',
      warnings,
    };
  } else {
    // 4W Four-Wheelers: High Voltage (300V - 800V DC)
    // CRITICAL ENGINEERING REALITY:
    // Electric cars use sealed 300V - 800V structural traction batteries. You cannot simply plug a 48V handheld battery into an electric car.
    // The VoltShare platform dispatches or reserves an on-station or roadside "VoltRescue DC Mobile Unit" (16kWh - 25kWh) equipped with CCS2/Type2 DC Fast charging protocol.
    const is800V = nominalVoltage >= 600;
    const moduleType = is800V 
      ? 'VoltRescue 800V Ultra-DC Mobile Booster (25kWh High-Rate LFP)'
      : 'VoltRescue DC Mobile Unit (400V 16kWh CCS2 Emergency Booster)';
    
    const boosterCapacity = is800V ? 25.0 : 16.0;
    const boosterVoltage = is800V ? 800.0 : 400.0;
    const boosterWeight = is800V ? 185.0 : 130.0;

    warnings.push('Four-wheelers utilize high-voltage traction buses (300V–800V). Emergency energy is delivered via the VoltRescue DC rapid-transfer unit (CCS2), not by hand-held cell swapping.');

    const deliveredKwh = Math.min(roundedRequiredKwh, boosterCapacity * 0.95);
    const estimatedExtraRangeKm = Math.round((deliveredKwh * dodFactor * efficiency) / consumptionKwhPerKm);

    return {
      isCompatible: true,
      category: '4W',
      vehicleModelName: modelName,
      requiredEnergyKwh: roundedRequiredKwh,
      desiredRangeKm,
      moduleCount: 1, // 1 emergency DC rescue booster unit
      moduleType,
      moduleVoltage: boosterVoltage,
      totalDeliveredKwh: parseFloat(deliveredKwh.toFixed(2)),
      estimatedExtraRangeKm,
      connectionMethod: 'High-Voltage DC Fast Coupler (CCS2 standard) with ISO 15118 digital handshake',
      safetyMarginPct,
      totalWeightKg: boosterWeight,
      disclaimer: 'High-voltage transfer conducted under automated BMS safety containment protocol. Real-time insulation resistance verified before energizing.',
      warnings,
    };
  }
}
