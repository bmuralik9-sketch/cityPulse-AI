import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserRole,
  Language,
  HeatmapMode,
  CameraViewMode,
  MapStyleMode,
  CityTelemetry,
  ZoneData,
  PredictiveAlert,
  EmergencyIncident,
  CitizenReport,
  WasteTruckRoute,
  EnergyOptimizationPlan,
} from '../types/city';
import {
  INITIAL_ZONES,
  INITIAL_PREDICTIVE_ALERTS,
  INITIAL_EMERGENCY_INCIDENTS,
  INITIAL_CITIZEN_REPORTS,
  INITIAL_WASTE_ROUTE,
  INITIAL_ENERGY_PLAN,
} from '../data/mockCityData';
import { simulateNextTelemetry } from '../services/telemetryStream';
import { SpeechService } from '../services/speechService';

interface CityContextType {
  // Auth & Roles
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
  isInputFocused: boolean;
  setIsInputFocused: (val: boolean) => void;
  isTransitioningToDashboard: boolean;

  // Localization & Accessibility
  language: Language;
  setLanguage: (lang: Language) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  largeText: boolean;
  setLargeText: (val: boolean) => void;
  voiceReadout: boolean;
  setVoiceReadout: (val: boolean) => void;

  // 3D Scene Controls
  heatmapMode: HeatmapMode;
  setHeatmapMode: (mode: HeatmapMode) => void;
  cameraView: CameraViewMode;
  setCameraView: (view: CameraViewMode) => void;
  mapStyle: MapStyleMode;
  setMapStyle: (mode: MapStyleMode) => void;
  selectedZone: ZoneData | null;
  setSelectedZone: (zone: ZoneData | null) => void;
  hoveredBuildingInfo: { zoneId: string; name: string; metric: string } | null;
  setHoveredBuildingInfo: (info: { zoneId: string; name: string; metric: string } | null) => void;

  // City Data & Telemetry
  telemetry: CityTelemetry;
  predictiveAlerts: PredictiveAlert[];
  executeAlertAction: (alertId: string) => void;

  // Emergency Agent
  incidents: EmergencyIncident[];
  dispatchIncidentResponders: (incidentId: string) => void;
  triggerNewIncidentSimulation: (type: 'Fire Outbreak' | 'Multi-Vehicle Collision' | 'Flash Flood' | 'Substation Electrical Failure') => void;

  // Waste & Energy
  wasteRoute: WasteTruckRoute;
  dispatchWasteTruck: () => void;
  energyPlan: EnergyOptimizationPlan;
  applyEnergyPlan: () => void;

  // Citizen Reports
  citizenReports: CitizenReport[];
  submitCitizenReport: (report: Omit<CitizenReport, 'id' | 'trackingNumber' | 'timestamp' | 'status'>) => void;

  // Live Stream Toggle
  isStreamActive: boolean;
  setIsStreamActive: (active: boolean) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check initial URL parameters for quick demo / screenshot routing
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialView = searchParams ? searchParams.get('view') : null;
  const initialRoleParam = searchParams ? (searchParams.get('role') as UserRole) : null;

  // Auth state
  const [userRole, setUserRole] = useState<UserRole>(
    initialRoleParam || (initialView === 'citizen' ? 'citizen' : initialView === 'emergency' ? 'responder' : 'operator')
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialView === 'dashboard' || initialView === 'citizen' || initialView === 'emergency'
  );
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [isTransitioningToDashboard, setIsTransitioningToDashboard] = useState<boolean>(false);

  // Accessibility & Localization
  const [language, setLanguage] = useState<Language>('en');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [voiceReadout, setVoiceReadout] = useState<boolean>(false);

  // 3D Scene State
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('traffic');
  const [cameraView, setCameraView] = useState<CameraViewMode>('orbit');
  const [mapStyle, setMapStyle] = useState<MapStyleMode>('night');
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [hoveredBuildingInfo, setHoveredBuildingInfo] = useState<{ zoneId: string; name: string; metric: string } | null>(null);

  // Dynamic Telemetry
  const [telemetry, setTelemetry] = useState<CityTelemetry>({
    timestamp: new Date().toLocaleTimeString(),
    overallCongestion: 59,
    totalEnergyDemandMW: 428.4,
    renewableEnergyPercent: 46,
    wasteBinOverflowCount: 14,
    avgCityAqi: 94,
    activeIncidents: 1,
    co2SavedTodayKg: 3820,
    zones: INITIAL_ZONES,
  });

  const [predictiveAlerts, setPredictiveAlerts] = useState<PredictiveAlert[]>(INITIAL_PREDICTIVE_ALERTS);
  const [incidents, setIncidents] = useState<EmergencyIncident[]>(INITIAL_EMERGENCY_INCIDENTS);
  const [wasteRoute, setWasteRoute] = useState<WasteTruckRoute>(INITIAL_WASTE_ROUTE);
  const [energyPlan, setEnergyPlan] = useState<EnergyOptimizationPlan>(INITIAL_ENERGY_PLAN);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(INITIAL_CITIZEN_REPORTS);
  const [isStreamActive, setIsStreamActive] = useState<boolean>(true);

