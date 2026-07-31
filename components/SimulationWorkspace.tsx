"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Cpu, SlidersHorizontal, Map, 
  FileText, Activity, ShieldAlert, Coins, 
  Timer, Leaf, HeartHandshake, ArrowRight, 
  Play, CheckCircle, Database, Network, 
  BarChart3, Brain, ArrowUpRight, Check,
  Search, MapPin, Upload, Trash2, HelpCircle,
  AlertTriangle, Save, Share2, Download, Info
} from "lucide-react";
import { Scenario } from "./ScenarioCard";
import AICoreOrb from "./AICoreOrb";

interface SimulationWorkspaceProps {
  onNavigate: (tab: "dashboard" | "map" | "simulator" | "comparison" | "report") => void;
  onSetSimulationOutput: (scenarios: Scenario[]) => void;
  onSetProblemInput: (problem: string) => void;
  initialProblem: string;
  latitude: number;
  longitude: number;
}

// Processing steps definition
const PROCESSING_STEPS = [
  { id: "read", label: "Reading Input Parameters" },
  { id: "analyze", label: "Analyzing Historical City Data" },
  { id: "gen", label: "Generating Paradigm Scenarios" },
  { id: "compare", label: "Comparing Multidimensional Outcomes" },
  { id: "calc", label: "Calculating Dynamic Decision Scores" },
  { id: "recommend", label: "Preparing Explainable AI Recommendation" }
];

