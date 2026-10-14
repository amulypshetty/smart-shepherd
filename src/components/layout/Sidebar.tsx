'use client';

import React from 'react';
import {
  Home,
  Map,
  Camera,
  Bell,
  Clock,
  MapPin,
  Sun,
  X,
  Radio,
} from 'lucide-react';
import { NavigationTab } from '@/types/dashboard';
import { SheepLogo } from '@/components/icons/SheepIcon';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  unreadAlertCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isSimulatingGPS?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  unreadAlertCount,
  isOpenMobile = false,
  onCloseMobile,
  isSimulatingGPS = true,
}) => {
  const navItems = [
    {
      id: 'overview' as NavigationTab,
      label: 'Overview',
      icon: Home,
    },
    {
      id: 'map' as NavigationTab,
      label: 'Live Map',
      icon: Map,
    },
    {
      id: 'counting' as NavigationTab,
      label: 'AI Counting',
      icon: Camera,
    },
    {
      id: 'alerts' as NavigationTab,
      label: 'Alerts',
      icon: Bell,
      badge: unreadAlertCount > 0 ? unreadAlertCount : undefined,
    },
    {
      id: 'history' as NavigationTab,
      label: 'History',
      icon: Clock,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between w-64 bg-[#141C31] text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Branding */}
        <div>
          <div className="flex items-center justify-between px-6 pt-6 pb-6">
            <div className="flex items-center gap-3">
              <SheepLogo className="w-10 h-10 shadow-lg" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  SmartShepherd
                </h1>
                <p className="text-[11px] font-medium tracking-wide text-slate-400">
                  Track · Count · Protect
                </p>
              </div>
            </div>

            {/* Close button for mobile */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="px-3.5 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#2E66E5] text-white shadow-md shadow-blue-900/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        isActive
                          ? 'bg-rose-500 text-white'
                          : 'bg-[#E13B3B] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Telemetry, Location & Weather */}
        <div className="px-6 py-6 border-t border-slate-700/50 space-y-4">
          {/* Live GPS Telemetry Pulse indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-700/40">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulatingGPS ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulatingGPS ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="font-medium text-slate-300">
                {isSimulatingGPS ? 'GPS Live (Simulated)' : 'GPS Paused'}
              </span>
            </div>
            <Radio className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Location */}
          <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Mandya, Karnataka</span>
          </div>

          {/* Weather */}
          <div className="flex items-center gap-3 text-slate-200">
            <Sun className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white tracking-tight">28°C</div>
              <div className="text-xs text-slate-400 font-medium">Mostly Sunny</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
