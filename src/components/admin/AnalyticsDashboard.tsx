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
  const [period, setPeriod] = useState<string>("30days");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [rowLimit, setRowLimit] = useState<number>(5);
  const [hideAdminPaths, setHideAdminPaths] = useState<boolean>(true);

  // Sync hideAdminPaths from localStorage
  useEffect(() => {
    let active = true;
    const saved = localStorage.getItem("admin_hide_admin_paths");
    if (saved !== null) {
      Promise.resolve().then(() => {
        if (active) {
          setHideAdminPaths(saved === "true");
        }
      });
    }
    return () => {
      active = false;
    };
  }, []);

  const handleToggleHideAdmin = (val: boolean) => {
    setHideAdminPaths(val);
    localStorage.setItem("admin_hide_admin_paths", String(val));
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics?period=${period}`);
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
        const res = await fetch(`/api/analytics?period=${period}`);
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
  }, [refreshKey, period]);

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

  // Filter and limit logic for Top Pages
  const filteredPages = (data.topPages || []).filter((page) => {
    const path = page.path || "";
    // If hideAdminPaths is true, exclude paths starting with /admin
    if (hideAdminPaths && path.startsWith("/admin")) {
      return false;
    }
    return path.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const displayedPages = filteredPages.slice(0, rowLimit);

  return (
    <div className="space-y-8 animate-fade-in my-8">
      {/* Section Divider & Title with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-b border-outline-variant/10 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-2xl">analytics</span>
          </div>
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              Google Analytics 4
            </h2>
            <p className="font-body text-xs text-on-surface-variant/80">
              Real-time performance metrics for your web profile
            </p>
          </div>
        </div>

        {/* Period Selector Dropdown */}
        <div className="flex items-center gap-3">
          <span className="font-label text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider hidden sm:inline">
            Periode:
          </span>
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
            }}
            className="px-4 py-2.5 rounded-2xl bg-surface-container-high border border-outline-variant/10 text-on-surface font-label text-xs font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm cursor-pointer"
          >
            <option value="today">Hari Ini (Today)</option>
            <option value="yesterday">Kemarin (Yesterday)</option>
            <option value="week">Minggu Ini (This Week)</option>
            <option value="month">Bulan Ini (This Month)</option>
            <option value="7days">7 Hari Terakhir</option>
            <option value="30days">30 Hari Terakhir</option>
            <option value="90days">90 Hari Terakhir</option>
            <option value="year">Tahun Ini (This Year)</option>
          </select>
        </div>
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
        {/* Pages Visited Table with Search & Limit */}
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm xl:col-span-2 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="font-headline text-lg font-bold text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  description
                </span>
                Visited Pages
              </h3>
              
              {/* Search and Limit Controls */}
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                {/* Toggle /admin Visibility */}
                <button
                  type="button"
                  onClick={() => handleToggleHideAdmin(!hideAdminPaths)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-outline-variant/10 text-xs font-label font-bold transition-all focus:outline-none cursor-pointer ${
                    hideAdminPaths 
                      ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' 
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                  title={hideAdminPaths ? "Tampilkan halaman admin" : "Sembunyikan halaman admin"}
                >
                  <span className="material-symbols-outlined text-sm">
                    {hideAdminPaths ? 'visibility_off' : 'visibility'}
                  </span>
                  <span>Sembunyikan /admin</span>
                </button>

                <div className="relative w-full sm:w-48">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-base">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Cari URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-container-high border border-outline-variant/10 text-xs font-body text-on-surface focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder-on-surface-variant/40"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface flex items-center"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>

                <select
                  value={rowLimit}
                  onChange={(e) => setRowLimit(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/10 text-on-surface font-label text-xs font-bold focus:outline-none focus:border-primary/50 transition-all cursor-pointer shadow-sm"
                >
                  <option value="5">Tampilkan 5</option>
                  <option value="10">Tampilkan 10</option>
                  <option value="25">Tampilkan 25</option>
                  <option value="100">Semua ({filteredPages.length})</option>
                </select>
              </div>
            </div>

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
                  {displayedPages.length > 0 ? (
                    displayedPages.map((page, idx) => (
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
                        {searchQuery ? "Tidak ada halaman yang cocok" : "Belum ada data kunjungan halaman"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Info */}
          {filteredPages.length > 0 && (
            <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-center text-xs text-on-surface-variant/60 font-body">
              <span>
                Menampilkan {displayedPages.length} dari {filteredPages.length} halaman
              </span>
              {searchQuery && (
                <span>
                  Difilter dari {data.topPages?.length || 0} total path
                </span>
              )}
            </div>
          )}
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
