"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, Shield, Clock, Leaf, Users, 
  Award, Check, AlertCircle, FileText
} from "lucide-react";

export interface Scenario {
  id: string;
  name: string;
  type: "Infrastructure-First" | "AI/IoT-Driven" | "Policy/Community-Led" | string;
  description: string;
  metrics: {
    cost: number; // 1-100 (high is better/cheaper)
    safety: number; // 1-100 (high is safer)
    time: number; // 1-100 (high is faster)
    sustainability: number; // 1-100 (high is cleaner)
    socialImpact: number; // 1-100 (high is positive trust)
  };
  confidenceMeter: number; // 1-100
  pros: string[];
  cons: string[];
  timeline: {
    phase: string;
    duration: string;
    task: string;
  }[];
  policyChanges: string[];
  riskMitigation: {
    risk: string;
    mitigation: string;
  }[];
  decision_score?: number;
  decision_score_explanation?: string;
  confidence_reasoning?: string;
  factors_breakdown?: Record<string, number>;
}

interface ScenarioCardProps {
  scenario: Scenario;
  calculatedScore: number;
  isOptimal: boolean;
  onSelectReport: (scenario: Scenario) => void;
}

export function ScenarioCard({ scenario, calculatedScore, isOptimal, onSelectReport }: ScenarioCardProps) {
  // Light themed paradigm status colors
  const badgeStyles = {
    "Infrastructure-First": "text-red-700 bg-red-50 border border-red-200",
    "AI/IoT-Driven": "text-blue-700 bg-blue-50 border border-blue-200",
    "Policy/Community-Led": "text-slate-700 bg-slate-100 border border-slate-200"
  }[scenario.type] || "text-slate-600 bg-slate-50 border border-slate-200";

  const cardBorder = isOptimal 
    ? "border-blue-500 shadow-md ring-1 ring-blue-500/20" 
    : "border-slate-200 hover:border-slate-300";

  return (
    <motion.div
      layout
      className={`bg-white border p-6 rounded-xl shadow-sm transition-all duration-200 relative flex flex-col justify-between ${cardBorder}`}
    >
      {/* Optimal Indicator Flag Banner */}
      {isOptimal && (
        <div className="absolute -top-3 left-6 bg-blue-600 text-white font-mono text-[9px] font-bold px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1">
          <Award className="w-3 h-3" /> OPTIMAL AI RECOMMENDATION
        </div>
      )}

      {/* Card Body */}
      <div>
        <div className="flex justify-between items-start mb-3 mt-1">
          <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded ${badgeStyles}`}>
            {scenario.type}
          </span>
          <div className="text-right">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">Decision Score</span>
            <span className={`text-xl font-bold ${isOptimal ? "text-blue-600" : "text-slate-900"} font-mono`}>
              {calculatedScore.toFixed(1)}
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2 leading-tight">{scenario.name}</h3>
        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
          {scenario.description}
        </p>

        {/* Confidence Progress Meter */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
          <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
            <span>Confidence Index:</span>
            <span className="text-blue-600 font-bold">{scenario.confidenceMeter}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full rounded-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${scenario.confidenceMeter}%` }}
            />
          </div>
        </div>

        {/* Core Metrics comparison mini-grid */}
        <div className="grid grid-cols-5 gap-1.5 mb-6 text-center">
          <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
            <span className="text-[8px] text-slate-400 font-mono block uppercase">Budget</span>
            <span className="text-xs font-bold text-slate-700 font-mono">{scenario.metrics.cost}</span>
          </div>
          <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
            <Shield className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
            <span className="text-[8px] text-slate-400 font-mono block uppercase">Safety</span>
            <span className="text-xs font-bold text-slate-700 font-mono">{scenario.metrics.safety}</span>
          </div>
          <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
            <span className="text-[8px] text-slate-400 font-mono block uppercase">Time</span>
            <span className="text-xs font-bold text-slate-700 font-mono">{scenario.metrics.time}</span>
          </div>
          <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
            <Leaf className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
            <span className="text-[8px] text-slate-400 font-mono block uppercase">Eco</span>
            <span className="text-xs font-bold text-slate-700 font-mono">{scenario.metrics.sustainability}</span>
          </div>
          <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
            <Users className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
            <span className="text-[8px] text-slate-400 font-mono block uppercase">Social</span>
            <span className="text-xs font-bold text-slate-700 font-mono">{scenario.metrics.socialImpact}</span>
          </div>
        </div>

        {/* Advantages & Constraints Block */}
        <div className="space-y-3 mb-6">
          <div>
            <h4 className="text-[9px] font-mono uppercase tracking-wider text-emerald-600 font-bold mb-1 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> Primary Advantage
            </h4>
            <p className="text-xs text-slate-600 pl-3 border-l border-slate-200">
              {scenario.pros[0]}
            </p>
          </div>
          <div>
            <h4 className="text-[9px] font-mono uppercase tracking-wider text-orange-600 font-bold mb-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-orange-600" /> Primary Constraint
            </h4>
            <p className="text-xs text-slate-600 pl-3 border-l border-slate-200">
              {scenario.cons[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Card Action footer */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => onSelectReport(scenario)}
          className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wider font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isOptimal 
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" /> GENERATE BRIEF REPORT
        </button>
      </div>
    </motion.div>
  );
}
