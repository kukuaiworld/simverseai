"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Activity, ShieldAlert, Cpu, 
  ArrowRight, Sparkles, LayoutDashboard, Map, 
  SlidersHorizontal, FileText, CheckCircle2, 
  Terminal, RotateCcw, AlertTriangle, ShieldCheck, HelpCircle,
  Bell, User, ChevronRight, X, LogOut, CheckCircle, Info
} from "lucide-react";

import dynamic from "next/dynamic";

const CityMap = dynamic(() => import("../components/CityMap"), { ssr: false });
const DashboardOverview = dynamic(() => import("../components/DashboardOverview"), { ssr: false });
const ComparisonView = dynamic(() => import("../components/ComparisonView"), { ssr: false });
const ReportView = dynamic(() => import("../components/ReportView"), { ssr: false });
import { Scenario } from "../components/ScenarioCard";
import LandingPage from "../components/LandingPage";
const SimulationWorkspace = dynamic(() => import("../components/SimulationWorkspace"), { ssr: false });
import BootSequence from "../components/BootSequence";

// Standard preset problems list
const PRESETS = [
  "Severe traffic congestion in Downtown Core causing ambulance delays and emergency failures.",
  "Industrial zone smog levels exceeding safety limits, leading to high hospitalization rates.",
  "Water infrastructure pipe burst in Residential District threatening contamination and dry taps.",
  "Frequency instability in Solar Array grid connection causing minor brownouts in nearby blocks.",
  "Port logistics corridor blockages leading to delayed shipping containers and heavy diesel emission build-up."
];

// Holographic terminal logs during simulation scanning
const LOG_MESSAGES = [
  "Initializing SimVerse Digital Twin Engine...",
  "Loading municipal spatial grids & vector maps...",
  "Establishing live IoT sensor socket connections...",
  "Downloading current air quality (AQI) telemetry...",
  "Simulating transit density patterns in target nodes...",
  "Evaluating residential power grid load thresholds...",
  "Feeding challenge parameters to AI Decision Core...",
  "Calculating capital expenditures (CAPEX) & ROI metrics...",
  "Evaluating public safety coefficients & emergency paths...",
  "Running community behavioral compliance simulator...",
  "Packaging comparative solution scenarios..."
];

const DEMO_SCENARIOS: Scenario[] = [
  {
    id: "scen-a",
    name: "Adaptive Smart Traffic Signals",
    type: "AI/IoT-Driven",
    description: "Deploys edge-computed loop signal nodes and optical cameras to adjust cycle intervals dynamically based on live traffic flows.",
    metrics: { cost: 85, safety: 88, time: 90, sustainability: 90, socialImpact: 85 },
    confidenceMeter: 94,
    pros: ["Low initial capital cost", "Fast deployment timeframe", "Highly adaptive to real-time anomalies"],
    cons: ["Dependent on camera hardware uptime", "Requires cybersecurity network defenses"],
    timeline: [], policyChanges: [], riskMitigation: []
  },
  {
    id: "scen-b",
    name: "Road Expansion & Expressway Construction",
    type: "Infrastructure-First",
    description: "Constructs elevated highways and additional lanes along major downtown intersections to physically increase vehicle throughput.",
    metrics: { cost: 40, safety: 82, time: 50, sustainability: 55, socialImpact: 70 },
    confidenceMeter: 86,
    pros: ["Increases raw vehicle volume capacity", "High long-term durability"],
    cons: ["Extremely high capital cost", "Induces demand, increasing long-term emissions"],
    timeline: [], policyChanges: [], riskMitigation: []
  },
  {
    id: "scen-c",
    name: "Public Transport Optimization",
    type: "Policy/Community-Led",
    description: "Creates dedicated bus rapid transit lanes, introduces eco-shuttles, and applies automated congestion toll zones.",
    metrics: { cost: 75, safety: 92, time: 80, sustainability: 96, socialImpact: 88 },
    confidenceMeter: 92,
    pros: ["Maximizes carbon offset efficiency", "High citizen approval rates", "Sustained long-term grid reduction"],
    cons: ["Requires high policy compliance enforcement", "May delay personal vehicles slightly"],
    timeline: [], policyChanges: [], riskMitigation: []
  }
];

