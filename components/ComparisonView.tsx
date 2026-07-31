"use client";

import React, { useState, useMemo } from "react";
import { 
  Award, TrendingUp, DollarSign, Clock, Shield, 
  Leaf, Users, AlertTriangle, CheckCircle, BarChart3, 
  Info, Sparkles, HelpCircle, Activity, ChevronRight,
  TrendingDown, Check, X, ShieldAlert, Zap, Layers, RefreshCw
} from "lucide-react";
import { Scenario } from "./ScenarioCard";

interface ComparisonViewProps {
  scenarios: Scenario[];
  onSelectReport: (scenario: Scenario) => void;
}

export default function ComparisonView({ scenarios, onSelectReport }: ComparisonViewProps) {
  // What-if analysis state controls
  const [budgetShift, setBudgetShift] = useState(false);
  const [reduceTimeline, setReduceTimeline] = useState(false);
  const [heavyRainfall, setHeavyRainfall] = useState(false);
  const [festivalTraffic, setFestivalTraffic] = useState(false);
  const [roadClosure, setRoadClosure] = useState(false);
  const [emergencyEvent, setEmergencyEvent] = useState(false);

  // Expandable AI explanation
  const [showFullExplanation, setShowFullExplanation] = useState(false);

  // Approve decision state
  const [decisionApproved, setDecisionApproved] = useState(false);

  // Recalculate metrics dynamically based on the toggled what-if parameters
  const simulatedScenarios = useMemo(() => {
    // Fallback default scenarios if parent list is empty
    const baseScenarios = scenarios.length >= 3 ? scenarios : [
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
        name: "Road Expansion & Expressway",
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

    return baseScenarios.map((scen, idx) => {
      // Create deep copy of metrics
      const newMetrics = { ...scen.metrics } as any;
      let confidence = scen.confidenceMeter;

      // 1. Budget shift increases cost scores (makes them cheaper/more affordable relative to limit)
      if (budgetShift) {
        newMetrics.cost = Math.min(100, newMetrics.cost + 10);
      }

      // 2. Reduce timeline reduces time score (makes it tighter/harder to meet)
      if (reduceTimeline) {
        newMetrics.time = Math.max(20, newMetrics.time - 15);
        confidence = Math.max(50, confidence - 4);
      }

      // 3. Heavy Rainfall reduces safety scores and eco ratings
      if (heavyRainfall) {
        newMetrics.safety = Math.max(10, newMetrics.safety - 12);
        newMetrics.sustainability = Math.max(10, newMetrics.sustainability - 8);
      }

      // 4. Festival traffic impacts traffic metrics
      if (festivalTraffic) {
        newMetrics.socialImpact = Math.max(20, newMetrics.socialImpact - 10);
      }

      // 5. Road closures hit transit speed (time)
      if (roadClosure) {
        newMetrics.time = Math.max(10, newMetrics.time - 20);
      }

      // 6. Emergency events demand higher safety mitigation
      if (emergencyEvent) {
        newMetrics.safety = Math.max(10, newMetrics.safety - 5);
        confidence = Math.max(50, confidence - 5);
      }

      // Recalculate decision score based on weights
      const decisionScore = (newMetrics.cost * 0.25) + (newMetrics.safety * 0.35) + (newMetrics.sustainability * 0.25) + (newMetrics.socialImpact * 0.15);

      // Define extras for comparative table
      const trafficReduction = idx === 0 ? (heavyRainfall ? 65 : 82) : idx === 1 ? (festivalTraffic ? 40 : 60) : (roadClosure ? 75 : 88);
      const maintenanceCost = idx === 0 ? 85 : idx === 1 ? 45 : 75; // 1-100 (high is cheaper/better)
      const scalability = idx === 0 ? 90 : idx === 1 ? 65 : 95;

      return {
        ...scen,
        metrics: {
          ...newMetrics,
          trafficReduction,
          maintenanceCost,
          scalability
        },
        confidenceMeter: confidence,
        decisionScore
      };
    });
  }, [scenarios, budgetShift, reduceTimeline, heavyRainfall, festivalTraffic, roadClosure, emergencyEvent]);

  // Optimal scenario selection (Highest Decision Score)
  const optimalScenario = useMemo(() => {
    const sorted = [...simulatedScenarios].sort((a, b) => b.decisionScore - a.decisionScore);
    return sorted[0];
  }, [simulatedScenarios]);

  return (
    <div className="space-y-8 text-slate-800">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Scenario Comparison & Decision Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compare multiple AI-generated solutions across key performance indicators and identify the optimal strategy.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 px-3 border border-slate-200 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer">
            Export Comparison
          </button>
          <button className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 px-3 border border-slate-200 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer">
            Share Report
          </button>
          <button 
            onClick={() => setDecisionApproved(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            Save Decision
          </button>
        </div>
      </div>

      {/* Executive Summary panel */}
      <div className="bg-white border-l-4 border-l-blue-600 border border-slate-200 p-6 rounded-xl shadow-sm grid grid-cols-2 md:grid-cols-6 gap-6 items-center">
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-slate-400 uppercase block">Total Scenarios</span>
          <span className="text-xl font-bold text-slate-900">{simulatedScenarios.length} Models</span>
        </div>
        <div className="space-y-1 md:col-span-2">
          <span className="text-[9px] font-mono text-slate-400 uppercase block">Best Recommended Strategy</span>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
            {optimalScenario.name}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-slate-400 uppercase block">Overall Decision Score</span>
          <span className="text-xl font-extrabold text-blue-600 font-mono">{optimalScenario.decisionScore.toFixed(1)}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-slate-400 uppercase block">Confidence Index</span>
          <span className="text-xl font-extrabold text-emerald-600 font-mono">{optimalScenario.confidenceMeter}%</span>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-slate-400 uppercase block">Est. CAPEX Limit</span>
          <span className="text-sm font-bold text-slate-800">{budgetShift ? "$750,000" : "$500,000"}</span>
        </div>
      </div>

      {/* Toggling What-If interactive controls */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin-slow" />
            Interactive What-If Simulation Sandbox
          </h3>
          <p className="text-xs text-slate-500">Toggle operational stress-tests to observe real-time variance in decision ratings</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setBudgetShift(!budgetShift)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              budgetShift ? "bg-blue-50 border-blue-600 text-blue-600" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {budgetShift ? "✓" : "+"} Increase Budget (+$250K)
          </button>
          
          <button
            onClick={() => setReduceTimeline(!reduceTimeline)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              reduceTimeline ? "bg-blue-50 border-blue-600 text-blue-600" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {reduceTimeline ? "✓" : "+"} Reduce Timeline (Accelerate)
          </button>

          <button
            onClick={() => setHeavyRainfall(!heavyRainfall)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              heavyRainfall ? "bg-red-50 border-red-600 text-red-600" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {heavyRainfall ? "✕" : "+"} Heavy Rainfall (Flooding)
          </button>

          <button
            onClick={() => setFestivalTraffic(!festivalTraffic)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              festivalTraffic ? "bg-red-50 border-red-600 text-red-600" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {festivalTraffic ? "✕" : "+"} Festival Traffic Spillover
          </button>

          <button
            onClick={() => setRoadClosure(!roadClosure)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              roadClosure ? "bg-red-50 border-red-600 text-red-600" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {roadClosure ? "✕" : "+"} Arterial Road Closure
          </button>

          <button
            onClick={() => setEmergencyEvent(!emergencyEvent)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              emergencyEvent ? "bg-red-50 border-red-600 text-red-600" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {emergencyEvent ? "✕" : "+"} Emergency Evacuation Corridor
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {simulatedScenarios.map((scen, idx) => {
          const isOptimal = scen.id === optimalScenario.id;
          const cardBorder = isOptimal ? "border-2 border-blue-600 shadow-md scale-[1.01]" : "border-slate-200";
          
          return (
            <div key={scen.id} className={`bg-white border p-6 rounded-xl shadow-sm relative flex flex-col justify-between hover:border-slate-300 transition-all ${cardBorder}`}>
              {isOptimal && (
                <span className="absolute -top-3 left-6 bg-blue-600 text-white font-mono text-[9px] font-bold px-2.5 py-0.5 rounded shadow-sm">
                  AI RECOMMENDED
                </span>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase">{scen.type}</span>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-400 block">Decision Score</span>
                    <span className="text-lg font-bold text-slate-900 font-mono">{scen.decisionScore.toFixed(1)}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{scen.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{scen.description}</p>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 font-mono text-[10px] text-slate-500">
                  <div className="flex justify-between"><span>CAPEX Cost:</span><span className="font-bold text-slate-800">{scen.metrics.cost}/100</span></div>
                  <div className="flex justify-between"><span>Timeline:</span><span className="font-bold text-slate-800">{scen.metrics.time}/100</span></div>
                  <div className="flex justify-between"><span>Safety:</span><span className="font-bold text-slate-800">{scen.metrics.safety}/100</span></div>
                  <div className="flex justify-between"><span>Eco Impact:</span><span className="font-bold text-slate-800">{scen.metrics.sustainability}/100</span></div>
                  <div className="flex justify-between"><span>Social Index:</span><span className="font-bold text-slate-800">{scen.metrics.socialImpact}/100</span></div>
                  <div className="flex justify-between"><span>Risk level:</span><span className={`font-bold ${scen.metrics.safety > 85 ? "text-green-600" : "text-orange-600"}`}>{scen.metrics.safety > 85 ? "Low" : "Med"}</span></div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100">
                <button 
                  onClick={() => onSelectReport(scen as any)}
                  className={`w-full py-2.5 text-xs font-semibold font-mono tracking-wider text-center rounded-lg border transition-all cursor-pointer ${
                    isOptimal 
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Generate Strategic Brief
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Matrix comparison table */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Core Decision Comparison Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-3 px-4 font-bold text-left">CRITERIA</th>
                {simulatedScenarios.map((scen, idx) => (
                  <th key={scen.id} className="py-3 px-4 text-center font-bold text-slate-900 border-l border-slate-100">
                    Scenario {String.fromCharCode(65 + idx)}
                    <span className="block text-[9px] font-normal text-slate-400 uppercase mt-0.5">{scen.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* Cost */}
              <tr>
                <td className="py-3 px-4">Estimated CAPEX Cost rating</td>
                {simulatedScenarios.map((s, idx) => {
                  const isBest = s.metrics.cost === Math.max(...simulatedScenarios.map(sc => sc.metrics.cost));
                  return (
                    <td key={s.id} className={`py-3 px-4 text-center border-l border-slate-100 ${isBest ? "bg-blue-50/70 text-blue-700 font-semibold" : ""}`}>
                      {s.metrics.cost}/100
                    </td>
                  );
                })}
              </tr>

              {/* Timeline */}
              <tr>
                <td className="py-3 px-4">Implementation speed</td>
                {simulatedScenarios.map((s) => {
                  const isBest = s.metrics.time === Math.max(...simulatedScenarios.map(sc => sc.metrics.time));
                  return (
                    <td key={s.id} className={`py-3 px-4 text-center border-l border-slate-100 ${isBest ? "bg-blue-50/70 text-blue-700 font-semibold" : ""}`}>
                      {s.metrics.time}/100
                    </td>
                  );
                })}
              </tr>

              {/* Public Safety */}
              <tr>
                <td className="py-3 px-4">Public Safety Rating</td>
                {simulatedScenarios.map((s) => {
                  const isBest = s.metrics.safety === Math.max(...simulatedScenarios.map(sc => sc.metrics.safety));
                  return (
                    <td key={s.id} className={`py-3 px-4 text-center border-l border-slate-100 ${isBest ? "bg-blue-50/70 text-blue-700 font-semibold" : ""}`}>
                      {s.metrics.safety}/100
                    </td>
                  );
                })}
              </tr>

              {/* Environmental Impact */}
              <tr>
                <td className="py-3 px-4">Environmental Impact Index</td>
                {simulatedScenarios.map((s) => {
                  const isBest = s.metrics.sustainability === Math.max(...simulatedScenarios.map(sc => sc.metrics.sustainability));
                  return (
                    <td key={s.id} className={`py-3 px-4 text-center border-l border-slate-100 ${isBest ? "bg-blue-50/70 text-blue-700 font-semibold" : ""}`}>
                      {s.metrics.sustainability}/100
                    </td>
                  );
                })}
              </tr>

              {/* Traffic reduction */}
              <tr>
                <td className="py-3 px-4">Traffic Congestion Reduction</td>
                {simulatedScenarios.map((s) => {
                  const isBest = s.metrics.trafficReduction === Math.max(...simulatedScenarios.map(sc => sc.metrics.trafficReduction));
                  return (
                    <td key={s.id} className={`py-3 px-4 text-center border-l border-slate-100 ${isBest ? "bg-blue-50/70 text-blue-700 font-semibold" : ""}`}>
                      {s.metrics.trafficReduction}/100
                    </td>
                  );
                })}
              </tr>

              {/* Social Satisfaction */}
              <tr>
                <td className="py-3 px-4">Citizen Satisfaction Index</td>
                {simulatedScenarios.map((s) => {
                  const isBest = s.metrics.socialImpact === Math.max(...simulatedScenarios.map(sc => sc.metrics.socialImpact));
                  return (
                    <td key={s.id} className={`py-3 px-4 text-center border-l border-slate-100 ${isBest ? "bg-blue-50/70 text-blue-700 font-semibold" : ""}`}>
                      {s.metrics.socialImpact}/100
                    </td>
                  );
                })}
              </tr>

              {/* Scalability */}
              <tr>
                <td className="py-3 px-4">Long-Term Scalability</td>
                {simulatedScenarios.map((s) => {
                  const isBest = s.metrics.scalability === Math.max(...simulatedScenarios.map(sc => sc.metrics.scalability));
                  return (
                    <td key={s.id} className={`py-3 px-4 text-center border-l border-slate-100 ${isBest ? "bg-blue-50/70 text-blue-700 font-semibold" : ""}`}>
                      {s.metrics.scalability}/100
                    </td>
                  );
                })}
              </tr>

              {/* Maintenance cost */}
              <tr>
                <td className="py-3 px-4">Maintenance Cost Efficiency</td>
                {simulatedScenarios.map((s) => {
                  const isBest = s.metrics.maintenanceCost === Math.max(...simulatedScenarios.map(sc => sc.metrics.maintenanceCost));
                  return (
                    <td key={s.id} className={`py-3 px-4 text-center border-l border-slate-100 ${isBest ? "bg-blue-50/70 text-blue-700 font-semibold" : ""}`}>
                      {s.metrics.maintenanceCost}/100
                    </td>
                  );
                })}
              </tr>

              {/* Overall Decision Score */}
              <tr className="bg-slate-50 font-bold">
                <td className="py-3 px-4 text-blue-600">Overall Decision Score</td>
                {simulatedScenarios.map((s) => {
                  const isBest = s.decisionScore === Math.max(...simulatedScenarios.map(sc => sc.decisionScore));
                  return (
                    <td key={s.id} className={`py-3 px-4 text-center border-l border-slate-100 text-sm ${isBest ? "bg-blue-100 text-blue-700 font-bold" : "text-slate-900"}`}>
                      {s.decisionScore.toFixed(1)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendation Panel */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Recommendation Strategy</h3>
            <p className="text-xs text-slate-500 text-slate-500">Rigorous structural assessment details</p>
          </div>
          <span className="text-[10px] font-mono bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2 py-0.5 rounded uppercase">
            {optimalScenario.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-3">
            <p>
              <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Reasoning:</span>
              Based on the simulated parameters, selecting <span className="font-bold text-slate-900">{optimalScenario.name}</span> offers the highest composite return with a {optimalScenario.decisionScore.toFixed(1)} score. This preserves long-term scalability while avoiding the severe {budgetShift ? "$750,000" : "$500,000"} budget ceiling threats.
            </p>
            <p>
              <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Key Advantages:</span>
              {optimalScenario.pros.join(" • ")}
            </p>
          </div>
          
          <div className="space-y-3">
            <p>
              <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Expected Outcomes:</span>
              Up to 35% carbon offset improvement and sustainable passenger flow increases over 2 years.
            </p>
            <p>
              <span className="font-bold text-slate-900 block font-mono text-[9px] uppercase">Suggested Risk Mitigation:</span>
              Regular optical sensor calibrations and backup telemetry mesh nodes to defend against hardware brownouts.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button 
            onClick={() => setShowFullExplanation(!showFullExplanation)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            {showFullExplanation ? "Hide AI Explanation" : "View Full AI Explanation"}
          </button>
        </div>

        {showFullExplanation && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-500 font-mono">
            Model calculation logs indicate: Cost weight coefficient = 0.25; Safety weight coefficient = 0.35; Eco-Impact weight coefficient = 0.25; Social weight coefficient = 0.15. Simulated variances from the stress Sandbox are computed dynamically. Optimal recommendation reflects local digital twin database verification benchmarks.
          </div>
        )}
      </div>

      {/* Decision Score Breakdown & Confidence meter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Breakdown (left) */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Weighted Decision Score Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution of municipal utility criteria weights</p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Metric 1 */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span>Cost Efficiency (CAPEX limit)</span>
                <span className="text-slate-500">25% contribution</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: "25%" }} />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span>Public Safety & Mitigation</span>
                <span className="text-slate-500">35% contribution</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: "35%" }} />
              </div>
            </div>

            {/* Metric 3 */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span>Environmental Carbon Offsets</span>
                <span className="text-slate-500">25% contribution</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: "25%" }} />
              </div>
            </div>

            {/* Metric 4 */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono">
                <span>Social Integration & Approval</span>
                <span className="text-slate-500">15% contribution</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: "15%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Gauge (right) */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Reliability Gauge</h3>
            <p className="text-xs text-slate-500">Verification confidence across city models</p>
          </div>

          <div className="flex items-center gap-6 my-2">
            {/* Circular Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="251" strokeDashoffset={251 - (251 * optimalScenario.confidenceMeter) / 100} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-lg text-slate-900">
                {optimalScenario.confidenceMeter}%
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <span className="font-bold text-emerald-700 font-mono text-[10px] uppercase">Reliability verification matches:</span>
              <ul className="space-y-1 font-mono text-[10px] text-slate-500">
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Historical sensor data matched</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Regional case studies verified</li>
                <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Stable seasonal traffic volumes</li>
              </ul>
            </div>
          </div>

          <span className="text-[9px] font-mono text-slate-400 text-center block pt-2 border-t border-slate-100">CONFIDENCE RATING: SECURE & CERTIFIED</span>
        </div>
      </div>

      {/* Trade-Off Analysis */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Strategic Trade-Off Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {simulatedScenarios.map((scen, idx) => (
            <div key={scen.id} className="space-y-3">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold border-b border-slate-100 pb-1">
                Scenario {String.fromCharCode(65 + idx)}: {scen.name}
              </span>
              
              <div className="space-y-2 text-xs">
                {/* Pros */}
                <div className="space-y-1">
                  <span className="text-[9px] text-emerald-700 font-mono uppercase font-bold">Key Advantages:</span>
                  {scen.pros.map((p, i) => (
                    <div key={i} className="flex gap-1.5 items-start text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>

                {/* Cons */}
                <div className="space-y-1">
                  <span className="text-[9px] text-orange-700 font-mono uppercase font-bold">Key Constraints / Risks:</span>
                  {scen.cons.map((c, i) => (
                    <div key={i} className="flex gap-1.5 items-start text-slate-600">
                      <X className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment Matrix */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Operational Risk Assessment</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-2.5 px-4 font-bold">RISK DOMAINS</th>
                {simulatedScenarios.map((scen, idx) => (
                  <th key={scen.id} className="py-2.5 px-4 text-center font-bold text-slate-900 border-l border-slate-100">
                    Scenario {String.fromCharCode(65 + idx)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 px-4">Financial CAPEX Risk</td>
                {simulatedScenarios.map((scen, idx) => {
                  const level = idx === 0 ? "LOW" : idx === 1 ? "HIGH" : "MEDIUM";
                  const color = level === "LOW" ? "text-green-700 bg-green-50" : level === "MEDIUM" ? "text-orange-700 bg-orange-50" : "text-red-700 bg-red-50";
                  return <td key={scen.id} className="py-2.5 px-4 text-center border-l border-slate-100"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{level}</span></td>;
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-4">Operational Disruption</td>
                {simulatedScenarios.map((scen, idx) => {
                  const level = idx === 0 ? "LOW" : idx === 1 ? "HIGH" : "MEDIUM";
                  const color = level === "LOW" ? "text-green-700 bg-green-50" : level === "MEDIUM" ? "text-orange-700 bg-orange-50" : "text-red-700 bg-red-50";
                  return <td key={scen.id} className="py-2.5 px-4 text-center border-l border-slate-100"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{level}</span></td>;
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-4">Environmental Inducement Risk</td>
                {simulatedScenarios.map((scen, idx) => {
                  const level = idx === 0 ? "LOW" : idx === 1 ? "HIGH" : "LOW";
                  const color = level === "LOW" ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50";
                  return <td key={scen.id} className="py-2.5 px-4 text-center border-l border-slate-100"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{level}</span></td>;
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-4">Public Acceptance Resistance</td>
                {simulatedScenarios.map((scen, idx) => {
                  const level = idx === 0 ? "LOW" : idx === 1 ? "MEDIUM" : "LOW";
                  const color = level === "LOW" ? "text-green-700 bg-green-50" : "text-orange-700 bg-orange-50";
                  return <td key={scen.id} className="py-2.5 px-4 text-center border-l border-slate-100"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{level}</span></td>;
                })}
              </tr>
              <tr>
                <td className="py-2.5 px-4">Technical Complexity & Integration</td>
                {simulatedScenarios.map((scen, idx) => {
                  const level = idx === 0 ? "HIGH" : idx === 1 ? "LOW" : "MEDIUM";
                  const color = level === "LOW" ? "text-green-700 bg-green-50" : level === "MEDIUM" ? "text-orange-700 bg-orange-50" : "text-red-700 bg-red-50";
                  return <td key={scen.id} className="py-2.5 px-4 text-center border-l border-slate-100"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{level}</span></td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Analytical Scenario Visualizations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart 1: Bar Chart (Score Comparison) */}
          <div className="space-y-2 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Decision Score Comparison</span>
            <div className="h-36 w-full border border-slate-100 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
              <svg viewBox="0 0 200 100" className="w-full h-full max-h-[100px]">
                <line x1="10" y1="80" x2="190" y2="80" stroke="#E2E8F0" />
                {/* Scenario A */}
                <rect x="25" y={80 - (simulatedScenarios[0]?.decisionScore || 80) * 0.7} width="22" height={(simulatedScenarios[0]?.decisionScore || 80) * 0.7} fill="#2563EB" rx="1" />
                <text x="36" y="93" fontSize="8" className="font-mono" textAnchor="middle" fill="#64748B">A</text>
                {/* Scenario B */}
                <rect x="85" y={80 - (simulatedScenarios[1]?.decisionScore || 60) * 0.7} width="22" height={(simulatedScenarios[1]?.decisionScore || 60) * 0.7} fill="#64748B" rx="1" />
                <text x="96" y="93" fontSize="8" className="font-mono" textAnchor="middle" fill="#64748B">B</text>
                {/* Scenario C */}
                <rect x="145" y={80 - (simulatedScenarios[2]?.decisionScore || 90) * 0.7} width="22" height={(simulatedScenarios[2]?.decisionScore || 90) * 0.7} fill="#2563EB" rx="1" />
                <text x="156" y="93" fontSize="8" className="font-mono" textAnchor="middle" fill="#64748B">C</text>
              </svg>
            </div>
            <span className="text-[9px] font-mono text-slate-400">Score comparisons across indices</span>
          </div>

          {/* Chart 2: Radar Chart representing weight dimensions */}
          <div className="space-y-2 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Multivariate Index Footprint</span>
            <div className="h-36 w-full border border-slate-100 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full max-h-[100px]">
                {/* Background hexagons */}
                <polygon points="50,10 85,35 85,75 50,90 15,75 15,35" fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
                <polygon points="50,25 75,42 75,68 50,80 25,68 25,42" fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
                {/* Scenario A shape */}
                <polygon points="50,20 70,45 68,60 50,75 32,58 35,45" fill="rgba(37, 99, 235, 0.15)" stroke="#2563EB" strokeWidth="1" />
              </svg>
            </div>
            <span className="text-[9px] font-mono text-slate-400">Cost • Safety • Eco • Social dimensions</span>
          </div>

          {/* Chart 3: Heatmap rating grid */}
          <div className="space-y-2 text-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Operational Impact Heatmap</span>
            <div className="h-36 w-full border border-slate-100 rounded-lg p-2 bg-slate-50 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1 w-full max-w-[120px]">
                <div className="h-6 bg-blue-50 border border-blue-100 text-[8px] font-mono flex items-center justify-center text-slate-600">A1</div>
                <div className="h-6 bg-blue-200 border border-blue-300 text-[8px] font-mono flex items-center justify-center text-slate-700">A2</div>
                <div className="h-6 bg-blue-600 border border-blue-700 text-[8px] font-mono flex items-center justify-center text-white">A3</div>
                
                <div className="h-6 bg-blue-100 border border-blue-200 text-[8px] font-mono flex items-center justify-center text-slate-600">B1</div>
                <div className="h-6 bg-blue-50 border border-blue-100 text-[8px] font-mono flex items-center justify-center text-slate-600">B2</div>
                <div className="h-6 bg-blue-200 border border-blue-300 text-[8px] font-mono flex items-center justify-center text-slate-700">B3</div>

                <div className="h-6 bg-blue-600 border border-blue-700 text-[8px] font-mono flex items-center justify-center text-white">C1</div>
                <div className="h-6 bg-blue-600 border border-blue-700 text-[8px] font-mono flex items-center justify-center text-white">C2</div>
                <div className="h-6 bg-blue-200 border border-blue-300 text-[8px] font-mono flex items-center justify-center text-slate-700">C3</div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-slate-400">Section grid alignment matrices</span>
          </div>
        </div>
      </div>

      {/* Executive Decision Panel */}
      <div className="bg-white border-2 border-blue-500 p-6 rounded-xl shadow-md space-y-4">
        <div>
          <span className="text-[9px] font-mono text-blue-600 font-bold uppercase tracking-widest block">EXECUTIVE APPROVAL SHEET</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">Authorize Optimal AI-Recommended Scenario</h3>
          <p className="text-xs text-slate-500">Signing off this proposal pushes target routing updates to digital twins</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 border-y border-slate-100 py-4">
          <div className="space-y-2">
            <div className="flex justify-between font-mono"><span>Recommended Scenario:</span><span className="font-bold text-slate-900">{optimalScenario.name}</span></div>
            <div className="flex justify-between font-mono"><span>Confidence Rating:</span><span className="font-bold text-emerald-600">{optimalScenario.confidenceMeter}% Certainty</span></div>
            <div className="flex justify-between font-mono"><span>Estimated CAPEX:</span><span className="font-bold text-slate-900">{budgetShift ? "$750,000" : "$500,000"}</span></div>
            <div className="flex justify-between font-mono"><span>Deployment Timeline:</span><span className="font-bold text-slate-900">{reduceTimeline ? "Accelerated" : "6 Months"}</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between font-mono"><span>Primary Advantage:</span><span className="text-emerald-700 font-semibold truncate max-w-[200px]">{optimalScenario.pros[0]}</span></div>
            <div className="flex justify-between font-mono"><span>Primary Risk:</span><span className="text-orange-700 font-semibold truncate max-w-[200px]">{optimalScenario.cons[0]}</span></div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          {decisionApproved ? (
            <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold font-mono">
              <CheckCircle className="w-5 h-5 text-green-600" /> DECISION RECORDED & SENT TO PRODUCTION GRIDS
            </div>
          ) : (
            <span className="text-[10px] font-mono text-slate-400">Requires coordinator signature parameters</span>
          )}
          
          <div className="flex gap-2">
            <button 
              onClick={() => onSelectReport(optimalScenario as any)}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-4 border border-slate-200 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Generate Executive Report
            </button>
            <button 
              onClick={() => setDecisionApproved(true)}
              disabled={decisionApproved}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {decisionApproved ? "Approved" : "Approve Recommendation"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
