'use client';

import React, { useState } from 'react';
import { Calendar, User, ChevronDown, Menu, RefreshCw, Bell, Shield } from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onRefreshData?: () => void;
  onOpenAlerts?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onRefreshData,
  onOpenAlerts,
  unreadCount = 3,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-6 md:px-8 border-b border-slate-200/80 bg-white/60 backdrop-blur-md sticky top-0 z-30">
      {/* Mobile menu trigger & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Good Morning, Shepherd!
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            Here&apos;s the current status of your flock.
          </p>
        </div>
      </div>

      {/* Right Controls: Date/Time & Shepherd Profile */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Quick Refresh Button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            title="Refresh flock telemetry"
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors shadow-sm hidden md:flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* Date and Time Box */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-xs text-slate-700">
          <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
          <div className="text-xs leading-tight">
            <div className="font-semibold text-slate-800">14 Oct 2026</div>
            <div className="text-slate-500 font-medium">10:24 AM</div>
          </div>
        </div>

        {/* Shepherd Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-slate-800"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-semibold">
              <User className="w-4 h-4 text-slate-200" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Shepherd</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-800">Mandya Grazing Station #04</p>
                <p className="text-slate-500 text-[11px]">Primary Operator (Master Key)</p>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  if (onOpenAlerts) onOpenAlerts();
                }}
                className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pending Alerts</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              <div className="px-3.5 py-2 text-slate-500 text-[11px] border-t border-slate-100 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Geofence Guard: Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
