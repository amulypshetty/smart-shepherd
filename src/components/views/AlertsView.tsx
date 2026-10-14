'use client';

import React, { useState, useMemo } from 'react';
import {
  Bell,
  TriangleAlert,
  Info,
  CheckCircle2,
  Search,
  Filter,
  Check,
  MapPin,
  Trash2,
  Volume2,
} from 'lucide-react';
import { FlockAlert } from '@/types/dashboard';

interface AlertsViewProps {
  alerts: FlockAlert[];
  onSelectAlert: (alert: FlockAlert) => void;
  onResolveAlert: (alertId: string) => void;
  onNavigateToMap?: (sheepId?: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onSelectAlert,
  onResolveAlert,
  onNavigateToMap,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'info' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const counts = {
    all: alerts.length,
    high: alerts.filter((a) => a.severity === 'high' && a.status !== 'resolved').length,
    medium: alerts.filter((a) => a.severity === 'medium' && a.status !== 'resolved').length,
    info: alerts.filter((a) => a.severity === 'info' && a.status !== 'resolved').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alert.sheepId && alert.sheepId.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesSeverity = true;
      if (filterSeverity === 'resolved') {
        matchesSeverity = alert.status === 'resolved';
      } else if (filterSeverity !== 'all') {
        matchesSeverity = alert.severity === filterSeverity && alert.status !== 'resolved';
      }

      return matchesSearch && matchesSeverity;
    });
  }, [alerts, filterSeverity, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Alerts</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{counts.all}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-500">High Severity</span>
            <div className="text-2xl font-bold text-rose-600 mt-0.5">{counts.high}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TriangleAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-500">Medium Warnings</span>
            <div className="text-2xl font-bold text-amber-600 mt-0.5">{counts.medium}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-500">Resolved Today</span>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5">{counts.resolved}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Alert List Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 space-y-4">
        {/* Controls: Search and Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterSeverity === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Alerts ({counts.all})
            </button>
            <button
              onClick={() => setFilterSeverity('high')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterSeverity === 'high'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              High ({counts.high})
            </button>
            <button
              onClick={() => setFilterSeverity('medium')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterSeverity === 'medium'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Medium ({counts.medium})
            </button>
            <button
              onClick={() => setFilterSeverity('info')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterSeverity === 'info'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Info ({counts.info})
            </button>
            <button
              onClick={() => setFilterSeverity('resolved')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                filterSeverity === 'resolved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Resolved ({counts.resolved})
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert title or sheep..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Alerts Table / List */}
        <div className="divide-y divide-slate-100">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No alerts match the selected criteria.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isHigh = alert.severity === 'high';
              const isMedium = alert.severity === 'medium';
              const isResolved = alert.status === 'resolved';

              return (
                <div
                  key={alert.id}
                  className={`py-4 px-3 rounded-2xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isResolved ? 'opacity-70 bg-slate-50/50' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Left: Icon & Title */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center mt-0.5 ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-600'
                          : isHigh
                          ? 'bg-rose-100 text-rose-600'
                          : isMedium
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isHigh ? (
                        <TriangleAlert className="w-5 h-5" />
                      ) : isMedium ? (
                        <Bell className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {alert.title}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isHigh
                              ? 'bg-rose-100 text-rose-700'
                              : isMedium
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{alert.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span>{alert.timestamp} ({alert.timeAgo})</span>
                        {alert.location && <span>· Location: {alert.location}</span>}
                        {alert.actionTaken && (
                          <span className="text-emerald-600 font-medium hidden md:inline">
                            · Action: {alert.actionTaken}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {alert.sheepId && onNavigateToMap && (
                      <button
                        onClick={() => onNavigateToMap(alert.sheepId)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Locate on map"
                      >
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span className="hidden sm:inline">Locate</span>
                      </button>
                    )}

                    {!isResolved && (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectAlert(alert)}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
