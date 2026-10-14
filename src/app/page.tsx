'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { OverviewView } from '@/components/views/OverviewView';
import { LiveMapView } from '@/components/views/LiveMapView';
import { AICountingView } from '@/components/views/AICountingView';
import { AlertsView } from '@/components/views/AlertsView';
import { HistoryView } from '@/components/views/HistoryView';
import { SheepDetailModal } from '@/components/modals/SheepDetailModal';
import { AlertActionModal } from '@/components/modals/AlertActionModal';
import { NavigationTab, Sheep, FlockAlert } from '@/types/dashboard';
import {
  initialSheepList,
  initialAlerts,
  hourlyFlockCounts,
  defaultAICount,
  mockGrazingSessions,
} from '@/data/mockData';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sheepList, setSheepList] = useState<Sheep[]>(initialSheepList);
  const [alerts, setAlerts] = useState<FlockAlert[]>(initialAlerts);
  const [selectedSheep, setSelectedSheep] = useState<Sheep | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<FlockAlert | null>(null);
  const [isSimulatingGPS, setIsSimulatingGPS] = useState(true);

  // Simulated GPS Telemetry Drift Effect
  // Every 4 seconds, safe sheep subtly wander slightly within their pasture boundary
  useEffect(() => {
    if (!isSimulatingGPS) return;

    const interval = setInterval(() => {
      setSheepList((prevList) =>
        prevList.map((sheep) => {
          // Keep outside sheep (#12) and signal-lost sheep (#27) at fixed alert locations
          if (sheep.status !== 'safe') {
            return sheep;
          }

          // Subtle drift between -0.4% and +0.4% within safe pasture box
          const dx = (Math.random() - 0.5) * 0.8;
          const dy = (Math.random() - 0.5) * 0.8;

          const newX = Math.min(Math.max(sheep.mapX + dx, 29), 60);
          const newY = Math.min(Math.max(sheep.mapY + dy, 38), 61);

          return {
            ...sheep,
            mapX: Number(newX.toFixed(2)),
            mapY: Number(newY.toFixed(2)),
            lat: sheep.lat + dx * 0.00001,
            lng: sheep.lng + dy * 0.00001,
            speedKmh: Number((0.2 + Math.random() * 0.7).toFixed(1)),
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulatingGPS]);

  // Handler for resolving alert
  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved' as const } : a))
    );
  };

  // Handler for updating sheep status
  const handleUpdateSheepStatus = (sheepId: string, newStatus: Sheep['status']) => {
    setSheepList((prev) =>
      prev.map((s) => (s.id === sheepId ? { ...s, status: newStatus } : s))
    );

    // If marked safe, also resolve any matching alert
    if (newStatus === 'safe') {
      setAlerts((prev) =>
        prev.map((a) => (a.sheepId === sheepId ? { ...a, status: 'resolved' as const } : a))
      );
    }
  };

  // Handler to locate a sheep on the map
  const handleLocateSheepOnMap = (sheepId?: string) => {
    if (sheepId) {
      const found = sheepList.find((s) => s.id === sheepId);
      if (found) {
        setSelectedSheep(found);
      }
    }
    setActiveTab('map');
  };

  const unreadAlertCount = alerts.filter((a) => a.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-[#F3F5F9] text-[#0F172A] flex flex-col lg:flex-row font-sans">
      {/* 1. Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadAlertCount={unreadAlertCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isSimulatingGPS={isSimulatingGPS}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onRefreshData={() => {
            // Re-trigger simulated ping
            setSheepList([...sheepList]);
          }}
          onOpenAlerts={() => setActiveTab('alerts')}
          unreadCount={unreadAlertCount}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-7 max-w-[1600px] w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewView
              sheepList={sheepList}
              alerts={alerts}
              hourlyCounts={hourlyFlockCounts}
              aiCountData={defaultAICount}
              onNavigateTab={setActiveTab}
              onSelectSheep={(sheep) => setSelectedSheep(sheep)}
              selectedSheepId={selectedSheep?.id || null}
              onSelectAlert={(alert) => setSelectedAlert(alert)}
              isSimulatingGPS={isSimulatingGPS}
              onToggleSimulation={() => setIsSimulatingGPS(!isSimulatingGPS)}
            />
          )}

          {activeTab === 'map' && (
            <LiveMapView
              sheepList={sheepList}
              onSelectSheep={(sheep) => setSelectedSheep(sheep)}
              selectedSheepId={selectedSheep?.id || null}
              isSimulatingGPS={isSimulatingGPS}
              onToggleSimulation={() => setIsSimulatingGPS(!isSimulatingGPS)}
            />
          )}

          {activeTab === 'counting' && (
            <AICountingView initialResult={defaultAICount} />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onSelectAlert={(alert) => setSelectedAlert(alert)}
              onResolveAlert={handleResolveAlert}
              onNavigateToMap={handleLocateSheepOnMap}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              sessions={mockGrazingSessions}
              hourlyCounts={hourlyFlockCounts}
            />
          )}
        </main>
      </div>

      {/* 3. Interactive Modals */}
      <SheepDetailModal
        sheep={selectedSheep}
        onClose={() => setSelectedSheep(null)}
        onUpdateStatus={handleUpdateSheepStatus}
      />

      <AlertActionModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onResolve={handleResolveAlert}
        onNavigateToMap={handleLocateSheepOnMap}
      />
    </div>
  );
}
