'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  TrendingUp,
  Download,
  Shield,
  Layers,
  ChevronRight,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { GrazingSession, HourlyFlockCount } from '@/types/dashboard';

interface HistoryViewProps {
  sessions: GrazingSession[];
  hourlyCounts: HourlyFlockCount[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ sessions, hourlyCounts }) => {
  const [selectedRange, setSelectedRange] = useState<'today' | '7days' | '30days'>('7days');
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const handleExport = () => {
    setExportMessage('Generating SmartShepherd_Flock_Report.csv...');
    setTimeout(() => {
      setExportMessage('Downloaded SmartShepherd_Flock_Report.csv successfully.');
      setTimeout(() => setExportMessage(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Grazing Sessions & Historical Telemetry
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Audit trails, past pasture sessions, geofence safety scores, and flock counts
            </p>
          </div>
        </div>

        {/* Range Selector & Export */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setSelectedRange('today')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedRange === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedRange('7days')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedRange === '7days' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setSelectedRange('30days')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedRange === '30days' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl bg-[#2E66E5] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Aggregate History Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Total Grazing Hours</span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">52.4 hrs</div>
          <span className="text-[11px] text-emerald-600 font-medium">↑ 4.2% vs previous week</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Average Safety Score</span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">97.4%</div>
          <span className="text-[11px] text-emerald-600 font-medium">Safe in designated geofence</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Total Geofence Incidents</span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">8 Incidents</div>
          <span className="text-[11px] text-slate-400 font-medium">All successfully resolved</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Flock Retention Rate</span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">100%</div>
          <span className="text-[11px] text-emerald-600 font-medium">50/50 accounted daily</span>
        </div>
      </div>

      {/* Historical Sessions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800">
            Recent Grazing Sessions Log
          </h3>
          <span className="text-xs text-slate-400">Showing last 5 completed sessions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Session Date</th>
                <th className="py-2.5 px-3">Time Window</th>
                <th className="py-2.5 px-3">Pasture Zone</th>
                <th className="py-2.5 px-3">Avg Count</th>
                <th className="py-2.5 px-3">Safety Score</th>
                <th className="py-2.5 px-3">Alerts</th>
                <th className="py-2.5 px-3">Weather</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {sessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                    {sess.date}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {sess.startTime} - {sess.endTime}
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {sess.pastureName}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {sess.averageCount} / 50
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        sess.safetyScorePercent >= 98
                          ? 'bg-emerald-100 text-emerald-700'
                          : sess.safetyScorePercent >= 95
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {sess.safetyScorePercent}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-600 font-semibold">{sess.alertsTriggered}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                    {sess.weatherSummary}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={handleExport}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 ml-auto"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Log</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