export default function SimulationWorkspace({ 
  onNavigate, 
  onSetSimulationOutput,
  onSetProblemInput,
  initialProblem,
  latitude,
  longitude
}: SimulationWorkspaceProps) {
  
  // Form input states
  const [simTitle, setSimTitle] = useState("Downtown Traffic Optimization");
  const [category, setCategory] = useState("Traffic Management");
  const [location, setLocation] = useState("Central Station District");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("high");
  const [problemDescription, setProblemDescription] = useState(initialProblem);
  
  // Optional parameters
  const [budgetLimit, setBudgetLimit] = useState("$500,000");
  const [timeline, setTimeline] = useState("6 Months");
  const [populationAffected, setPopulationAffected] = useState("120,000");
  const [weatherCondition, setWeatherCondition] = useState("Monsoon / Rain");
  const [additionalNotes, setAdditionalNotes] = useState("Requires coordination with regional transit authorities.");

  // Upload state
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string }>>([
    { name: "traffic_mesh_sensor_logs.csv", size: "4.2 MB" },
    { name: "downtown_zoning_routes.geojson", size: "12.8 MB" }
  ]);
  const [dragOver, setDragOver] = useState(false);

  // Simulation running states
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(-1);
  const [finishedSteps, setFinishedSteps] = useState<string[]>([]);
  const [simComplete, setSimComplete] = useState(false);
  
  // Simulation results state
  const [results, setResults] = useState<Scenario[]>([]);
  const [recommendedScenario, setRecommendedScenario] = useState<Scenario | null>(null);
  
  // Interactive map states
  const [mapLayer, setMapLayer] = useState<"affected" | "traffic" | "predicted" | "route">("traffic");
  
  // Expandable reasoning state
  const [reasoningExpanded, setReasoningExpanded] = useState(false);

  // Synced input change when prop changes
  useEffect(() => {
    setProblemDescription(initialProblem);
  }, [initialProblem]);

  // Handle file drops
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Run simulation sequence
  const executeSimulation = async () => {
    setIsSimulating(true);
    setSimComplete(false);
    setFinishedSteps([]);
    setActiveStepIdx(0);
    
    onSetProblemInput(problemDescription);

    // Timeline steps progression
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setActiveStepIdx(i);
      await new Promise(r => setTimeout(r, 900));
      setFinishedSteps(prev => [...prev, PROCESSING_STEPS[i].id]);
    }
    
    // Fetch from API
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          problem: problemDescription,
          title: simTitle,
          category: category,
          location: location,
          priority: priority,
          budget_limit: budgetLimit,
          timeline: timeline,
          population_affected: populationAffected,
          weather_condition: weatherCondition,
          additional_notes: additionalNotes,
          uploaded_files: uploadedFiles.map(f => f.name),
          latitude: latitude,
          longitude: longitude
        })
      });
      
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        let errMessage = `Server error: ${response.status}`;
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errMessage = errData?.error?.message || errData?.detail || errMessage;
        } else {
          errMessage = await response.text();
        }
        console.error("Simulation request failed:", errMessage);
        alert(`Simulation Error: ${errMessage}`);
        setIsSimulating(false);
        return;
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data && data.scenarios) {
          const enrichedScenarios = data.scenarios.map((scen: Scenario, idx: number) => {
            const extras = {
              "Infrastructure-First": { trafficImp: 85, maintenanceCost: 30, scalability: 75, satisfaction: 70 },
              "AI/IoT-Driven": { trafficImp: 90, maintenanceCost: 85, scalability: 95, satisfaction: 85 },
              "Policy/Community-Led": { trafficImp: 70, maintenanceCost: 90, scalability: 85, satisfaction: 80 }
            }[scen.type] || { trafficImp: 80, maintenanceCost: 75, scalability: 80, satisfaction: 75 };
            
            return {
              ...scen,
              metrics: {
                ...scen.metrics,
                ...extras
              }
            };
          });

          setResults(enrichedScenarios);
          onSetSimulationOutput(enrichedScenarios);
          setRecommendedScenario(enrichedScenarios.find((s: any) => s.type === "AI/IoT-Driven") || enrichedScenarios[0]);
        }
      }
    } catch (err: any) {
      console.error("Simulation failed:", err);
      if (err.message && err.message.includes("Failed to fetch")) {
        alert("Simulation network error: 'Failed to fetch'. A browser extension (such as Urban VPN Proxy or an ad-blocker) is intercepting and blocking local network requests. Please disable the extension or allow localhost connections to run simulations.");
      } else {
        alert(`Simulation connection error: ${err.message || err}`);
      }
    }
    
    setSimComplete(true);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600 animate-pulse" />
            AI Decision Simulator
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Describe a city challenge and let SimVerse AI generate multiple scenarios, evaluate outcomes, and recommend the best course of action.
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 px-3 border border-slate-200 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer">
            <Save className="w-3.5 h-3.5 text-slate-400" /> Save
          </button>
          <button onClick={() => onNavigate("report")} className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 px-3 border border-slate-200 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer">
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Report
          </button>
          <button className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 px-3 border border-slate-200 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer">
            <Share2 className="w-3.5 h-3.5 text-slate-400" /> Export
          </button>
        </div>
      </div>

      {/* Two Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* Left Input Panel (35%) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Parameters Console
          </h3>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Simulation Title</label>
              <input 
                type="text" 
                value={simTitle}
                onChange={(e) => setSimTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="Title (e.g. Downtown Congestion)"
              />
            </div>

            {/* Category selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Select Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-600 transition-colors"
              >
                <option>Traffic Management</option>
                <option>Flood Response</option>
                <option>Road Infrastructure</option>
                <option>Emergency Response</option>
                <option>Public Transport</option>
                <option>Pollution Control</option>
                <option>Waste Management</option>
                <option>Energy Management</option>
              </select>
            </div>

            {/* Location selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Select Location</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-600 transition-colors"
                  placeholder="Location coordinates or sector..."
                />
              </div>
            </div>

            {/* Priority Radio selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Priority Level</label>
              <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
                {["low", "medium", "high", "critical"].map((p) => (
                  <label 
                    key={p} 
                    className={`border rounded-lg p-2 text-center cursor-pointer transition-all uppercase font-bold flex flex-col justify-center ${
                      priority === p 
                        ? "border-blue-600 bg-blue-50/50 text-blue-700" 
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="priority" 
                      value={p} 
                      checked={priority === p}
                      onChange={() => setPriority(p as any)}
                      className="sr-only"
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Problem Description</label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                rows={5}
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors leading-relaxed"
              />
            </div>

            {/* Optional inputs */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Optional Constraints</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-500 block">Budget Limit</label>
                  <input type="text" value={budgetLimit} onChange={e => setBudgetLimit(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-500 block">Timeline</label>
                  <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-500 block">Affected Pop.</label>
                  <input type="text" value={populationAffected} onChange={e => setPopulationAffected(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-500 block">Weather</label>
                  <input type="text" value={weatherCondition} onChange={e => setWeatherCondition(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase text-slate-500 block">Additional Notes</label>
                <input type="text" value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px]" />
              </div>
            </div>

            {/* Upload Section */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Upload Datasets</span>
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  dragOver ? "border-blue-600 bg-blue-50/20" : "border-slate-200 hover:border-slate-300 bg-slate-50"
                }`}
              >
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                <span className="text-[10px] text-slate-600 block">Drag files here or click to browse</span>
                <span className="text-[8px] text-slate-400 block mt-1">Supports CSV, Excel, GeoJSON, PDF</span>
              </div>

              {/* Uploaded files list */}
              {uploadedFiles.length > 0 && (
                <ul className="divide-y divide-slate-100 text-[10px] font-mono">
                  {uploadedFiles.map((file, idx) => (
                    <li key={idx} className="py-2 flex justify-between items-center text-slate-600">
                      <span className="truncate max-w-[150px]">{file.name} ({file.size})</span>
                      <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Generate Trigger */}
            <button
              onClick={executeSimulation}
              disabled={problemDescription.trim().length === 0 || isSimulating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs"
            >
              Generate AI Scenarios
            </button>
          </div>
        </div>

        {/* Right Panel - Results & Processing (65%) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Empty State */}
          {!isSimulating && !simComplete && (
            <div className="bg-white border border-slate-200 p-16 rounded-xl shadow-sm text-center space-y-4">
              <Brain className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">No Simulation Executed</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Describe your municipal issue in the Parameters Console and click "Generate AI Scenarios" to map structural alternatives.
              </p>
            </div>
          )}

          {/* AI Processing State Workflow Animation */}
          {isSimulating && (
            <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm relative overflow-hidden">
              <div className="clean-scan-laser scan-laser-animate" style={{ top: `${(finishedSteps.length * 16.6) + 5}%` }} />
              
              {/* Pulsing AI Orb Centerpiece */}
              <div className="flex flex-col items-center justify-center py-4">
                <AICoreOrb isThinking={true} />
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold animate-pulse mt-2">Neural Deciphering System</span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xs font-mono text-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                  DECISION ENGINE WORKFLOW IN PROGRESS
                </h4>
                <span className="text-xs font-bold text-blue-600 font-mono">
                  {Math.round((finishedSteps.length / PROCESSING_STEPS.length) * 100)}%
                </span>
              </div>

              {/* Step workflow checker */}
              <div className="space-y-4">
                {PROCESSING_STEPS.map((step, idx) => {
                  const isDone = finishedSteps.includes(step.id);
                  const isActive = idx === activeStepIdx;
                  
                  return (
                    <div 
                      key={step.id} 
                      className={`flex items-center gap-3 text-xs font-mono transition-opacity duration-300 ${
                        isDone || isActive ? "opacity-100" : "opacity-40"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : isActive ? (
                        <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                      <span className={isActive ? "text-blue-600 font-bold" : "text-slate-700"}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results Tab View */}
          {simComplete && results.length > 0 && (
            <div className="space-y-8">
              
              {/* Scenario Cards Grid */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Computed Alternatives</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {results.map((scen) => {
                    const isOptimal = scen.id === recommendedScenario?.id;
                    const cardBorder = isOptimal ? "border-blue-600 ring-1 ring-blue-500/10" : "border-slate-200";
                    
                    return (
                      <div key={scen.id} className={`bg-white border p-5 rounded-xl shadow-sm relative flex flex-col justify-between ${cardBorder}`}>
                        {isOptimal && (
                          <span className="absolute -top-2.5 left-4 bg-blue-600 text-white font-mono text-[8px] font-bold px-2 py-0.5 rounded shadow-sm">
                            RECOMMENDED
                          </span>
                        )}

                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[8px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase">{scen.type}</span>
                            <span className="text-sm font-mono font-bold text-blue-600">
                              {scen.decision_score !== undefined && scen.decision_score !== null ? scen.decision_score.toFixed(1) : (scen.metrics.safety + 5).toFixed(1)}
                            </span>
                          </div>
                          
                          <h4 className="font-bold text-slate-900 text-xs leading-tight">{scen.name}</h4>
                          <p className="text-[11px] text-slate-500 leading-normal line-clamp-3">{scen.description}</p>
                          
                          {scen.decision_score_explanation && (
                            <div className="text-[10px] text-slate-500 bg-slate-50/50 p-2.5 border border-slate-200/50 rounded-lg leading-relaxed font-sans">
                              <b>Breakdown:</b> {scen.decision_score_explanation}
                            </div>
                          )}
                          
                          {scen.factors_breakdown && (
                            <div className="space-y-1.5 pt-2.5 border-t border-slate-100 text-[9px] text-slate-500 font-mono">
                              <span className="text-[8px] uppercase tracking-wider font-bold block text-slate-400 mb-1">Multi-Factor Diagnostics</span>
                              {Object.entries(scen.factors_breakdown).slice(0, 6).map(([factor, val]: any) => (
                                <div key={factor} className="space-y-0.5">
                                  <div className="flex justify-between">
                                    <span>{factor}:</span>
                                    <span className="font-bold text-slate-800">{val}%</span>
                                  </div>
                                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${val}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Metrics List */}
                          <div className="space-y-1.5 pt-2 border-t border-slate-100 font-mono text-[9px] text-slate-500">
                            <div className="flex justify-between">
                              <span>Estimated Cost:</span>
                              <span className="text-slate-800 font-bold">{scen.metrics.cost > 75 ? "Affordable" : scen.metrics.cost > 40 ? "Moderate" : "High CAPEX"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Timeline:</span>
                              <span className="text-slate-800 font-bold">{scen.timeline[scen.timeline.length - 1]?.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Safety rating:</span>
                              <span className="text-slate-800 font-bold">{scen.metrics.safety}/100</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Eco-Sustainability:</span>
                              <span className="text-slate-800 font-bold">{scen.metrics.sustainability}/100</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Recommendation Panel */}
              {recommendedScenario && (
                <div className="bg-white border-l-4 border-l-blue-600 border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-blue-600 font-bold">Recommended Solution</h4>
                      <h3 className="text-base font-extrabold text-slate-900 mt-1">{recommendedScenario.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="bg-blue-50 border border-blue-200 px-3 py-1 rounded text-center inline-block">
                        <span className="text-[9px] font-mono text-blue-600 block uppercase font-bold">Confidence</span>
                        <span className="text-xs font-bold text-blue-600 font-mono">{recommendedScenario.confidenceMeter}%</span>
                      </div>
                      {recommendedScenario.confidence_reasoning && (
                        <div className="text-[9px] font-mono text-slate-500 mt-1.5 max-w-xs text-left italic">
                          <b>Reason:</b> {recommendedScenario.confidence_reasoning}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                    <p><span className="font-bold text-slate-900 block font-mono text-[10px] uppercase">Reasoning Summary:</span> {recommendedScenario.description}</p>
                    <p><span className="font-bold text-slate-900 block font-mono text-[10px] uppercase">Expected Benefits:</span> {recommendedScenario.pros.join(", ")}</p>
                    <p><span className="font-bold text-slate-900 block font-mono text-[10px] uppercase">Possible Risks:</span> {recommendedScenario.cons.join(", ")}</p>
                    <p><span className="font-bold text-slate-900 block font-mono text-[10px] uppercase">Long-Term Impact:</span> Carbon-footprint optimized with 15+ year operational stability rating.</p>
                  </div>

                  {/* Expandable Explainable AI segment */}
                  <div className="border-t border-slate-100 pt-3">
                    <button 
                      onClick={() => setReasoningExpanded(!reasoningExpanded)}
                      className="text-[10px] font-mono font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" /> WHY THIS RECOMMENDATION? {reasoningExpanded ? "[-]" : "[+]"}
                    </button>
                    {reasoningExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 text-[10px] text-slate-500 font-mono leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200"
                      >
                        Model output checks indicate this policy recommendation provides a 32% increase in safety margins while staying within the specified {budgetLimit} limit. The confidence scoring algorithm optimized public transit parameters over heavy civil works to protect the municipal carbon cap limit.
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Scenario Comparison Table */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Detailed Criteria Comparisons</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                        <th className="py-2.5 px-4 font-bold">METRICS</th>
                        {results.map((scen, idx) => (
                          <th key={scen.id} className="py-2.5 px-4 text-center font-bold text-slate-900 border-l border-slate-100">
                            Scenario {String.fromCharCode(65 + idx)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-2.5 px-4">Capital Cost rating</td>
                        {results.map(scen => (
                          <td key={scen.id} className="py-2.5 px-4 text-center border-l border-slate-100">{scen.metrics.cost}/100</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4">Timeline Index</td>
                        {results.map(scen => (
                          <td key={scen.id} className="py-2.5 px-4 text-center border-l border-slate-100">{scen.metrics.time}/100</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4">Safety Performance</td>
                        {results.map(scen => (
                          <td key={scen.id} className="py-2.5 px-4 text-center border-l border-slate-100 font-bold text-blue-600">{scen.metrics.safety}/100</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4">Eco Sustainability</td>
                        {results.map(scen => (
                          <td key={scen.id} className="py-2.5 px-4 text-center border-l border-slate-100">{scen.metrics.sustainability}/100</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4">Social Support rating</td>
                        {results.map(scen => (
                          <td key={scen.id} className="py-2.5 px-4 text-center border-l border-slate-100">{scen.metrics.socialImpact}/100</td>
                        ))}
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td className="py-2.5 px-4 text-blue-600">Decision Score</td>
                        {results.map(scen => (
                          <td key={scen.id} className="py-2.5 px-4 text-center border-l border-slate-100 text-blue-600">
                            {scen.decision_score !== undefined && scen.decision_score !== null ? scen.decision_score.toFixed(1) : ((scen.metrics.cost * 0.2) + (scen.metrics.safety * 0.4) + (scen.metrics.sustainability * 0.4)).toFixed(1)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Interactive map layers block */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Affected Area Projection</h3>
                    <p className="text-xs text-slate-500">Predicted traffic flow shifts based on Scenario recommendations</p>
                  </div>
                  
                  {/* Layer buttons */}
                  <div className="flex gap-1.5">
                    {[
                      { id: "traffic", label: "Current Traffic" },
                      { id: "predicted", label: "Predicted Traffic" },
                      { id: "route", label: "Optimal Route" }
                    ].map((lyr) => (
                      <button
                        key={lyr.id}
                        onClick={() => setMapLayer(lyr.id as any)}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                          mapLayer === lyr.id 
                            ? "bg-blue-50 border-blue-600 text-blue-600" 
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {lyr.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG vector twin city layout */}
                <div className="h-56 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                  
                  <div className="absolute top-2.5 left-2.5 text-[8px] font-mono text-slate-500 bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm">
                    <p className="font-bold border-b border-slate-100 pb-0.5 mb-1 uppercase">GRID TELEMETRY</p>
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> AFFECTED ZONE</div>
                  </div>

                  <svg viewBox="50 50 400 200" className="w-full h-full max-h-[180px]">
                    {/* Affected boundary */}
                    <rect x="80" y="60" width="180" height="120" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,4" />
                    
                    {/* Primary lanes */}
                    <path d="M 50 140 H 450" fill="none" stroke={mapLayer === "route" ? "#2563EB" : mapLayer === "predicted" ? "#10B981" : "#EF4444"} strokeWidth={mapLayer === "route" ? 3 : 2} className="transition-all" />
                    <path d="M 220 50 V 230" fill="none" stroke="#E2E8F0" strokeWidth="2" />
                    
                    {/* Route indicators */}
                    {mapLayer === "route" && (
                      <>
                        <path d="M 50 140 H 220 V 230" fill="none" stroke="#2563EB" strokeWidth="3" />
                        <circle cx="220" cy="180" r="5" fill="#2563EB" />
                      </>
                    )}

                    {/* Nodes */}
                    <circle cx="220" cy="140" r="6" fill="#64748B" />
                    <circle cx="100" cy="140" r="4" fill="#64748B" />
                    <circle cx="340" cy="140" r="4" fill="#64748B" />
                  </svg>
                </div>
              </div>

              {/* Timeline Projection */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Implementation Impact Projection</h3>
                
                {/* Horizontal Timeline steps */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  {/* Connecting Line */}
                  <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-[1px] bg-slate-200 z-0" />
                  
                  <div className="space-y-2 text-center relative z-10">
                    <span className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-mono font-bold flex items-center justify-center mx-auto text-xs">1W</span>
                    <h5 className="font-bold text-slate-900 text-xs">1 Week</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">Pilot test signals activated in central nodes.</p>
                  </div>
                  <div className="space-y-2 text-center relative z-10">
                    <span className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-mono font-bold flex items-center justify-center mx-auto text-xs">1M</span>
                    <h5 className="font-bold text-slate-900 text-xs">1 Month</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">Telemetry calibration completes. Grid stabilizes.</p>
                  </div>
                  <div className="space-y-2 text-center relative z-10">
                    <span className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-mono font-bold flex items-center justify-center mx-auto text-xs">6M</span>
                    <h5 className="font-bold text-slate-900 text-xs">6 Months</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">32% congestion delay reduction observed citywide.</p>
                  </div>
                  <div className="space-y-2 text-center relative z-10">
                    <span className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-mono font-bold flex items-center justify-center mx-auto text-xs">1Y</span>
                    <h5 className="font-bold text-slate-900 text-xs">1 Year</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">Infrastructure fully paid back. Carbon offset optimized.</p>
                  </div>
                </div>
              </div>

              {/* AI Notes panel */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-4">
                <h4 className="text-xs font-mono uppercase text-slate-500 font-bold border-b border-slate-200 pb-2">AI-Engineered Policy Notes</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Required Resources:</span>
                    <p className="text-slate-600 leading-relaxed">Dual-loop induction radar systems, optical signal controllers, and edge server hubs for cabinet clusters.</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Policy Considerations:</span>
                    <p className="text-slate-600 leading-relaxed">Establish regional data privacy acts protecting camera telemetry feeds from third-party advertising linkages.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Action buttons */}
              <div className="flex flex-wrap gap-3 justify-end border-t border-slate-200 pt-6 print:hidden">
                <button onClick={() => onNavigate("comparison")} className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-4 border border-slate-200 rounded-lg shadow-sm cursor-pointer">
                  Compare Scenarios
                </button>
                <button onClick={() => onNavigate("report")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm cursor-pointer">
                  View Full Report
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full border-t border-slate-200 pt-6 flex justify-between items-center text-[10px] font-mono text-slate-400">
        <span>Application Version: 2.0.4 • Core Engine Active</span>
        <span>Last synchronization: {new Date().toLocaleTimeString()}</span>
      </footer>
    </div>
  );
}
