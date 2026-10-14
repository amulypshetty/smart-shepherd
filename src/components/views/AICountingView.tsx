'use client';

import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Sliders,
  Eye,
  EyeOff,
  Download,
  AlertCircle,
  Cpu,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AICountResult, AIDetectionItem } from '@/types/dashboard';

interface AICountingViewProps {
  initialResult: AICountResult;
}

export const AICountingView: React.FC<AICountingViewProps> = ({ initialResult }) => {
  const [selectedImage, setSelectedImage] = useState<string>('/satellite_pasture.jpg');
  const [selectedImageName, setSelectedImageName] = useState<string>('drone_aerial_pasture_live.jpg');
  const [isScanning, setIsScanning] = useState(false);
  const [detectedCount, setDetectedCount] = useState<number>(initialResult.detectedCount);
  const [expectedCount, setExpectedCount] = useState<number>(50);
  const [confidence, setConfidence] = useState<number>(initialResult.confidencePercent);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(85);
  const [showBoxes, setShowBoxes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [inferenceTime, setInferenceTime] = useState<number>(142);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset sample pasture images
  const samplePresets = [
    {
      id: 'drone-aerial',
      title: 'Drone Aerial Pasture (Live)',
      src: '/satellite_pasture.jpg',
      count: 48,
      expected: 50,
      conf: 96,
      inferenceMs: 142,
    },
    {
      id: 'canal-edge',
      title: 'Canal Edge Morning Herd',
      src: '/satellite_pasture.jpg',
      count: 49,
      expected: 50,
      conf: 98,
      inferenceMs: 128,
    },
    {
      id: 'west-meadow',
      title: 'West Meadow Grazing Survey',
      src: '/satellite_pasture.jpg',
      count: 50,
      expected: 50,
      conf: 99,
      inferenceMs: 136,
    },
  ];

  // AI Bounding Boxes for demonstration
  const detectionBoxes: AIDetectionItem[] = [
    { id: '1', label: 'Sheep #01', confidence: 0.98, box: [22, 35, 7, 9] },
    { id: '2', label: 'Sheep #02', confidence: 0.96, box: [30, 38, 6, 8] },
    { id: '3', label: 'Sheep #03', confidence: 0.97, box: [38, 42, 7, 9] },
    { id: '4', label: 'Sheep #04', confidence: 0.94, box: [45, 40, 6, 8] },
    { id: '5', label: 'Sheep #05', confidence: 0.99, box: [52, 45, 8, 10] },
    { id: '6', label: 'Sheep #06', confidence: 0.95, box: [59, 47, 6, 9] },
    { id: '7', label: 'Sheep #07', confidence: 0.96, box: [66, 49, 7, 9] },
    { id: '8', label: 'Sheep #08', confidence: 0.97, box: [34, 52, 7, 8] },
    { id: '9', label: 'Sheep #09', confidence: 0.93, box: [41, 54, 6, 9] },
    { id: '10', label: 'Sheep #10', confidence: 0.98, box: [48, 57, 7, 9] },
    { id: '11', label: 'Sheep #11', confidence: 0.95, box: [55, 60, 7, 8] },
    { id: '12', label: 'Sheep #12', confidence: 0.91, box: [68, 55, 7, 9] }, // Outside near canal
    { id: '13', label: 'Sheep #13', confidence: 0.97, box: [26, 46, 6, 8] },
    { id: '14', label: 'Sheep #14', confidence: 0.96, box: [33, 60, 7, 9] },
    { id: '15', label: 'Sheep #15', confidence: 0.98, box: [42, 64, 7, 8] },
    { id: '16', label: 'Sheep #16', confidence: 0.94, box: [51, 66, 6, 9] },
    { id: '17', label: 'Sheep #17', confidence: 0.96, box: [29, 32, 6, 8] },
    { id: '18', label: 'Sheep #18', confidence: 0.95, box: [49, 36, 7, 8] },
  ];

  const handleRunScan = () => {
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      setDetectedCount(48);
      setConfidence(96);
      setInferenceTime(Math.floor(130 + Math.random() * 25));

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16A34A', '#2563EB', '#F59E0B'],
        });
      } catch (e) {
        // ignore
      }
    }, 1600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setSelectedImageName(file.name);
      handleRunScan();
    }
  };

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setSelectedImage(preset.src);
    setSelectedImageName(preset.title);
    setDetectedCount(preset.count);
    setExpectedCount(preset.expected);
    setConfidence(preset.conf);
    setInferenceTime(preset.inferenceMs);
    handleRunScan();
  };

  return (
    <div className="space-y-5">
      {/* View Header with AI disclaimer badge */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>Computer Vision Flock Counter</span>
              <span className="text-[11px] font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                YOLOv8-Livestock (Demo Model)
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time deep learning bounding box detection for pasture herds & drone captures
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Upload Image</span>
          </button>

          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-[#2E66E5] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-75"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Inference...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Count</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Interactive Canvas / Image Preview (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 flex flex-col space-y-3">
          {/* Top toolbar over image */}
          <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-700">{selectedImageName}</span>
              <span className="text-[11px] text-slate-400">({inferenceTime}ms Edge TPU)</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBoxes(!showBoxes)}
                className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${
                  showBoxes ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {showBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Boxes</span>
              </button>

              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${
                  showLabels ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>Labels</span>
              </button>
            </div>
          </div>

          {/* Image Display Container */}
          <div className="relative w-full h-[460px] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center select-none group">
            {/* Background Feed */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: `url(${selectedImage})`,
                filter: 'brightness(0.92) contrast(1.05)',
              }}
            />

            {/* Pasture green overlay tint */}
            <div className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply" />

            {/* Laser scanning bar animation */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34D399] animate-laser-scan z-30" />
            )}

            {/* Bounding Box Overlays */}
            {showBoxes &&
              detectionBoxes.map((det) => (
                <div
                  key={det.id}
                  style={{
                    left: `${det.box[0]}%`,
                    top: `${det.box[1]}%`,
                    width: `${det.box[2]}%`,
                    height: `${det.box[3]}%`,
                  }}
                  className="absolute border-2 border-emerald-400 bg-emerald-400/15 rounded-xs transition-transform group-hover:scale-105 z-20 cursor-pointer"
                >
                  {showLabels && (
                    <span className="absolute -top-4 left-0 bg-emerald-500 text-slate-950 font-bold text-[8px] px-1 py-0.2 rounded-xs whitespace-nowrap shadow-xs">
                      {det.label} ({(det.confidence * 100).toFixed(0)}%)
                    </span>
                  )}
                </div>
              ))}

            {/* Floating Live HUD Badge */}
            <div className="absolute top-3 left-3 z-30 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">Model Status: Ready</span>
            </div>

            <div className="absolute bottom-3 right-3 z-30 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-emerald-400 text-[10px] font-mono">
              Inference: {inferenceTime}ms · 1080p
            </div>
          </div>

          {/* Sample Preset Buttons */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-500 block mb-2">
              Select Preset Pasture Captures:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {samplePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedImageName === preset.title
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {preset.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Expected: {preset.expected} · Detected: {preset.count}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Vision Telemetry & Analytics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Key Stat Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              Detection Summary
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400">Detected Count</span>
                <div className="text-3xl font-extrabold text-blue-600 mt-0.5">
                  {detectedCount}
                </div>
                <span className="text-[10px] text-slate-500">Live AI Count</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400">Expected Flock</span>
                <div className="text-3xl font-extrabold text-slate-800 mt-0.5">
                  {expectedCount}
                </div>
                <span className="text-[10px] text-slate-500">Registered IDs</span>
              </div>
            </div>

            {/* Discrepancy warning */}
            {detectedCount !== expectedCount ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">2 Animals Unaccounted In View</span>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Sheep #12 and #27 are outside the primary camera field of view near the canal.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Complete Flock Accounted For (100%)</span>
              </div>
            )}

            {/* Confidence Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-medium">Confidence Score:</span>
                <span className="font-bold text-slate-800">{confidence}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>

            {/* Threshold Filter */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Confidence Threshold</span>
                <span className="font-mono font-bold text-slate-800">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Model Specs Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 text-xs text-slate-600 space-y-2.5">
            <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">
              Simulated Vision Pipeline
            </h4>
            <div className="flex justify-between">
              <span className="text-slate-400">Architecture:</span>
              <span className="font-semibold text-slate-800">YOLOv8-Livestock-S</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hardware Accelerator:</span>
              <span className="font-semibold text-slate-800">Google Coral TPU v2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Input Resolution:</span>
              <span className="font-semibold text-slate-800">1920 × 1080 @ 30 FPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Classification mAP@50:</span>
              <span className="font-semibold text-emerald-600">94.8% Accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
