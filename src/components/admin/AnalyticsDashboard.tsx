"use client";

import React, { useState, useEffect } from "react";

interface AnalyticsData {
  pageViews: number;
  activeUsers: number;
  topPages: Array<{ path: string; pageViews: number }>;
  trafficSources: Array<{ source: string; sessions: number }>;
  deviceBreakdown: Array<{ category: string; activeUsers: number }>;
}

interface AnalyticsDashboardProps {
  refreshKey: number;
}

export default function AnalyticsDashboard({
  refreshKey,
}: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      if (!res.ok) {
        if (json.error === "analytics_not_configured") {
          setError("analytics_not_configured");
        } else {
          setError(json.message || "Gagal memuat data analytics.");
        }
      } else {
        setData(json);
      }
    } catch {
      setError("Gagal memuat data analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      // Defer state updates to next microtask tick to avoid set-state-in-effect lint error
      await Promise.resolve();
      if (!active) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (!active) return;

        if (!res.ok) {
          if (json.error === "analytics_not_configured") {
            setError("analytics_not_configured");
          } else {
            setError(json.message || "Gagal memuat data analytics.");
          }
        } else {
          setData(json);
        }
      } catch {
        if (active) {
          setError("Gagal memuat data analytics.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  // Format path to max 40 chars with ellipsis
  const formatPath = (path: string) => {
    const cleanPath = path ?? "/";
    if (cleanPath.length > 40) {
      return cleanPath.substring(0, 40) + "…";
    }
    return cleanPath;
  };

  // Format numbers to id-ID locale
  const formatNumber = (num: number | null | undefined) => {
    const val = num ?? 0;
    return new Intl.NumberFormat("id-ID").format(val);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error === "analytics_not_configured") {
    return (
      <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 text-center space-y-4 shadow-sm my-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
          <span className="material-symbols-outlined text-3xl font-bold">
            settings_suggest
          </span>
        </div>
        <h3 className="font-headline text-xl font-bold text-on-surface">
          Analytics Belum Dikonfigurasi
        </h3>
        <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
          Google Analytics 4 credentials tidak ditemukan di environment
          variables. Tambahkan{" "}
          <code className="bg-surface-container-high px-2 py-1 rounded text-primary text-xs font-mono">
            GA_PROPERTY_ID
          </code>{" "}
          dan{" "}
          <code className="bg-surface-container-high px-2 py-1 rounded text-primary text-xs font-mono">
            GA_SERVICE_ACCOUNT_CREDENTIALS
          </code>{" "}
          ke file{" "}
          <code className="bg-surface-container-high px-2 py-1 rounded text-xs font-mono">
            .env.local
          </code>{" "}
          Anda.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 text-center space-y-4 shadow-sm my-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
          <span className="material-symbols-outlined text-3xl font-bold">
            error
          </span>
        </div>
        <h3 className="font-headline text-xl font-bold text-on-surface">
          Gagal Memuat Data Analytics
        </h3>
        <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
          {error}
        </p>
        <button
          onClick={handleRetry}
          className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-white font-label text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">replay</span>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Calculate device breakdown percentages
  const deviceList = data.deviceBreakdown || [];
  const totalDeviceUsers = deviceList.reduce(
    (sum, item) => sum + (item.activeUsers ?? 0),
    0,
  );

  // Calculate traffic source sessions total
  const trafficList = data.trafficSources || [];
  const totalSessions = trafficList.reduce(
    (sum, item) => sum + (item.sessions ?? 0),
    0,
  );

  return (
    <div className="space-y-8 animate-fade-in my-8">
      {/* Section Divider & Title */}
      <div className="flex items-center gap-4 pt-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-2xl">analytics</span>
        </div>
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Google Analytics 4
          </h2>
          <p className="font-body text-xs text-on-surface-variant/80">
            Real-time performance metrics for the last 30 days
          </p>
        </div>
        <div className="h-px bg-outline-variant/20 flex-grow ml-4" />
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="relative bg-surface-container-low p-6 lg:p-8 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6 overflow-hidden shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-3xl">
              visibility
            </span>
          </div>
          <div>
            <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] mb-1 opacity-60">
              Page Views
            </p>
            <p className="text-on-surface font-headline text-3xl font-bold tracking-tight">
              {formatNumber(data.pageViews)}
            </p>
          </div>
        </div>

        <div className="relative bg-surface-container-low p-6 lg:p-8 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6 overflow-hidden shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-3xl">group</span>
          </div>
          <div>
            <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] mb-1 opacity-60">
              Unique Visitors (Active Users)
            </p>
            <p className="text-on-surface font-headline text-3xl font-bold tracking-tight">
              {formatNumber(data.activeUsers)}
            </p>
          </div>
        </div>
      </div>

      {/* Tables Breakdown Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Top 5 Pages Table */}
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm xl:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                description
              </span>
              Top 5 Visited Pages
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 text-on-surface-variant font-label text-xs uppercase tracking-wider pb-3">
                    <th className="pb-3 font-semibold">Page Path</th>
                    <th className="pb-3 text-right font-semibold">
                      Page Views
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {data.topPages && data.topPages.length > 0 ? (
                    data.topPages.map((page, idx) => (
                      <tr
                        key={idx}
                        className="group hover:bg-surface-container-high/30 transition-colors"
                      >
                        <td className="py-4 font-mono text-xs text-on-surface font-medium flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[10px] font-bold font-sans">
                            {idx + 1}
                          </span>
                          <span
                            className="truncate max-w-[280px] sm:max-w-[400px]"
                            title={page.path}
                          >
                            {formatPath(page.path)}
                          </span>
                        </td>
                        <td className="py-4 text-right font-headline font-bold text-sm text-on-surface">
                          {formatNumber(page.pageViews)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="py-8 text-center text-sm text-on-surface-variant font-body"
                      >
                        No pages visited yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Traffic Sources Breakdown */}
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">
                campaign
              </span>
              Traffic Sources
            </h3>
            <div className="space-y-4">
              {trafficList && trafficList.length > 0 ? (
                trafficList.map((item, idx) => {
                  const sessions = item.sessions ?? 0;
                  const pct =
                    totalSessions > 0 ? (sessions / totalSessions) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span
                          className="font-medium text-on-surface truncate max-w-[150px]"
                          title={item.source}
                        >
                          {item.source || "(direct) / (none)"}
                        </span>
                        <span className="font-bold text-on-surface-variant">
                          {formatNumber(sessions)} sessions
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-sm text-on-surface-variant py-8 font-body">
                  No traffic source data available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
        <h3 className="font-headline text-lg font-bold text-on-surface mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary">
            devices
          </span>
          Device Category Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {deviceList && deviceList.length > 0 ? (
            deviceList.map((item, idx) => {
              const users = item.activeUsers ?? 0;
              const pct =
                totalDeviceUsers > 0 ? (users / totalDeviceUsers) * 100 : 0;

              // Select proper device icon
              let icon = "devices";
              let color = "bg-blue-500/10 text-blue-500";
              const cat = (item.category || "").toLowerCase();
              if (cat === "desktop") {
                icon = "desktop_windows";
                color = "bg-primary/10 text-primary";
              } else if (cat === "mobile") {
                icon = "smartphone";
                color = "bg-emerald-500/10 text-emerald-500";
              } else if (cat === "tablet") {
                icon = "tablet_mac";
                color = "bg-amber-500/10 text-amber-500";
              }

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-surface-container-high/40 border border-outline-variant/5 flex items-center gap-4"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-headline text-sm font-bold text-on-surface capitalize">
                      {item.category || "unknown"}
                    </p>
                    <p className="font-body text-xs text-on-surface-variant">
                      {formatNumber(users)} visitors ({pct.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center text-sm text-on-surface-variant py-8 font-body">
              No device categories data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-8 animate-pulse my-8">
      {/* Title skeleton */}
      <div className="flex items-center gap-4 pt-4">
        <div className="w-10 h-10 rounded-xl bg-surface-container-high" />
        <div className="space-y-2">
          <div className="w-48 h-6 bg-surface-container-high rounded" />
          <div className="w-64 h-3 bg-surface-container-high rounded" />
        </div>
      </div>

      {/* Metrics cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="h-28 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 p-8 flex items-center gap-6">
          <div className="w-14 h-14 bg-surface-container-high rounded-2xl" />
          <div className="space-y-2">
            <div className="w-20 h-3 bg-surface-container-high rounded" />
            <div className="w-32 h-8 bg-surface-container-high rounded" />
          </div>
        </div>
        <div className="h-28 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 p-8 flex items-center gap-6">
          <div className="w-14 h-14 bg-surface-container-high rounded-2xl" />
          <div className="space-y-2">
            <div className="w-36 h-3 bg-surface-container-high rounded" />
            <div className="w-32 h-8 bg-surface-container-high rounded" />
          </div>
        </div>
      </div>

      {/* Tables skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 xl:col-span-2 h-80 flex flex-col justify-between">
          <div className="w-40 h-5 bg-surface-container-high rounded mb-6" />
          <div className="space-y-4 flex-grow">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="w-2/3 h-4 bg-surface-container-high rounded" />
                <div className="w-16 h-4 bg-surface-container-high rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 h-80 flex flex-col justify-between">
          <div className="w-36 h-5 bg-surface-container-high rounded mb-6" />
          <div className="space-y-5 flex-grow">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="w-24 h-3 bg-surface-container-high rounded" />
                  <div className="w-12 h-3 bg-surface-container-high rounded" />
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
