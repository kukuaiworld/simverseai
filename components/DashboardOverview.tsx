"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Activity, Shield, Wind, Zap, Droplet, 
  AlertTriangle, CheckCircle, Clock, ArrowUpRight,
  Plus, FileText, Upload, Download, Eye, TrendingUp,
  Search, ArrowUpDown, ShieldCheck, MapPin, Grid, BarChart3, Cpu, SlidersHorizontal
} from "lucide-react";
import ThreeGlobe from "./ThreeGlobe";
import MiniSmartCity3D from "./MiniSmartCity3D";

interface DashboardOverviewProps {
  onNavigate: (tab: "dashboard" | "map" | "simulator" | "comparison" | "report") => void;
  onLoadChallenge: (challenge: string) => void;
}

// Mock simulations database
const INITIAL_SIMULATIONS = [
  { id: "sim-1", name: "Downtown Gridlock Optimization", dept: "Transit & Traffic", status: "Completed", confidence: 95.4, updated: "10 mins ago" },
  { id: "sim-2", name: "Industrial Zone Smog Mitigation", dept: "Environmental Health", status: "Completed", confidence: 92.1, updated: "1 hr ago" },
  { id: "sim-3", name: "Residential Sector 4 Grid Blackout", dept: "Energy Utilities", status: "In Progress", confidence: 88.0, updated: "Just now" },
  { id: "sim-4", name: "Water Pipeline Contamination Risk", dept: "Water Management", status: "Completed", confidence: 96.2, updated: "Yesterday" },
  { id: "sim-5", name: "Coastal Storm Surge Defense", dept: "Civil Engineering", status: "Failed", confidence: 74.5, updated: "2 days ago" }
];

