'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Radio,
  Battery,
  Wifi,
  Shield,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Sheep } from '@/types/dashboard';
import { LiveLocationMap } from '@/components/dashboard/LiveLocationMap';

interface LiveMapViewProps {
  sheepList: Sheep[];
  onSelectSheep: (sheep: Sheep) => void;
  selectedSheepId: string | null;
  isSimulatingGPS: boolean;
  onToggleSimulation: () => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({
  sheepList,
  onSelectSheep,
  selectedSheepId,
  isSimulatingGPS,
  onToggleSimulation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'safe' | 'outside_zone' | 'no_signal'>('all');
  const [pingMessage, setPingMessage] = useState<string | null>(null);

  // Filtered sheep list
  const filteredSheep = useMemo(() => {
    return sheepList.filter((s) => {
      const matchesSearch =
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.locationName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ? true : s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sheepList, searchQuery, statusFilter]);

  const counts = {
    all: sheepList.length,
    safe: sheepList.filter((s) => s.status === 'safe').length,
    outside: sheepList.filter((s) => s.status === 'outside_zone').length,
    no_signal: sheepList.filter((s) => s.status === 'no_signal').length,
  };

  const handlePingAll = () => {
    setPingMessage('Broadcasting LoRa ping to all 50 collars...');
    setTimeout(() => {
      setPingMessage('Received 49/50 collar telemetry packets. (Collar #27 timed out)');
      setTimeout(() => setPingMessage(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Status & Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>Pasture Geofence & Live Tracking</span>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
                LoRa Gateway #1 Online
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Mandya Sector 4 Grazing Basin · Precision GPS: ±1.2m
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSimulation}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isSimulatingGPS
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isSimulatingGPS ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Telemetry</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Telemetry</span>
              </>
            )}
          </button>

          <button
            onClick={handlePingAll}
            className="px-3.5 py-2 rounded-xl bg-[#2E66E5] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Ping All 50 Collars</span>
          </button>
        </div>
      </div>

      {pingMessage && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>📡 {pingMessage}</span>
          <button onClick={() => setPingMessage(null)} className="text-blue-500 hover:text-blue-800">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Map + Sheep Telemetry Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Expanded Map (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-[580px]">
          <LiveLocationMap
            sheepList={sheepList}
            onSelectSheep={onSelectSheep}
            selectedSheepId={selectedSheepId}
            isSimulatingGPS={isSimulatingGPS}
            onToggleSimulation={onToggleSimulation}
          />
        </div>

        {/* Sheep Telemetry Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 flex flex-col h-[580px]">
          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Tag or Location..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 text-[11px] font-medium text-slate-600">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setStatusFilter('safe')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === 'safe'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Safe ({counts.safe})
            </button>
            <button
              onClick={() => setStatusFilter('outside_zone')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === 'outside_zone'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Outside ({counts.outside})
            </button>
            <button
              onClick={() => setStatusFilter('no_signal')}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === 'no_signal'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Lost ({counts.no_signal})
            </button>
          </div>

          {/* Sheep List Scrollable */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 my-2 pr-1">
            {filteredSheep.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No sheep match the selected criteria.
              </div>
            ) : (
              filteredSheep.map((sheep) => {
                const isSelected = selectedSheepId === sheep.id;
                const isOutside = sheep.status === 'outside_zone';
                const isNoSignal = sheep.status === 'no_signal';

                return (
                  <div
                    key={sheep.id}
                    onClick={() => onSelectSheep(sheep)}
                    className={`py-2.5 px-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-50/80 border border-blue-200'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Avatar with status border */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isOutside
                            ? 'bg-red-100 text-red-600 ring-2 ring-red-400'
                            : isNoSignal
                            ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-400'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {sheep.id}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                            {sheep.id}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {sheep.collarId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {sheep.locationName} · {sheep.lastSeen}
                        </p>
                      </div>
                    </div>

                    {/* Right: Battery and Pill */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isOutside
                            ? 'bg-red-100 text-red-700'
                            : isNoSignal
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {isOutside
                          ? 'Outside'
                          : isNoSignal
                          ? 'No Signal'
                          : 'Safe'}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Battery className="w-3 h-3 text-slate-400" />
                        <span>{sheep.batteryPercent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer summary */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Showing {filteredSheep.length} of {sheepList.length}</span>
            <span className="font-semibold text-slate-600">Click any sheep to inspect</span>
          </div>
        </div>
      </div>
    </div>
  );
};
