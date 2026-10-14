'use client';

import React, { useState } from 'react';
import {
  X,
  TriangleAlert,
  Bell,
  Info,
  CheckCircle2,
  MapPin,
  Send,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { FlockAlert } from '@/types/dashboard';

interface AlertActionModalProps {
  alert: FlockAlert | null;
  onClose: () => void;
  onResolve: (alertId: string) => void;
  onNavigateToMap?: (sheepId?: string) => void;
}

export const AlertActionModal: React.FC<AlertActionModalProps> = ({
  alert,
  onClose,
  onResolve,
  onNavigateToMap,
}) => {
  const [actionDone, setActionDone] = useState(false);

  if (!alert) return null;

  const isHigh = alert.severity === 'high';
  const isMedium = alert.severity === 'medium';

  const handleResolve = () => {
    setActionDone(true);
    onResolve(alert.id);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div
          className={`px-6 py-5 text-white flex items-center justify-between ${
            isHigh
              ? 'bg-gradient-to-r from-red-600 to-rose-700'
              : isMedium
              ? 'bg-gradient-to-r from-amber-600 to-yellow-600'
              : 'bg-gradient-to-r from-blue-600 to-indigo-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              {isHigh ? (
                <TriangleAlert className="w-5 h-5" />
              ) : isMedium ? (
                <Bell className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                {alert.severity} Priority
              </span>
              <h3 className="text-base font-bold mt-1">Flock Alert Incident</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 leading-snug">
              {alert.title}
            </h4>
            <p className="text-xs text-slate-500 mt-1">{alert.description}</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Timestamp:</span>
              <span className="font-semibold text-slate-800">{alert.timestamp} ({alert.timeAgo})</span>
            </div>
            {alert.sheepId && (
              <div className="flex justify-between">
                <span className="text-slate-400">Associated Animal:</span>
                <span className="font-semibold text-blue-600">{alert.sheepId}</span>
              </div>
            )}
            {alert.location && (
              <div className="flex justify-between">
                <span className="text-slate-400">Pasture Zone:</span>
                <span className="font-semibold text-slate-800">{alert.location}</span>
              </div>
            )}
            {alert.actionTaken && (
              <div className="flex justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-400">System Action:</span>
                <span className="font-medium text-emerald-600">{alert.actionTaken}</span>
              </div>
            )}
          </div>

          {actionDone && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Alert successfully resolved and recorded.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {alert.sheepId && onNavigateToMap && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToMap(alert.sheepId);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Locate {alert.sheepId} on Live Map</span>
              </button>
            )}

            <button
              onClick={handleResolve}
              disabled={actionDone}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2E66E5] hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Alert as Resolved</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
