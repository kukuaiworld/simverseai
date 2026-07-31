"use client";

import React, { useState } from "react";
import { Scenario } from "./ScenarioCard";
import { 
  Printer, ArrowLeft, FileCheck, ShieldCheck, 
  Calendar, CheckSquare, BarChart3, AlertTriangle,
  Info, Sparkles, HelpCircle, Check, X, ShieldAlert,
  Zap, Droplet, UserCheck, Flame, Compass, ChevronDown, ChevronUp,
  Download, Share2, Save, Layers
} from "lucide-react";

interface ReportViewProps {
  scenario: Scenario;
  calculatedScore?: number;
  problem: string;
  onBackToComparison: () => void;
}

export default function ReportView({ scenario, calculatedScore, problem, onBackToComparison }: ReportViewProps) {
  // Expandable scenarios state
  const [expandedScenarios, setExpandedScenarios] = useState<string[]>([scenario.id]);
  // Expandable Explainable AI sections state
  const [expandedAISections, setExpandedAISections] = useState<string[]>(["factors"]);
  // Action checklist state
  const [checkedActions, setCheckedActions] = useState<string[]>(["act-1"]);

  const toggleScenario = (id: string) => {
    setExpandedScenarios(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAISection = (id: string) => {
    setExpandedAISections(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAction = (id: string) => {
    setCheckedActions(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Mock list of all generated scenarios for the report details
  const allScenarios: Scenario[] = [
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

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Print & Export Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <button
          onClick={onBackToComparison}
          className="flex items-center gap-2 text-xs font-bold font-mono text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO DECISION INTELLIGENCE
        </button>
        <div className="flex gap-2">
          <button className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-4 border border-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
            <Save className="w-4 h-4 text-slate-400" /> Save Report
          </button>
          <button className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-4 border border-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-slate-400" /> Share
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Corporate Executive Report Sheet */}
      <div className="bg-white p-8 md:p-12 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden print:p-0 print:border-none print:shadow-none print:text-sm text-slate-900 space-y-10">
        
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .print-hide {
              display: none !important;
            }
            table {
              page-break-inside: avoid;
            }
            h2, h3 {
              page-break-after: avoid;
            }
          }
        `}} />

        {/* Report Header Logo & Branding */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
              SimVerse AI Executive Decision Report
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-widest">
              Digital Twin Simulation Core • Policy Advisory
            </p>
          </div>
          <div className="text-right font-mono text-[10px] text-slate-500">
            <p>Report ID: SVR-{scenario.id.toUpperCase()}</p>
            <p>Timestamp: {new Date().toLocaleString()}</p>
            <p className="font-bold text-blue-600 mt-1">Classification: EXECUTIVE BRIEF</p>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl grid grid-cols-2 md:grid-cols-6 gap-6 items-center">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Simulation Run</span>
            <span className="text-xs font-bold text-slate-900 truncate block">Downtown Congestion</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Department</span>
            <span className="text-xs font-bold text-slate-900 block">Transit & Safety</span>
          </div>
          <div className="space-y-1 md:col-span-2">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Recommended Strategy</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
              {scenario.name}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Decision Score</span>
            <span className="text-lg font-extrabold text-blue-600 font-mono">{(calculatedScore || 92.8).toFixed(1)}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Certainty</span>
            <span className="text-lg font-extrabold text-emerald-600 font-mono">{scenario.confidenceMeter}% cert</span>
          </div>
        </div>

        {/* Problem Overview Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
            <Info className="w-4 h-4 text-blue-600" />
            1. Problem Context & Objectives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-slate-600">
            <div className="space-y-3">
              <p>
                <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Problem Statement:</span>
                "{problem}"
              </p>
              <p>
                <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Affected Area:</span>
                Downtown Core Metro Center Sector Alpha.
              </p>
            </div>
            <div className="space-y-3">
              <p>
                <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Population Impacted:</span>
                Approximately 120,000 citizens commuting through primary transit arteries daily.
              </p>
              <p>
                <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Simulation Objective:</span>
                Mitigate transit queue loops, improve emergency service corridors, and ensure sustainable emissions cap alignment.
              </p>
            </div>
          </div>
        </div>

        {/* AI Generated Scenarios (Expandable) */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
            <Layers className="w-4 h-4 text-blue-600" />
            2. AI Generated Strategic Alternatives
          </h2>
          
          <div className="space-y-3">
            {allScenarios.map((scen, idx) => {
              const isExpanded = expandedScenarios.includes(scen.id);
              const isRec = scen.id === scenario.id;
              
              return (
                <div key={scen.id} className={`border rounded-xl bg-white overflow-hidden transition-all ${
                  isRec ? "border-blue-500 shadow-sm" : "border-slate-200"
                }`}>
                  {/* Collapsible header */}
                  <div 
                    onClick={() => toggleScenario(scen.id)}
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isRec ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {scen.type}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">{scen.name}</h4>
                      {isRec && <span className="text-[8px] font-mono bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded">RECOMMENDED</span>}
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/20 text-xs text-slate-600 space-y-3 leading-relaxed">
                      <p>{scen.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                        <div>CAPEX Cost: <span className="font-bold text-slate-800">{scen.metrics.cost}/100</span></div>
                        <div>Safety rating: <span className="font-bold text-slate-800">{scen.metrics.safety}/100</span></div>
                        <div>Eco Sustainability: <span className="font-bold text-slate-800">{scen.metrics.sustainability}/100</span></div>
                        <div>AI Certainty: <span className="font-bold text-slate-800">{scen.confidenceMeter}%</span></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Decision Comparison table */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            3. Decision Comparison Matrix
          </h2>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="py-2.5 px-4 font-bold">METRIC INDICES</th>
                  {allScenarios.map((s, idx) => (
                    <th key={s.id} className="py-2.5 px-4 text-center font-bold text-slate-900 border-l border-slate-200">
                      Scenario {String.fromCharCode(65 + idx)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-4">CAPEX Cost rating</td>
                  {allScenarios.map(s => {
                    const isBest = s.metrics.cost === Math.max(...allScenarios.map(sc => sc.metrics.cost));
                    return <td key={s.id} className={`py-2.5 px-4 text-center border-l border-slate-200 ${isBest ? "bg-blue-50 text-blue-700 font-bold" : ""}`}>{s.metrics.cost}/100</td>;
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Timeline Index</td>
                  {allScenarios.map(s => {
                    const isBest = s.metrics.time === Math.max(...allScenarios.map(sc => sc.metrics.time));
                    return <td key={s.id} className={`py-2.5 px-4 text-center border-l border-slate-200 ${isBest ? "bg-blue-50 text-blue-700 font-bold" : ""}`}>{s.metrics.time}/100</td>;
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Public Safety</td>
                  {allScenarios.map(s => {
                    const isBest = s.metrics.safety === Math.max(...allScenarios.map(sc => sc.metrics.safety));
                    return <td key={s.id} className={`py-2.5 px-4 text-center border-l border-slate-200 ${isBest ? "bg-blue-50 text-blue-700 font-bold" : ""}`}>{s.metrics.safety}/100</td>;
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Sustainability</td>
                  {allScenarios.map(s => {
                    const isBest = s.metrics.sustainability === Math.max(...allScenarios.map(sc => sc.metrics.sustainability));
                    return <td key={s.id} className={`py-2.5 px-4 text-center border-l border-slate-200 ${isBest ? "bg-blue-50 text-blue-700 font-bold" : ""}`}>{s.metrics.sustainability}/100</td>;
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 px-4">Public Satisfaction</td>
                  {allScenarios.map(s => {
                    const isBest = s.metrics.socialImpact === Math.max(...allScenarios.map(sc => sc.metrics.socialImpact));
                    return <td key={s.id} className={`py-2.5 px-4 text-center border-l border-slate-200 ${isBest ? "bg-blue-50 text-blue-700 font-bold" : ""}`}>{s.metrics.socialImpact}/100</td>;
                  })}
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="py-2.5 px-4 text-blue-600">Decision score</td>
                  {allScenarios.map((s, idx) => {
                    const score = idx === 0 ? 84.2 : idx === 1 ? 68.0 : 92.8;
                    const isBest = score === 92.8;
                    return <td key={s.id} className={`py-2.5 px-4 text-center border-l border-slate-200 ${isBest ? "bg-blue-100 text-blue-700 font-extrabold" : ""}`}>{score.toFixed(1)}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendation board details */}
        <div className="bg-white border-l-4 border-l-blue-600 border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-mono text-blue-600 font-bold uppercase tracking-widest block">AI RECOMMENDATION DECREE</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">{scenario.name}</h3>
            </div>
            <div className="bg-blue-50 border border-blue-200 px-3 py-1 rounded text-center">
              <span className="text-[9px] font-mono text-blue-600 block uppercase font-bold">Confidence</span>
              <span className="text-xs font-bold text-blue-600 font-mono">{scenario.confidenceMeter}% cert</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
            <div className="space-y-3">
              <p>
                <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Why this solution was selected:</span>
                This model provides the optimal balance between carbon target constraints and capital expenditure limits. By prioritizing transit and policy optimization over raw concrete building, it secures a 22% reduction in city corridor traffic congestion.
              </p>
              <p>
                <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Expected Improvements:</span>
                Average emergency response times are projected to fall from 12.4 minutes to under 8 minutes along major core highways.
              </p>
            </div>
            <div className="space-y-3">
              <p>
                <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Possible Challenges & Mitigation:</span>
                Requires initial community signoff. Mitigation includes deploying transit incentives and carbon credit micro-discounts.
              </p>
              <p>
                <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Long-Term Benefits:</span>
                Establishes a solid sensor framework allowing modular micro-grid expansion with near-zero additional infrastructure investments.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Analytics representation charts */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            4. Analytical Scenario Visualizations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {/* Chart 1 */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Decision Score Comparison</span>
              <div className="h-28 flex items-end justify-center gap-4 pb-2 border-b border-slate-200">
                <div className="w-10 bg-blue-600 rounded-t" style={{ height: "84%" }} />
                <div className="w-10 bg-slate-400 rounded-t" style={{ height: "68%" }} />
                <div className="w-10 bg-blue-600 rounded-t" style={{ height: "92%" }} />
              </div>
              <span className="text-[9px] font-mono text-slate-400">Signals (A) • Road (B) • Transit (C)</span>
            </div>

            {/* Chart 2 */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Budget Distribution</span>
              <div className="h-28 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16 transform -rotate-90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#2563EB" strokeWidth="12" strokeDasharray="220" strokeDashoffset="75" />
                </svg>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Transit Priority allocation targets</span>
            </div>

            {/* Chart 3 */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Sustainability Rating</span>
              <div className="h-28 flex items-center justify-center relative">
                <span className="text-xl font-bold text-slate-900 font-mono">96/100</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Carbon offset target compliance index</span>
            </div>
          </div>
        </div>

        {/* Timeline & Roadmap */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            5. Project Implementation Roadmap
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs font-mono text-center">
            {[
              { stage: "Planning", dur: "1-2 Weeks", dept: "Municipal Admin", status: "Completed" },
              { stage: "Approval", dur: "1 Week", dept: "City Commission", status: "In Progress" },
              { stage: "Execution", dur: "4 Months", dept: "Civil Contractors", status: "Pending" },
              { stage: "Monitoring", dur: "Ongoing", dept: "Operations Command", status: "Pending" },
              { stage: "Optimization", dur: "Ongoing", dept: "AI core systems", status: "Pending" }
            ].map((stg, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-bold uppercase ${
                  stg.status === "Completed" ? "bg-green-50 text-green-700 border border-green-200" :
                  stg.status === "In Progress" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                  "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>
                  {stg.status}
                </span>
                <h5 className="font-bold text-slate-950 text-xs">{stg.stage}</h5>
                <p className="text-[10px] text-slate-500">{stg.dur}</p>
                <p className="text-[9px] text-slate-400">{stg.dept}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment Table */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            6. Risk Matrix & Mitigation Strategy
          </h2>
          <div className="overflow-hidden border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="py-2.5 px-4 font-bold uppercase">RISK CATEGORIES</th>
                  <th className="py-2.5 px-4 font-bold uppercase">LEVEL</th>
                  <th className="py-2.5 px-4 font-bold uppercase">LIKELIHOOD</th>
                  <th className="py-2.5 px-4 font-bold uppercase border-l border-slate-150">MITIGATION STRATEGY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {[
                  { domain: "Financial Risk", lvl: "LOW", like: "Low", plan: "Phase payments and procure grants for sustainability tech integrations." },
                  { domain: "Operational Risk", lvl: "MEDIUM", like: "Medium", plan: "Deploy off-peak construction cycles near core lines." },
                  { domain: "Environmental Risk", lvl: "LOW", like: "Low", plan: "Monitor local storm basin metrics during wet cycles." },
                  { domain: "Political Risk", lvl: "LOW", like: "Low", plan: "Conduct citizen awareness forums outlining commuter timing benefits." },
                  { domain: "Public Acceptance", lvl: "LOW", like: "Low", plan: "Deploy mobile transit apps offering route timing improvements." },
                  { domain: "Technical Complexity", lvl: "HIGH", like: "Medium", plan: "Ensure edge computer server clusters run redundant backups." }
                ].map((risk, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{risk.domain}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        risk.lvl === "LOW" ? "bg-green-50 text-green-700" :
                        risk.lvl === "MEDIUM" ? "bg-orange-50 text-orange-700" :
                        "bg-red-50 text-red-700"
                      }`}>{risk.lvl}</span>
                    </td>
                    <td className="py-3 px-4">{risk.like}</td>
                    <td className="py-3 px-4 italic text-slate-500 border-l border-slate-200">{risk.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
            <Zap className="w-4 h-4 text-blue-600" />
            7. Projected Key Performance Indicators
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[8px] text-slate-400 block uppercase">Projected Congestion Reduction</span>
              <span className="text-sm font-bold text-green-600 mt-1 block">-22.4% Traffic</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[8px] text-slate-400 block uppercase">Expected Cost Savings</span>
              <span className="text-sm font-bold text-slate-800 mt-1 block">+$180K / Yr</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[8px] text-slate-400 block uppercase">Carbon emission reduction</span>
              <span className="text-sm font-bold text-green-600 mt-1 block">-35% Carbon</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[8px] text-slate-400 block uppercase">Citizen Satisfaction</span>
              <span className="text-sm font-bold text-slate-800 mt-1 block">92.4% rating</span>
            </div>
          </div>
        </div>

        {/* Explainable AI segment */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            8. How the AI Reached This Recommendation
          </h2>
          
          <div className="space-y-2">
            {[
              { id: "factors", title: "Primary factors analyzed in computation model", desc: "Assessed real-time camera feeds, spatial zone vector grids, regional carbon output cap files, and regional capital expenditure budget rules." },
              { id: "patterns", title: "Historical traffic and weather patterns considered", desc: "Analyzed five years of downtown monsoon commuting flows during gridlock events to isolate congestion thresholds." },
              { id: "quality", title: "Data quality assessment checks", desc: "Verified loop sensor packets at 99.8% precision index, backed by certified emergency route maps." },
              { id: "assumptions", title: "Key assumptions and limits of the recommendation", desc: "Assumes consistent regional transit policies and stable municipal data lines between cabinet clusters." }
            ].map((ai) => {
              const isExpanded = expandedAISections.includes(ai.id);
              return (
                <div key={ai.id} className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div 
                    onClick={() => toggleAISection(ai.id)}
                    className="p-3 flex justify-between items-center bg-slate-50 cursor-pointer"
                  >
                    <span className="font-bold text-slate-800 font-mono">{ai.title}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                  {isExpanded && (
                    <div className="p-3 text-slate-500 font-mono leading-relaxed bg-white border-t border-slate-100">
                      {ai.desc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stakeholder Impact */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            9. Strategic Stakeholder Impact Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-600">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase border-b border-slate-200 pb-1">City Administration</span>
              <p>Benefits: Simplifies data checks; reduces policy overhead. Concerns: Requires initial coordinator integration trials.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase border-b border-slate-200 pb-1">Commuters & Citizens</span>
              <p>Benefits: Shorter queue times; 15% faster emergency evacuations. Concerns: Brief adjustments to dedicated bus lanes.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase border-b border-slate-200 pb-1">Emergency Services</span>
              <p>Benefits: Guarantees green light corridor priority. Concerns: None identified.</p>
            </div>
          </div>
        </div>

        {/* Action Plan Checklist */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
            <CheckSquare className="w-4 h-4 text-blue-600" />
            10. Phased Tactical Action Plan
          </h2>
          
          <div className="space-y-2.5 text-xs">
            {[
              { id: "act-1", term: "Immediate Actions (Days 1-7)", text: "Confirm signal camera feed configurations and load calibration scripts." },
              { id: "act-2", term: "Short-Term Actions (Month 1)", text: "Conduct initial pilot test runs at main Junction A nodes." },
              { id: "act-3", term: "Medium-Term Actions (Months 2-6)", text: "Deploy full edge-server network and loop controllers." },
              { id: "act-4", term: "Long-Term Actions (Year 1)", text: "Assess emissions reductions against municipal cap parameters." }
            ].map((act) => {
              const isChecked = checkedActions.includes(act.id);
              return (
                <div 
                  key={act.id} 
                  onClick={() => toggleAction(act.id)}
                  className="flex gap-3 items-center p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 font-mono block text-[10px] uppercase">{act.term}</span>
                    <span className="text-slate-500">{act.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Signatures & Footer disclaimer */}
        <div className="border-t border-slate-200 pt-8 mt-12 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] font-mono text-slate-400 gap-4">
          <div>
            <p>Generated by SimVerse AI Dashboard Core</p>
            <p>Model Version: TwinNet-v4.2 • Core Engine Active</p>
          </div>
          <div className="text-right italic max-w-sm">
            <p>"This report is AI-assisted and intended to support human decision-making."</p>
          </div>
        </div>

      </div>
    </div>
  );
}
