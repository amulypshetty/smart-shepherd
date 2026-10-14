'use client';

import React, { useState } from 'react';
import { Camera, ChevronRight, Sparkles, Check, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AICountResult } from '@/types/dashboard';

interface AICountingCardProps {
  data: AICountResult;
  onViewAll?: () => void;
  onRunCounting?: () => void;
}

export const AICountingCard: React.FC<AICountingCardProps> = ({
  data,
  onViewAll,
  onRunCounting,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedCount, setDetectedCount] = useState(data.detectedCount);
  const [confidence, setConfidence] = useState(data.confidencePercent);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  const handleRunCounting = () => {
    setIsScanning(true);
    setShowSuccessBadge(false);

    // Call external handler if provided
    if (onRunCounting) onRunCounting();

    // Simulate Edge TPU scanning sequence
    setTimeout(() => {
      setIsScanning(false);
      setDetectedCount(48);
      setConfidence(97);
      setShowSuccessBadge(true);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.75, x: 0.8 },
          colors: ['#16A34A', '#2563EB', '#F59E0B'],
        });
      } catch (e) {
        // ignore in SSR
      }

      setTimeout(() => setShowSuccessBadge(false), 3500);
    }, 1800);
  };

  // Sample bounding boxes plotted over the pasture scene
  const sampleBoxes = [
    { top: 52, left: 18, w: 9, h: 14, label: '0.98' },
    { top: 48, left: 26, w: 8, h: 13, label: '0.96' },
    { top: 55, left: 33, w: 9, h: 15, label: '0.97' },
    { top: 46, left: 40, w: 8, h: 14, label: '0.95' },
    { top: 58, left: 47, w: 10, h: 16, label: '0.99' },
    { top: 50, left: 56, w: 9, h: 14, label: '0.94' },
    { top: 44, left: 63, w: 8, h: 12, label: '0.96' },
    { top: 62, left: 69, w: 9, h: 15, label: '0.98' },
    { top: 54, left: 78, w: 8, h: 13, label: '0.93' },
    { top: 66, left: 24, w: 9, h: 15, label: '0.97' },
    { top: 68, left: 38, w: 10, h: 16, label: '0.99' },
    { top: 72, left: 54, w: 9, h: 15, label: '0.95' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-800">
            AI Counting (Latest)
          </h2>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Content: Left Flock Image + Right Stats */}
      <div className="grid grid-cols-12 gap-3.5 items-center my-2">
        {/* Sheep Image with AI Bounding Box Overlays */}
        <div className="col-span-7 relative h-32 rounded-xl overflow-hidden bg-slate-800 border border-slate-200 shadow-inner group">
          {/* Pasture Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/satellite_pasture.jpg)',
              filter: 'brightness(0.9) contrast(1.1)',
            }}
          />

          {/* Pasture grass tint */}
          <div className="absolute inset-0 bg-emerald-950/30" />

          {/* AI Bounding Boxes overlaying sheep flock */}
          {sampleBoxes.map((box, idx) => (
            <div
              key={idx}
              style={{
                top: `${box.top}%`,
                left: `${box.left}%`,
                width: `${box.w}%`,
                height: `${box.h}%`,
              }}
              className="absolute border border-emerald-400 bg-emerald-400/15 rounded-xs transition-transform duration-200 group-hover:scale-105"
            >
              <span className="absolute -top-3 left-0 bg-emerald-500 text-slate-900 text-[7px] font-bold px-0.5 rounded-2xs opacity-85 leading-none">
                {box.label}
              </span>
            </div>
          ))}

          {/* Laser Scanline animation when scanning */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34D399] animate-laser-scan z-20 pointer-events-none" />
          )}

          {/* Model Watermark */}
          <div className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[8px] font-mono text-emerald-300">
            YOLOv8-Livestock
          </div>
        </div>

        {/* Right Stats: Detected, Expected, Confidence */}
        <div className="col-span-5 flex flex-col justify-between h-full pl-1 space-y-2">
          <div>
            <div className="text-[11px] font-medium text-slate-400">
              Detected Count
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {isScanning ? (
                <span className="text-blue-600 animate-pulse">Scanning...</span>
              ) : (
                detectedCount
              )}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-400">
              Expected Count
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {data.expectedCount}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
              <span>Confidence</span>
              <span className="font-bold text-slate-800">{confidence}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Button matching screenshot */}
      <div className="pt-2">
        <button
          onClick={handleRunCounting}
          disabled={isScanning}
          className="w-full py-2.5 px-4 rounded-xl bg-[#2E66E5] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 group disabled:opacity-75 cursor-pointer"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Livestock Feed...</span>
            </>
          ) : showSuccessBadge ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Flock Count Confirmed (48 Detected)</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Run Counting</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
