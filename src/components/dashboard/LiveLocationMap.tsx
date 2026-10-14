'use client';

import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Layers,
  Battery,
  Wifi,
  Radio,
  X,
  ExternalLink,
} from 'lucide-react';
import { Sheep } from '@/types/dashboard';

interface LiveLocationMapProps {
  sheepList: Sheep[];
  onSelectSheep?: (sheep: Sheep) => void;
  selectedSheepId?: string | null;
  onViewFullMap?: () => void;
  isSimulatingGPS?: boolean;
  onToggleSimulation?: () => void;
}

export const LiveLocationMap: React.FC<LiveLocationMapProps> = ({
  sheepList,
  onSelectSheep,
  selectedSheepId,
  onViewFullMap,
  isSimulatingGPS = true,
  onToggleSimulation,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showBoundary, setShowBoundary] = useState(true);
  const [showDangerZone, setShowDangerZone] = useState(true);
  const [activeSheepPopup, setActiveSheepPopup] = useState<Sheep | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Focus sheep if passed via prop
  const currentSheep = activeSheepPopup || sheepList.find((s) => s.id === selectedSheepId);

  // SVG Coordinates for boundary polygon (percentage based 0-100)
  // Matching the rectangular-organic pasture shape in the screenshot
  const boundaryPoints = '28,36 34,36 53,36 61,37 63,40 65,49 67,58 64,62 58,62 48,62 38,62 30,62 27,61 27,47 28,40';

  // Danger zone polygon along the canal edge on the right
  const dangerZonePoints = '57,37 63,38 67,48 70,59 66,62 61,62 59,50 56,42';

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col transition-all duration-300 ${
        isFullScreen ? 'fixed inset-4 z-50 shadow-2xl' : 'relative h-full min-h-[440px]'
      }`}
    >
      {/* Header with Title and Legend */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-800">
            Live Location Map
          </h2>
          <span className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100 flex items-center gap-1.5">
            <Radio className="w-3 h-3 animate-pulse text-blue-500" />
            Simulated GPS
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 text-xs font-medium text-slate-600 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block shadow-xs"></span>
            <span>Sheep</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] inline-block shadow-xs"></span>
            <span>Missing</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-[#2563EB] inline-block"></span>
            <span>Boundary</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2.5 rounded-xs bg-rose-500/30 border border-rose-500/60 inline-block"></span>
            <span>Danger Zone</span>
          </div>

          {onViewFullMap && (
            <button
              onClick={onViewFullMap}
              className="ml-2 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Full Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Map Body */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden select-none min-h-[380px]">
        {/* Map Viewport with Zoom transform */}
        <div
          className="absolute inset-0 transition-transform duration-200 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Satellite pasture imagery background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/satellite_pasture.jpg)',
              filter: 'contrast(1.05) brightness(0.96)',
            }}
          />

          {/* Fallback pattern overlay in case image loads */}
          <div className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply" />

          {/* SVG Overlay for Geofence Boundary, Danger Zone & Roads */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Safe Geofence Boundary */}
            {showBoundary && (
              <polygon
                points={boundaryPoints}
                fill="rgba(37, 99, 235, 0.08)"
                stroke="#2563EB"
                strokeWidth="0.8"
                strokeDasharray="2.5 1.5"
                strokeLinejoin="round"
                className="drop-shadow-md"
              />
            )}

            {/* Danger Zone along canal */}
            {showDangerZone && (
              <polygon
                points={dangerZonePoints}
                fill="rgba(239, 68, 68, 0.32)"
                stroke="#DC2626"
                strokeWidth="0.6"
                strokeDasharray="1.5 1.5"
              />
            )}
          </svg>

          {/* Map Feature Badges */}
          {/* Roadside Badge */}
          <div className="absolute left-6 top-[47%] -translate-y-1/2 z-10">
            <span className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold tracking-wider border border-slate-700/60 shadow-lg">
              Roadside
            </span>
          </div>

          {/* Canal Badge */}
          <div className="absolute right-12 top-[46%] -translate-y-1/2 z-10 rotate-45 pointer-events-none">
            <span className="px-2 py-0.5 rounded-sm bg-blue-900/70 backdrop-blur-xs text-cyan-200 text-[11px] font-semibold tracking-wider border border-cyan-400/30 shadow-md">
              Canal
            </span>
          </div>

          {/* Render Sheep Pins */}
          {sheepList.map((sheep) => {
            const isSelected = (currentSheep && currentSheep.id === sheep.id) || selectedSheepId === sheep.id;
            const isDanger = sheep.status === 'outside_zone';
            const isNoSignal = sheep.status === 'no_signal';

            // Marker colors matching screenshot
            let pinBg = 'bg-[#16A34A]';
            let pinRing = 'ring-[#16A34A]/30';
            if (isDanger) {
              pinBg = 'bg-[#DC2626]';
              pinRing = 'ring-red-500/40';
            } else if (isNoSignal) {
              pinBg = 'bg-[#D97706]';
              pinRing = 'ring-amber-500/40';
            }

            return (
              <div
                key={sheep.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSheepPopup(sheep);
                  if (onSelectSheep) onSelectSheep(sheep);
                }}
                style={{
                  left: `${sheep.mapX}%`,
                  top: `${sheep.mapY}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all duration-300 hover:scale-125 ${
                  isSelected ? 'scale-125 z-30' : ''
                }`}
              >
                {/* Ping wave animation for alerts */}
                {(isDanger || isNoSignal) && (
                  <span
                    className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${
                      isDanger ? 'bg-red-500' : 'bg-amber-400'
                    }`}
                  />
                )}

                {/* Pin Container */}
                <div
                  className={`w-6 h-6 rounded-full ${pinBg} text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ${pinRing} transition-transform`}
                >
                  {isDanger ? (
                    <span className="text-[10px] font-bold">!</span>
                  ) : isNoSignal ? (
                    <span className="text-[9px] font-bold">?</span>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>

                {/* Micro Label on hover */}
                <div className="absolute top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900/90 text-white text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                  {sheep.id} {isDanger ? '(Outside)' : ''}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Overlay Widgets (Not affected by zoom transform) */}

        {/* Top-Right: Flock Center Card (Matching screenshot) */}
        <div className="absolute top-3 right-3 z-30">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 leading-tight">Flock Center</div>
              <div className="text-[11px] font-medium text-slate-500">48 sheep</div>
            </div>
          </div>
        </div>

        {/* Bottom-Left: Compass Navigation Circle (Matching screenshot) */}
        <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(1)}
            title="Reset map view"
            className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            <Compass className="w-5 h-5 text-slate-700 transform -rotate-45" />
          </button>

          {onToggleSimulation && (
            <button
              onClick={onToggleSimulation}
              title={isSimulatingGPS ? 'Pause GPS Telemetry' : 'Resume GPS Telemetry'}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium border border-slate-700 hover:bg-slate-900 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <Radio className={`w-3.5 h-3.5 ${isSimulatingGPS ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <span>{isSimulatingGPS ? 'Pause GPS' : 'Resume GPS'}</span>
            </button>
          )}
        </div>

        {/* Bottom-Right: Zoom Buttons & Fullscreen (Matching screenshot) */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'Exit full screen' : 'Expand full screen'}
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="flex flex-col rounded-lg bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md overflow-hidden">
            <button
              onClick={handleZoomIn}
              title="Zoom in"
              className="w-8 h-8 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors border-b border-slate-200/70"
            >
              <Plus className="w-4 h-4 font-bold" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom out"
              className="w-8 h-8 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <Minus className="w-4 h-4 font-bold" />
            </button>
          </div>
        </div>

        {/* Selected Sheep Popup Details (Interactive Floating Tooltip) */}
        {currentSheep && (
          <div className="absolute top-16 left-6 z-40 max-w-xs w-72 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl p-3.5 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    currentSheep.status === 'outside_zone'
                      ? 'bg-red-500'
                      : currentSheep.status === 'no_signal'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Sheep {currentSheep.id}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {currentSheep.name || 'Mandya Livestock'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSheepPopup(null)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2.5 text-slate-600">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-medium">Location</span>
                <span className="font-semibold text-slate-800">{currentSheep.locationName}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-medium">Status</span>
                <span
                  className={`font-semibold ${
                    currentSheep.status === 'outside_zone'
                      ? 'text-red-600'
                      : currentSheep.status === 'no_signal'
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {currentSheep.status === 'outside_zone'
                    ? 'Outside Zone'
                    : currentSheep.status === 'no_signal'
                    ? 'No Signal'
                    : 'Safe In Zone'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentSheep.batteryPercent}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentSheep.signalStrengthDbm} dBm</span>
              </div>
              <div className="text-slate-400 font-mono text-[10px]">
                {currentSheep.lat.toFixed(4)}, {currentSheep.lng.toFixed(4)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
