'use client';

import React from 'react';
import { StatCards } from '@/components/dashboard/StatCards';
import { LiveLocationMap } from '@/components/dashboard/LiveLocationMap';
import { RecentAlerts } from '@/components/dashboard/RecentAlerts';
import { FlockCountChart } from '@/components/dashboard/FlockCountChart';
import { RecentActivityTable } from '@/components/dashboard/RecentActivityTable';
import { AICountingCard } from '@/components/dashboard/AICountingCard';
import { Sheep, FlockAlert, HourlyFlockCount, AICountResult, NavigationTab } from '@/types/dashboard';

interface OverviewViewProps {
  sheepList: Sheep[];
  alerts: FlockAlert[];
  hourlyCounts: HourlyFlockCount[];
  aiCountData: AICountResult;
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectSheep: (sheep: Sheep) => void;
  selectedSheepId: string | null;
  onSelectAlert: (alert: FlockAlert) => void;
  isSimulatingGPS: boolean;
  onToggleSimulation: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  sheepList,
  alerts,
  hourlyCounts,
  aiCountData,
  onNavigateTab,
  onSelectSheep,
  selectedSheepId,
  onSelectAlert,
  isSimulatingGPS,
  onToggleSimulation,
}) => {
  const totalCount = sheepList.length;
  const safeCount = sheepList.filter((s) => s.status === 'safe').length;
  const missingCount = sheepList.filter((s) => s.status !== 'safe').length;
  const activeAlerts = alerts.filter((a) => a.status !== 'resolved');

  return (
    <div className="space-y-5">
      {/* 1. Four Summary Cards */}
      <StatCards
        totalSheep={totalCount}
        detectedCount={safeCount}
        unresponsiveCount={missingCount}
        flockStatusText="Mostly Safe"
        flockStatusSubtext={`${missingCount} sheep beyond safe zone`}
        onCardClick={(type) => {
          if (type === 'missing' || type === 'status') {
            onNavigateTab('alerts');
          } else if (type === 'detected' || type === 'total') {
            onNavigateTab('map');
          }
        }}
      />

      {/* 2. Middle Row: Live Location Map (8 cols) & Recent Alerts (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <LiveLocationMap
            sheepList={sheepList}
            onSelectSheep={onSelectSheep}
            selectedSheepId={selectedSheepId}
            onViewFullMap={() => onNavigateTab('map')}
            isSimulatingGPS={isSimulatingGPS}
            onToggleSimulation={onToggleSimulation}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <RecentAlerts
            alerts={activeAlerts}
            onViewAll={() => onNavigateTab('alerts')}
            onSelectAlert={onSelectAlert}
          />
        </div>
      </div>

      {/* 3. Bottom Row: 3 equal cards (4 cols each) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {/* Card 1: Flock Count Today */}
        <div className="flex flex-col">
          <FlockCountChart
            data={hourlyCounts}
            onViewDetails={() => onNavigateTab('history')}
          />
        </div>

        {/* Card 2: Recent Sheep Activity */}
        <div className="flex flex-col">
          <RecentActivityTable
            sheepList={sheepList}
            onSelectSheep={onSelectSheep}
            onViewAll={() => onNavigateTab('map')}
          />
        </div>

        {/* Card 3: AI Counting Latest */}
        <div className="flex flex-col">
          <AICountingCard
            data={aiCountData}
            onViewAll={() => onNavigateTab('counting')}
            onRunCounting={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
