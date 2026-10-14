'use client';

import React, { useState } from 'react';
import {
  X,
  Battery,
  Wifi,
  Activity,
  Thermometer,
  Compass,
  Bell,
  Volume2,
  CheckCircle2,
  Shield,
  Radio,
} from 'lucide-react';
import { Sheep } from '@/types/dashboard';

interface SheepDetailModalProps {
  sheep: Sheep | null;
  onClose: () => void;
  onUpdateStatus?: (sheepId: string, newStatus: Sheep['status']) => void;
}

export const SheepDetailModal: React.FC<SheepDetailModalProps> = ({
  sheep,
  onClose,
  onUpdateStatus,
}) => {
  const [buzzerActive, setBuzzerActive] = useState(false);
  const [collarMessage, setCollarMessage] = useState<string | null>(null);

  if (!sheep) return null;

  const isOutside = sheep.status === 'outside_zone';
  const isNoSignal = sheep.status === 'no_signal';

  const handleTriggerBuzzer = () => {
    setBuzzerActive(true);
    setCollarMessage('Transmitted high-frequency acoustic pulse to collar.');
    setTimeout(() => {
      setBuzzerActive(false);
      setCollarMessage(null);
    }, 3000);
  };

  const handleMarkResolved = () => {
    if (onUpdateStatus) {
      onUpdateStatus(sheep.id, 'safe');
    }
    setCollarMessage('Sheep status updated to Safe (In-Zone).');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-[#18233C] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-lg border border-white/20">
              {sheep.id}
            </div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span>{sheep.name || `Sheep ${sheep.id}`}</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                    isOutside
                      ? 'bg-rose-500 text-white'
                      : isNoSignal
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {isOutside ? 'Outside Safe Zone' : isNoSignal ? 'Signal Lost' : 'Safe In Pasture'}
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                {sheep.tagId} · {sheep.collarId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert Banner if outside or no signal */}
        {(isOutside || isNoSignal) && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between ${
              isOutside
                ? 'bg-rose-50 text-rose-700 border-b border-rose-100'
                : 'bg-amber-50 text-amber-700 border-b border-amber-100'
            }`}
          >
            <span>
              {isOutside
                ? '⚠️ Geofence breach detected near Canal Edge.'
                : '⚠️ No telemetry packet received for 45+ minutes.'}
            </span>
            <button
              onClick={handleMarkResolved}
              className="text-blue-600 hover:underline font-bold text-[11px]"
            >
              Mark Safe
            </button>
          </div>
        )}

        {/* Telemetry Metrics */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {/* Battery */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Battery className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-semibold">Battery</span>
              </div>
              <div className="text-lg font-bold text-slate-900">{sheep.batteryPercent}%</div>
              <span className="text-[10px] text-slate-400">LiFePO4 Solar</span>
            </div>

            {/* Signal */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Wifi className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-semibold">Signal</span>
              </div>
              <div className="text-lg font-bold text-slate-900">{sheep.signalStrengthDbm} dBm</div>
              <span className="text-[10px] text-slate-400">LoRaWAN 868MHz</span>
            </div>

            {/* Heart Rate */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Activity className="w-4 h-4 text-rose-500" />
                <span className="text-[11px] font-semibold">Biometrics</span>
              </div>
              <div className="text-lg font-bold text-slate-900">{sheep.heartRateBpm} BPM</div>
              <span className="text-[10px] text-slate-400">Normal Active</span>
            </div>

            {/* Temperature */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Thermometer className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-semibold">Body Temp</span>
              </div>
              <div className="text-lg font-bold text-slate-900">{sheep.temperatureC}°C</div>
              <span className="text-[10px] text-slate-400">Optimal (38-39°C)</span>
            </div>
          </div>

          {/* Telemetry details list */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Current Pasture Zone:</span>
              <span className="font-semibold text-slate-800">{sheep.locationName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Simulated GPS Coordinates:</span>
              <span className="font-mono text-slate-800 font-semibold">
                {sheep.lat.toFixed(6)}° N, {sheep.lng.toFixed(6)}° E
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Ground Speed:</span>
              <span className="font-semibold text-slate-800">{sheep.speedKmh} km/h (Grazing pace)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500">Breed & Age:</span>
              <span className="font-semibold text-slate-800">
                {sheep.breed} · {sheep.ageMonths} months
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Last Telemetry Heartbeat:</span>
              <span className="font-semibold text-slate-800">{sheep.lastSeen} (14 Oct 2026)</span>
            </div>
          </div>

          {/* Collar notification feedback */}
          {collarMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs font-medium flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600 animate-spin" />
              <span>{collarMessage}</span>
            </div>
          )}

          {/* Remote Collar Commands */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleTriggerBuzzer}
              disabled={buzzerActive}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{buzzerActive ? 'Emitting Tone...' : 'Sound Collar Buzzer'}</span>
            </button>

            {isOutside && (
              <button
                onClick={handleMarkResolved}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Recovered</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