  // Apply accessibility classes to document body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('accessibility-contrast');
    } else {
      document.body.classList.remove('accessibility-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.body.classList.add('accessibility-large-text');
    } else {
      document.body.classList.remove('accessibility-large-text');
    }
  }, [largeText]);

  // Telemetry real-time ticking
  useEffect(() => {
    if (!isStreamActive) return;
    const interval = setInterval(() => {
      setTelemetry((prev) => simulateNextTelemetry(prev));
    }, 3500);
    return () => clearInterval(interval);
  }, [isStreamActive]);

  // Login handler with cinematic camera dive transition
  const login = (role?: UserRole) => {
    if (role) setUserRole(role);
    setIsTransitioningToDashboard(true);

    // After 1.6s fly-through camera dive, switch views
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsTransitioningToDashboard(false);
      setCameraView('isometric');
      if (voiceReadout) {
        SpeechService.speakText(`Welcome to CityPulse AI. Authenticated as ${role || userRole}. Systems nominal.`, language);
      }
    }, 1600);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setSelectedZone(null);
    setCameraView('orbit');
  };

  const executeAlertAction = (alertId: string) => {
    setPredictiveAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, actionExecuted: true } : alert
      )
    );
    if (voiceReadout) {
      SpeechService.speakText('Automated mitigation action successfully dispatched to city controllers.', language);
    }
  };

  const dispatchIncidentResponders = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId ? { ...inc, status: 'dispatched' } : inc
      )
    );
    if (voiceReadout) {
      SpeechService.speakText('Emergency units authorized and dispatched. Priority transit green-corridor activated.', language);
    }
  };

  const triggerNewIncidentSimulation = (type: 'Fire Outbreak' | 'Multi-Vehicle Collision' | 'Flash Flood' | 'Substation Electrical Failure') => {
    const randomZone = INITIAL_ZONES[Math.floor(Math.random() * INITIAL_ZONES.length)];
    const newInc: EmergencyIncident = {
      id: `inc-${Date.now().toString().slice(-4)}`,
      type,
      zoneId: randomZone.id,
      locationName: `${randomZone.name}, Sector ${randomZone.code}`,
      severity: 'critical',
      timeReported: 'Just now',
      status: 'detected',
      recommendedResponders: [
        { unitType: 'Fire & Rescue', nearestStation: 'Rapid Sector Engine 09', estimatedEtaMinutes: 2.8 },
        { unitType: 'Rapid Paramedics', nearestStation: 'Metro Trauma Ambulance #3', estimatedEtaMinutes: 3.4 },
        { unitType: 'Traffic Police', nearestStation: 'Sector Enforcement Post', estimatedEtaMinutes: 1.9 },
      ],
      clearanceRoute: `Automated dynamic green wave engaged on grid feeder roads towards ${randomZone.name}.`,
      advisoryMessage: {
        en: `CRITICAL ALERT: ${type} confirmed in ${randomZone.name}. Emergency corridors enforced. Avoid surrounding blocks.`,
        hi: `गंभीर चेतावनी: ${randomZone.name} में ${type} की पुष्टि। आपातकालीन मार्ग आरक्षित हैं। कृपया इस क्षेत्र से दूर रहें।`,
        te: `తీవ్రమైన హెచ్చరిక: ${randomZone.name} లో ${type} నమోదైంది. అత్యవసర కారిడార్ తెరవబడింది. సమీప దారులను నివారించండి.`,
      },
    };

    setIncidents((prev) => [newInc, ...prev]);
    setTelemetry((prev) => ({
      ...prev,
      activeIncidents: prev.activeIncidents + 1,
    }));

    if (voiceReadout) {
      SpeechService.speakText(`Priority Incident Detected: ${type} in ${randomZone.name}. Dispatch ready.`, language);
    }
  };

  const dispatchWasteTruck = () => {
    setWasteRoute((prev) => ({
      ...prev,
      status: 'en_route',
    }));
    // After 10s mark completed
    setTimeout(() => {
      setWasteRoute((prev) => ({
        ...prev,
        status: 'completed',
      }));
      setTelemetry((prev) => ({
        ...prev,
        wasteBinOverflowCount: Math.max(2, prev.wasteBinOverflowCount - 6),
      }));
    }, 12000);
  };

  const applyEnergyPlan = () => {
    setEnergyPlan((prev) => ({
      ...prev,
      status: 'applied',
    }));
    setTelemetry((prev) => ({
      ...prev,
      totalEnergyDemandMW: Math.max(200, +(prev.totalEnergyDemandMW - 18.2).toFixed(1)),
      co2SavedTodayKg: prev.co2SavedTodayKg + 14200,
    }));
  };

  const submitCitizenReport = (reportData: Omit<CitizenReport, 'id' | 'trackingNumber' | 'timestamp' | 'status'>) => {
    const newReport: CitizenReport = {
      ...reportData,
      id: `rep-${Date.now().toString().slice(-4)}`,
      trackingNumber: `CP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      status: 'AI Triaged',
    };
    setCitizenReports((prev) => [newReport, ...prev]);
  };

  return (
    <CityContext.Provider
      value={{
        userRole,
        setUserRole,
        isAuthenticated,
        login,
        logout,
        isInputFocused,
        setIsInputFocused,
        isTransitioningToDashboard,
        language,
        setLanguage,
        highContrast,
        setHighContrast,
        largeText,
        setLargeText,
        voiceReadout,
        setVoiceReadout,
        heatmapMode,
        setHeatmapMode,
        cameraView,
        setCameraView,
        mapStyle,
        setMapStyle,
        selectedZone,
        setSelectedZone,
        hoveredBuildingInfo,
        setHoveredBuildingInfo,
        telemetry,
        predictiveAlerts,
        executeAlertAction,
        incidents,
        dispatchIncidentResponders,
        triggerNewIncidentSimulation,
        wasteRoute,
        dispatchWasteTruck,
        energyPlan,
        applyEnergyPlan,
        citizenReports,
        submitCitizenReport,
        isStreamActive,
        setIsStreamActive,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