export default function DashboardOverview({ onNavigate, onLoadChallenge }: DashboardOverviewProps) {
  // Layer selection state for the map
  const [activeLayer, setActiveLayer] = useState<"traffic" | "flood" | "construction" | "hospitals" | "emergency" | "aqi">("traffic");
  
  // Real database analytics states
  const [analytics, setAnalytics] = useState<any>({
    kpis: {
      activeSimulations: null,
      aiRecommendations: null,
      highPriorityAlerts: null,
      avgDecisionScore: null,
      avgSustainability: null
    },
    logs: [],
    charts: {
      trafficTrends: [],
      incidents: [],
      budgetAllocation: []
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch real backend analytics data on mount safely
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          let errMessage = `Error: ${response.status}`;
          if (contentType && contentType.includes("application/json")) {
            const errData = await response.json();
            errMessage = errData?.error?.message || errData?.detail || errMessage;
          } else {
            errMessage = await response.text();
          }
          console.error("Analytics fetch failed:", errMessage);
          setIsLoading(false);
          return;
        }
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data && data.kpis) {
            setAnalytics(data);
          }
        }
      } catch (err) {
        console.error("Failed to load backend analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);
  
  // Simulations list states
  const [simSearch, setSimSearch] = useState("");
  const [simSortField, setSimSortField] = useState<"title" | "confidence" | "timestamp">("timestamp");
  const [simSortOrder, setSimSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: "title" | "confidence" | "timestamp") => {
    if (simSortField === field) {
      setSimSortOrder(simSortOrder === "asc" ? "desc" : "asc");
    } else {
      setSimSortField(field);
      setSimSortOrder("desc");
    }
  };

  // Filtered and sorted simulations
  const processedSimulations = useMemo(() => {
    let result = [...analytics.logs];
    
    // Filter
    if (simSearch.trim()) {
      const searchLower = simSearch.toLowerCase();
      result = result.filter(sim => 
        (sim.title || "").toLowerCase().includes(searchLower) ||
        (sim.category || "").toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a: any, b: any) => {
      let valA = a[simSortField];
      let valB = b[simSortField];

      if (typeof valA === "string" && typeof valB === "string") {
        return simSortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return simSortOrder === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });

    return result;
  }, [analytics.logs, simSearch, simSortField, simSortOrder]);

  return (
    <div className="space-y-8 text-slate-800">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm relative overflow-hidden">
        {/* Glow ambient background highlight */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 z-10">
          {/* Animated 3D Cyber Globe */}
          <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-slate-950/80 hidden sm:block">
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_12px_rgba(6,182,212,0.3)] pointer-events-none z-10" />
            <div className="absolute top-0 left-0 w-[200%] h-full opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/b3/World-map-2004-cia-factbook-large-1.7mb-corrected-blank.png')] bg-repeat-x bg-cover animate-spin-earth filter invert brightness-125 hue-rotate-180" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Welcome back, Coordinator</h2>
            <p className="text-xs text-slate-500 mt-1">
              Monitor city operations, simulate future scenarios, and make data-driven decisions.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 z-10">
          <button
            onClick={() => onNavigate("simulator")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Simulation
          </button>
          <button
            onClick={() => onNavigate("report")}
            className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" /> Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Simulations */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-slate-300 hover:shadow transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Active Simulations</span>
            <Activity className="w-5 h-5 text-blue-600 group-hover:scale-105 transition-transform" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {analytics.kpis.activeSimulations !== null ? analytics.kpis.activeSimulations : "Live data currently unavailable"}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-green-600 font-mono font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> telemetry online
            </div>
          </div>
        </div>

        {/* KPI 2: AI Recommendations */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-slate-300 hover:shadow transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">AI Recommendations</span>
            <Cpu className="w-5 h-5 text-blue-600 group-hover:scale-105 transition-transform" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {analytics.kpis.aiRecommendations !== null ? analytics.kpis.aiRecommendations : "Live data currently unavailable"}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-green-600 font-mono font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> recommendations generated
            </div>
          </div>
        </div>

        {/* KPI 3: High Priority Alerts */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-slate-300 hover:shadow transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">High Priority Alerts</span>
            <AlertTriangle className="w-5 h-5 text-orange-600 group-hover:scale-105 transition-transform" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {analytics.kpis.highPriorityAlerts !== null ? analytics.kpis.highPriorityAlerts : "Live data currently unavailable"}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-red-600 font-mono font-semibold">
              Active anomalies
            </div>
          </div>
        </div>

        {/* KPI 4: Avg Decision Confidence */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-slate-300 hover:shadow transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Avg Decision Score</span>
            <ShieldCheck className="w-5 h-5 text-blue-600 group-hover:scale-105 transition-transform" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {analytics.kpis.avgDecisionScore !== null ? `${analytics.kpis.avgDecisionScore}%` : "Live data currently unavailable"}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-blue-600 font-mono font-semibold">
              Index rating score
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Section (70%) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Interactive 3D Geospatial Engine View */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">3D Orbital Globe Console</h3>
                  <p className="text-[11px] text-slate-500">Drag to rotate planetary grid, scroll to zoom satellite orbit</p>
                </div>
                <ThreeGlobe 
                  latitude={28.6139} 
                  longitude={77.2090} 
                  selectedLocationName="New Delhi Core"
                  onSelectLocation={(name) => onLoadChallenge(`Active operations simulation in ${name}`)}
                />
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">3D Smart City Miniature</h3>
                  <p className="text-[11px] text-slate-500">Isometric rendering of selected municipality grid</p>
                </div>
                <MiniSmartCity3D 
                  locationName="New Delhi Core"
                  weatherCondition="Satisfactory Atmosphere"
                  aqiLevel={42}
                  rainfall={0.0}
                />
              </div>
            </div>

            {/* City event timeline */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">Live Timeline Events</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-600">
                <div className="flex gap-2">
                  <span className="text-slate-400 font-semibold shrink-0">15:32</span>
                  <p className="line-clamp-1">Smog Advisory Warning Sector Beta active.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 font-semibold shrink-0">15:10</span>
                  <p className="line-clamp-1">Transit delay gridlock highway 4-A.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 font-semibold shrink-0">14:45</span>
                  <p className="line-clamp-1">Water pipeline valve repairs Gamma District.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Section (30%): AI Insights Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                AI Real-Time Insights
              </h3>
              <p className="text-xs text-slate-500 mb-4">Central operations summary analytics</p>
            </div>

            <div className="space-y-4">
              {/* Insight 1 */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50/30">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span className="text-red-700 font-bold uppercase">HIGH PRIORITY</span>
                    <span>94% cert</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1">
                    Heavy congestion detected in Central Business District.
                  </p>
                  <span className="text-[9px] text-slate-400 block font-mono mt-1">2 mins ago</span>
                </div>
              </div>

              {/* Insight 2 */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50/30">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span className="text-red-700 font-bold uppercase">HIGH PRIORITY</span>
                    <span>88% cert</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1">
                    Flood risk increasing in Residential Zone 4.
                  </p>
                  <span className="text-[9px] text-slate-400 block font-mono mt-1">15 mins ago</span>
                </div>
              </div>

              {/* Insight 3 */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-orange-100 bg-orange-50/30">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span className="text-orange-700 font-bold uppercase">MEDIUM PRIORITY</span>
                    <span>92% cert</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1">
                    Air quality index (AQI) declining in Industrial Area.
                  </p>
                  <span className="text-[9px] text-slate-400 block font-mono mt-1">32 mins ago</span>
                </div>
              </div>

              {/* Insight 4 */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/30">
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span className="text-slate-600 font-bold uppercase">LOW PRIORITY</span>
                    <span>98% cert</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1">
                    Public transport routes running normally.
                  </p>
                  <span className="text-[9px] text-slate-400 block font-mono mt-1">1 hr ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Comparison Cards Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          Scenario Pre-Evaluations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card A */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-2">SCENARIO A</span>
              <h4 className="font-bold text-slate-900 text-sm">Smart Traffic Signals</h4>
              
              <div className="mt-4 space-y-2 font-mono text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Decision Score</span>
                  <span className="text-blue-600 font-bold">84.2</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Est. Capital Cost</span>
                  <span>$250K</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Implementation</span>
                  <span>3 months</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Safety Rating</span>
                  <span>88/100</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Eco-Sustainability</span>
                  <span>90/100</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate("simulator")}
              className="w-full text-center mt-5 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Analyze Scenario
            </button>
          </div>

          {/* Card B */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-2">SCENARIO B</span>
              <h4 className="font-bold text-slate-900 text-sm">Road Expansion</h4>
              
              <div className="mt-4 space-y-2 font-mono text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Decision Score</span>
                  <span className="text-blue-600 font-bold">68.0</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Est. Capital Cost</span>
                  <span>$1.8M</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Implementation</span>
                  <span>18 months</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Safety Rating</span>
                  <span>82/100</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Eco-Sustainability</span>
                  <span>55/100</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate("simulator")}
              className="w-full text-center mt-5 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Analyze Scenario
            </button>
          </div>

          {/* Card C - Highlight Recommended */}
          <div className="bg-white border-2 border-blue-500 p-5 rounded-xl shadow-md flex flex-col justify-between relative hover:shadow-lg transition-all">
            <div className="absolute -top-3 right-6 bg-blue-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
              RECOMMENDED
            </div>
            
            <div>
              <span className="text-[9px] font-mono text-blue-600 font-bold uppercase tracking-widest block mb-2">SCENARIO C</span>
              <h4 className="font-bold text-slate-900 text-sm">Public Transport Optimization</h4>
              
              <div className="mt-4 space-y-2 font-mono text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Decision Score</span>
                  <span className="text-blue-600 font-bold">92.8</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Est. Capital Cost</span>
                  <span>$450K</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Implementation</span>
                  <span>6 months</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span>Safety Rating</span>
                  <span>92/100</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Eco-Sustainability</span>
                  <span>96/100</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate("simulator")}
              className="w-full text-center mt-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Analyze Scenario
            </button>
          </div>
        </div>
      </div>

      {/* Analytical Charts and Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Analytical Charts Group */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Analytical Telemetry Systems</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Chart 1: Traffic Trends Line Chart */}
            <div className="space-y-2 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Traffic Congestion Trends</span>
              <div className="h-32 w-full border border-slate-100 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
                {analytics.charts.trafficTrends && analytics.charts.trafficTrends.length > 0 ? (
                  <svg viewBox="0 0 200 80" className="w-full h-full">
                    <line x1="10" y1="70" x2="190" y2="70" stroke="#E2E8F0" />
                    <line x1="10" y1="10" x2="10" y2="70" stroke="#E2E8F0" />
                    <path d={`M 10 ${80 - (analytics.charts.trafficTrends[0] || 50)} Q 40 ${80 - (analytics.charts.trafficTrends[1] || 50)}, 70 ${80 - (analytics.charts.trafficTrends[2] || 50)} T 130 ${80 - (analytics.charts.trafficTrends[4] || 50)} T 190 ${80 - (analytics.charts.trafficTrends[6] || 50)}`} fill="none" stroke="#2563EB" strokeWidth="1.5" />
                    <circle cx="190" cy={80 - (analytics.charts.trafficTrends[6] || 50)} r="3" fill="#2563EB" />
                  </svg>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">Live data currently unavailable</span>
                )}
              </div>
              <span className="text-[9px] font-mono text-slate-400">Weekly congestion timeline comparison</span>
            </div>

            {/* Chart 2: Budget Allocation Pie Chart representation */}
            <div className="space-y-2 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Municipal Budget Allocation</span>
              <div className="h-32 w-full border border-slate-100 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
                {analytics.charts.budgetAllocation && analytics.charts.budgetAllocation.length > 0 ? (
                  <svg viewBox="0 0 100 100" className="w-full h-full max-h-[80px]">
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#2563EB" strokeWidth="15" strokeDasharray="188" strokeDashoffset={188 * (1 - (analytics.charts.budgetAllocation[0] || 40)/100)} />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#E2E8F0" strokeWidth="15" strokeDasharray="188" strokeDashoffset={188 * (1 - (analytics.charts.budgetAllocation[1] || 30)/100)} />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#64748B" strokeWidth="15" strokeDasharray="188" strokeDashoffset={188 * (1 - (analytics.charts.budgetAllocation[2] || 20)/100)} />
                  </svg>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">Live data currently unavailable</span>
                )}
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                {analytics.charts.budgetAllocation && analytics.charts.budgetAllocation.length > 0
                  ? `Transit (${analytics.charts.budgetAllocation[0]}%) • Energy (${analytics.charts.budgetAllocation[1]}%) • General (${analytics.charts.budgetAllocation[2]}%)`
                  : "Live data currently unavailable"}
              </span>
            </div>

            {/* Chart 3: Incident Distribution Bar Chart */}
            <div className="space-y-2 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Incident Distribution</span>
              <div className="h-32 w-full border border-slate-100 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
                {analytics.charts.incidents && analytics.charts.incidents.length > 0 ? (
                  <svg viewBox="0 0 200 80" className="w-full h-full">
                    <line x1="10" y1="70" x2="190" y2="70" stroke="#E2E8F0" />
                    <rect x="25" y={70 - (analytics.charts.incidents[0] || 30)} width="16" height={analytics.charts.incidents[0] || 30} fill="#2563EB" rx="1" />
                    <rect x="65" y={70 - (analytics.charts.incidents[1] || 20)} width="16" height={analytics.charts.incidents[1] || 20} fill="#2563EB" rx="1" />
                    <rect x="105" y={70 - (analytics.charts.incidents[2] || 15)} width="16" height={analytics.charts.incidents[2] || 15} fill="#2563EB" rx="1" />
                    <rect x="145" y={70 - (analytics.charts.incidents[3] || 10)} width="16" height={analytics.charts.incidents[3] || 10} fill="#64748B" rx="1" />
                  </svg>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">Live data currently unavailable</span>
                )}
              </div>
              <span className="text-[9px] font-mono text-slate-400">Traffic • Flood • Power • Transit</span>
            </div>

            {/* Chart 4: Sustainability Targets Progress Ring */}
            <div className="space-y-2 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Sustainability Targets</span>
              <div className="h-32 w-full border border-slate-100 rounded-lg p-2 bg-slate-50 flex items-center justify-center relative">
                {analytics.kpis.avgSustainability !== null ? (
                  <>
                    <svg viewBox="0 0 100 100" className="w-full h-full max-h-[80px]">
                      <circle cx="50" cy="50" r="35" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                      <circle cx="50" cy="50" r="35" fill="none" stroke="#2563EB" strokeWidth="6" strokeDasharray="220" strokeDashoffset={220 * (1 - analytics.kpis.avgSustainability / 100)} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                      <span className="text-sm font-bold text-slate-900 font-mono">{analytics.kpis.avgSustainability}%</span>
                      <span className="text-[8px] text-slate-400 font-mono font-bold uppercase">Optimal</span>
                    </div>
                  </>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">Live data currently unavailable</span>
                )}
              </div>
              <span className="text-[9px] font-mono text-slate-400">Carbon offset index alignment</span>
            </div>

          </div>
        </div>

        {/* Right 1 Col: Quick Actions Panel */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Quick Actions Panel</h3>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onNavigate("simulator")}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <span className="text-xs font-semibold text-slate-800">Start New Simulation</span>
              <Plus className="w-4 h-4 text-slate-400" />
            </button>
            <button
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <span className="text-xs font-semibold text-slate-800">Upload City Dataset</span>
              <Upload className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => onNavigate("report")}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <span className="text-xs font-semibold text-slate-800">Generate AI Report</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </button>
            <button
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <span className="text-xs font-semibold text-slate-800">Export Dashboard</span>
              <Download className="w-4 h-4 text-slate-400" />
            </button>
            <button
              className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <span className="text-xs font-semibold text-slate-800">View Analytics</span>
              <Eye className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Simulations Table */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Simulation Logs</h3>
          
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search simulations/departments..."
              value={simSearch}
              onChange={(e) => setSimSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-mono">
                <th className="py-2.5 px-4 font-bold uppercase cursor-pointer hover:text-slate-700" onClick={() => handleSort("title")}>
                  Simulation Name <ArrowUpDown className="w-3 h-3 inline ml-1" />
                </th>
                <th className="py-2.5 px-4 font-bold uppercase">Department</th>
                <th className="py-2.5 px-4 font-bold uppercase">Status</th>
                <th className="py-2.5 px-4 font-bold uppercase cursor-pointer hover:text-slate-700" onClick={() => handleSort("confidence")}>
                  Confidence <ArrowUpDown className="w-3 h-3 inline ml-1" />
                </th>
                <th className="py-2.5 px-4 font-bold uppercase cursor-pointer hover:text-slate-700" onClick={() => handleSort("timestamp")}>
                  Last Updated <ArrowUpDown className="w-3 h-3 inline ml-1" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {processedSimulations.map((sim) => (
                <tr key={sim.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-800">{sim.title}</td>
                  <td className="py-3 px-4">{sim.category}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      sim.status === "Completed" ? "bg-green-50 text-green-700 border border-green-200" :
                      sim.status === "In Progress" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      {sim.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{sim.confidence}%</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{sim.timestamp}</td>
                </tr>
              ))}
              {processedSimulations.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No simulations match your search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
