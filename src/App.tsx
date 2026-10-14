import React from 'react';
import { CityProvider, useCity } from './context/CityContext';
import { CitySkylineScene } from './components/3d/CitySkylineScene';
import { LoginCard } from './components/login/LoginCard';
import { Navbar } from './components/common/Navbar';
import { OperatorDashboard } from './components/dashboard/OperatorDashboard';
import { CitizenPortal } from './components/citizen/CitizenPortal';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, userRole } = useCity();

  return (
    <div className="relative min-h-screen w-full bg-[#0B1020] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background 3D Animated City Scene */}
      <CitySkylineScene />

      {/* Unauthenticated View: Stunning 3D Login */}
      {!isAuthenticated && <LoginCard />}

      {/* Authenticated View: Top Navbar + Role View */}
      {isAuthenticated && (
        <>
          <Navbar />
          {userRole === 'citizen' ? <CitizenPortal /> : <OperatorDashboard />}
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <CityProvider>
      <MainAppContent />
    </CityProvider>
  );
}