export default function SimVerseAIWorkspace() {
  const [isBooting, setIsBooting] = useState(true);
  const [isLanding, setIsLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "map" | "simulator" | "comparison" | "report">("dashboard");
  const [problemInput, setProblemInput] = useState(PRESETS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationOutput, setSimulationOutput] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  
  // Real location coordinates states
  const [latitude, setLatitude] = useState(28.6139); // New Delhi default
  const [longitude, setLongitude] = useState(77.2090);

  // Dynamic Browser Geolocation
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.log("Geolocation permission denied, using Delhi fallback:", error);
        }
      );
    }
  }, []);

  // Custom Polish & Demo states
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(-1); // -1: not active

  // Loading simulation state variables
  const [simProgress, setSimProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState("");
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Simulation loader effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      setSimProgress(0);
      setSimLogs([]);
      let logIndex = 0;
      
      interval = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          // Trigger logs at specific steps
          const step = Math.floor(prev / 10);
          if (step > logIndex && logIndex < LOG_MESSAGES.length) {
            const nextLog = `[${new Date().toLocaleTimeString()}] ${LOG_MESSAGES[logIndex]}`;
            setCurrentLog(nextLog);
            setSimLogs((prevLogs) => [...prevLogs, nextLog]);
            logIndex++;
          }
          
          return prev + 2;
        });
      }, 70);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Handle Demo Mode switch
  const handleToggleDemoMode = (val: boolean) => {
    setIsDemoMode(val);
    if (val) {
      setSimulationOutput(DEMO_SCENARIOS);
      setSelectedScenario(DEMO_SCENARIOS[2]); // Recommended is Scenario C
      setProblemInput(PRESETS[0]);
    } else {
      setSimulationOutput([]);
      setSelectedScenario(null);
    }
  };

  // Walkthrough navigation
  const handleTourNext = () => {
    const nextStep = walkthroughStep + 1;
    if (nextStep > 6) {
      setWalkthroughStep(-1);
    } else {
      setWalkthroughStep(nextStep);
      const tabs: Array<typeof activeTab> = ["dashboard", "dashboard", "map", "simulator", "comparison", "report"];
      setActiveTab(tabs[nextStep - 1]);
    }
  };

  const handleTourBack = () => {
    const prevStep = walkthroughStep - 1;
    if (prevStep >= 1) {
      setWalkthroughStep(prevStep);
      const tabs: Array<typeof activeTab> = ["dashboard", "dashboard", "map", "simulator", "comparison", "report"];
      setActiveTab(tabs[prevStep - 1]);
    }
  };

  // Execute simulation API
  const runSimulation = async () => {
    setIsSimulating(true);
    
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: problemInput })
      });
      const data = await response.json();
      
      if (response.ok && data.scenarios) {
        // Complete progress bar smoothly before rendering
        setTimeout(() => {
          setSimulationOutput(data.scenarios);
          setIsSimulating(false);
          setActiveTab("comparison");
        }, 1200);
      } else {
        console.error("Simulation response error:", data);
        setIsSimulating(false);
      }
    } catch (error: any) {
      console.error("Failed to run simulation API:", error);
      if (error.message && error.message.includes("Failed to fetch")) {
        alert("Simulation network error: 'Failed to fetch'. A browser extension (such as Urban VPN Proxy or an ad-blocker) is intercepting and blocking local network requests. Please disable the extension or allow localhost connections to run simulations.");
      }
      setIsSimulating(false);
    }
  };

  // Helper to load map presets directly
  const handleLoadChallenge = (challenge: string) => {
    setProblemInput(challenge);
    setActiveTab("simulator");
  };

  // Helper to select scenario and open report view
  const handleSelectReport = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setActiveTab("report");
  };

  // If system is booting
  if (isBooting) {
    return (
      <BootSequence onComplete={() => setIsBooting(false)} />
    );
  }

  // If showing landing page
  if (isLanding) {
    return (
      <LandingPage
        onEnterDashboard={(targetTab) => {
          setIsLanding(false);
          if (targetTab) {
            setActiveTab(targetTab);
          }
          // Launch tour automatically
          setWalkthroughStep(1);
        }}
      />
    );
  }

  // Workspace Main Application
  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-slate-50 selection:bg-blue-100">
      
      {/* Main Container */}
      <div className="flex-1 flex flex-col z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-6">
        
        {/* Workspace Top Navigation Bar */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white border border-slate-200 p-4 rounded-xl mb-6 print:hidden shadow-sm relative">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                SimVerse <span className="text-blue-600 font-extrabold">AI</span>
                <span className="text-[9px] uppercase font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">SENTINEL</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-widest">Decision Command Center</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold font-mono tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === "dashboard" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> DASHBOARD
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold font-mono tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === "map" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Map className="w-3.5 h-3.5" /> CITY MAP
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold font-mono tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === "simulator" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> DECISION ENGINE
            </button>
            <button
              disabled={simulationOutput.length === 0}
              onClick={() => setActiveTab("comparison")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold font-mono tracking-wider transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                activeTab === "comparison" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> SOLUTIONS MATRIX
            </button>
            <button
              disabled={!selectedScenario}
              onClick={() => setActiveTab("report")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold font-mono tracking-wider transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                activeTab === "report" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> ACTION REPORT
            </button>
          </nav>

          {/* Right Header Panel (Demo Mode, Notification bell, Avatar dropdown) */}
          <div className="flex items-center gap-3">
            {/* Demo mode pill toggle */}
            <button 
              onClick={() => handleToggleDemoMode(!isDemoMode)}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer ${
                isDemoMode 
                  ? "bg-blue-50 border-blue-600 text-blue-600" 
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              DEMO MODE: {isDemoMode ? "ON" : "OFF"}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer relative"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
              </button>
              
              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-4 z-50 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Operational Alerts Feed</h4>
                  <div className="space-y-2.5">
                    <div className="flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                      <p className="text-slate-600 leading-normal"><span className="font-bold">Grid Alert:</span> Power Grid load reached 92% near industrial arrays.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      <p className="text-slate-600 leading-normal"><span className="font-bold">System Status:</span> AI Scenario Optimization report successfully generated.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar menu */}
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200"
              >
                <User className="w-4 h-4 text-slate-600" />
              </button>

              {/* Avatar menu dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs font-mono">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="font-bold text-slate-800 text-[11px] truncate">Admin Operator</p>
                    <p className="text-[9px] text-slate-400">admin@simverse.gov</p>
                  </div>
                  <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg cursor-pointer flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Help Docs
                  </button>
                  <button 
                    onClick={() => {
                      setIsLanding(true);
                      setProfileOpen(false);
                      setWalkthroughStep(-1);
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Tab Workspace Container */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            
            {/* 1. Dashboard Tab */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardOverview onNavigate={setActiveTab} onLoadChallenge={handleLoadChallenge} />
              </motion.div>
            )}

            {/* 2. City Map Tab */}
            {activeTab === "map" && (
              <motion.div
                key="map"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <CityMap 
                  onLoadChallenge={handleLoadChallenge} 
                  latitude={latitude}
                  longitude={longitude}
                  onSetCoordinates={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                />
              </motion.div>
            )}

            {/* 3. Simulator / Decision Engine Tab */}
            {activeTab === "simulator" && (
              <motion.div
                key="simulator"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <SimulationWorkspace
                  onNavigate={setActiveTab}
                  onSetSimulationOutput={setSimulationOutput}
                  onSetProblemInput={setProblemInput}
                  initialProblem={problemInput}
                  latitude={latitude}
                  longitude={longitude}
                />
              </motion.div>
            )}

            {/* 4. Scenario Comparison Tab */}
            {activeTab === "comparison" && (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {simulationOutput.length > 0 ? (
                  <ComparisonView
                    scenarios={simulationOutput}
                    onSelectReport={handleSelectReport}
                  />
                ) : (
                  <div className="text-center py-20 max-w-sm mx-auto space-y-4">
                    <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">No Simulation Loaded</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Please enter a city challenge in the Decision Engine to run simulations first.
                    </p>
                    <button
                      onClick={() => setActiveTab("simulator")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-6 rounded-lg shadow-sm cursor-pointer"
                    >
                      OPEN DECISION ENGINE
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* 5. Report View Tab */}
            {activeTab === "report" && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {selectedScenario ? (
                  <ReportView
                    scenario={selectedScenario}
                    problem={problemInput}
                    onBackToComparison={() => setActiveTab("comparison")}
                  />
                ) : (
                  <div className="text-center py-20 max-w-sm mx-auto space-y-4">
                    <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">No Report Generated</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Generate a report brief inside the Solutions Matrix cards.
                    </p>
                    <button
                      onClick={() => setActiveTab("comparison")}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-6 rounded-lg shadow-sm cursor-pointer"
                    >
                      OPEN SOLUTIONS MATRIX
                    </button>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Guided Walkthrough Banner */}
      {walkthroughStep >= 1 && (
        <div className="fixed bottom-6 right-6 w-80 bg-white border border-slate-200 p-5 rounded-xl shadow-lg z-50 space-y-3 print:hidden">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-[9px] font-mono text-blue-600 font-bold uppercase tracking-wider">
              Guided Tour • Step {walkthroughStep} of 6
            </span>
            <button 
              onClick={() => setWalkthroughStep(-1)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
              {walkthroughStep === 1 && "Welcome to Sentinel Room"}
              {walkthroughStep === 2 && "Operations Dashboard KPI"}
              {walkthroughStep === 3 && "Interactive City Twin Map"}
              {walkthroughStep === 4 && "AI Scenario Simulation"}
              {walkthroughStep === 5 && "Solutions Matrix Sandbox"}
              {walkthroughStep === 6 && "Briefing Action Report"}
            </h4>
            <p className="text-xs text-slate-500 leading-normal">
              {walkthroughStep === 1 && "Welcome to the SimVerse AI Smart City Decision Command Center. Let's take a quick 6-step guided walkthrough to explore operational tools."}
              {walkthroughStep === 2 && "This is your main dashboard workspace containing real-time telemetry charts, priority insights, simulations log feeds, and fast triggers."}
              {walkthroughStep === 3 && "The City Map provides live operational overlays (Traffic, Flooding, AQI) and tactical simulation event overrides (Heavy Rain storm, Road Closures)."}
              {walkthroughStep === 4 && "Inject custom city problems or choose preloaded presets to compile multi-paradigm simulation forecasts."}
              {walkthroughStep === 5 && "Examine side-by-side scenarios, slide weighting parameters, and stress-test options inside the What-if sandbox."}
              {walkthroughStep === 6 && "Audit compiled reports, check immediate action lists, and record executive approvals for Twin grid deployment."}
            </p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button 
              onClick={() => setWalkthroughStep(-1)}
              className="text-[10px] font-mono text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Skip Tour
            </button>
            <div className="flex gap-2">
              {walkthroughStep > 1 && (
                <button 
                  onClick={handleTourBack}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-mono px-2.5 py-1.5 rounded-lg cursor-pointer"
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleTourNext}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-mono px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
              >
                {walkthroughStep === 6 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Workspace bar */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 px-6 flex justify-between items-center text-[10px] font-mono text-slate-400 mt-12 print:hidden">
        <span>ENCRYPTED NODE LINK • VERIFIED CITIZEN SECURE</span>
        <div className="flex gap-4">
          <span className="text-blue-600 font-bold">API STATUS: ONLINE</span>
          <span>LATENCY: 42ms</span>
        </div>
      </footer>
    </div>
  );
}
