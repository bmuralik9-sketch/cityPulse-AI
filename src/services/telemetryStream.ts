import type { CityTelemetry, ZoneData } from '../types/city';

export function simulateNextTelemetry(prev: CityTelemetry): CityTelemetry {
  const deltaCongestion = (Math.random() - 0.48) * 1.5;
  const newCongestion = Math.min(98, Math.max(15, Math.round(prev.overallCongestion + deltaCongestion)));

  const deltaEnergy = (Math.random() - 0.49) * 4.2;
  const newEnergy = Math.min(850, Math.max(200, +(prev.totalEnergyDemandMW + deltaEnergy).toFixed(1)));

  const deltaCo2 = Math.floor(Math.random() * 5) + 3;

  const updatedZones = prev.zones.map((zone: ZoneData) => {
    const zoneCongestionDelta = (Math.random() - 0.5) * 3;
    const zCongestion = Math.min(100, Math.max(10, Math.round(zone.trafficCongestion + zoneCongestionDelta)));

    const zAqiDelta = (Math.random() - 0.5) * 2;
    const zAqi = Math.min(300, Math.max(20, Math.round(zone.aqi + zAqiDelta)));

    let status: 'optimal' | 'warning' | 'critical' = 'optimal';
    if (zCongestion > 80 || zAqi > 150) {
      status = 'critical';
    } else if (zCongestion > 60 || zAqi > 100) {
      status = 'warning';
    }

    return {
      ...zone,
      trafficCongestion: zCongestion,
      aqi: zAqi,
      status,
    };
  });

  return {
    ...prev,
    timestamp: new Date().toLocaleTimeString(),
    overallCongestion: newCongestion,
    totalEnergyDemandMW: newEnergy,
    co2SavedTodayKg: prev.co2SavedTodayKg + deltaCo2,
    zones: updatedZones,
  };
}
