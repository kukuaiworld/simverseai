"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, Cpu, SlidersHorizontal, Map, 
  FileText, Activity, ShieldAlert, Coins, 
  Timer, Leaf, HeartHandshake, ArrowRight, 
  Play, CheckCircle, Database, Network, 
  BarChart3, Brain, ArrowUpRight, Sparkles
} from "lucide-react";

interface LandingPageProps {
  onEnterDashboard: (targetTab?: "dashboard" | "simulator") => void;
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const featureCards = [
    {
      icon: <Cpu className="w-5 h-5 text-blue-600" />,
      title: "AI Scenario Simulation",
      desc: "Instantly simulate urban challenges (traffic congestion, power grids, AQI) and evaluate multiple proposed civil works or IoT solutions."
    },
    {
      icon: <SlidersHorizontal className="w-5 h-5 text-blue-600" />,
      title: "Scenario Compare Engine",
      desc: "Compare multiple scenarios side-by-side. Drag sliders to adjust parameter priorities and dynamically recalculate ratings."
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      title: "Decision Score",
      desc: "Access aggregated ratings for cost, safety, and eco-impact. System automatically flags the optimal recommendation."
    },
    {
      icon: <Activity className="w-5 h-5 text-blue-600" />,
      title: "Confidence Meter",
      desc: "Review predictive certainty indices generated from historical municipal logs and continuous digital twin telemetry."
    },
    {
      icon: <Map className="w-5 h-5 text-blue-600" />,
      title: "Interactive Smart Map",
      desc: "Interact with live SVG vector grids representing city zones. Inspect active telemetry and launch simulator presets directly."
    },
    {
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      title: "AI Report Generator",
      desc: "Generate professional briefing reports optimized for executive review, featuring timelines, policy shifts, and risk matrices."
    }
  ];

  const steps = [
    {
      num: "01",
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      title: "Describe Your Problem",
      desc: "Specify a local urban challenge or load active anomalies directly from the interactive municipal map nodes."
    },
    {
      num: "02",
      icon: <Brain className="w-4 h-4 text-blue-600" />,
      title: "Generate AI Scenarios",
      desc: "AI engine generates 3 core options: Infrastructure-First, Technology-Led (AI/IoT), and Policy-Driven."
    },
    {
      num: "03",
      icon: <SlidersHorizontal className="w-4 h-4 text-blue-600" />,
      title: "Compare Solutions",
      desc: "Adjust decision weights for cost, safety, time, eco, and social priorities to dynamically re-rank options."
    },
    {
      num: "04",
      icon: <CheckCircle className="w-4 h-4 text-blue-600" />,
      title: "Make Better Decisions",
      desc: "Analyze the optimal path, print a professional policy brief PDF, and deploy actionable structural reforms."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-100">
      
      {/* Top Navbar */}
      <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onEnterDashboard("dashboard")}>
            <Building2 className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold tracking-tight text-slate-900">
              SimVerse <span className="text-blue-600 font-extrabold">AI</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#statistics" className="hover:text-blue-600 transition-colors">Statistics</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          </div>

          <button
            onClick={() => onEnterDashboard("dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Launch Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20 lg:py-28 relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs text-blue-700 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Decision Intelligence Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Predict. Compare.<br />
            <span className="text-blue-600">Decide.</span>
          </h1>

          <p className="text-base text-slate-600 leading-relaxed max-w-xl">
            SimVerse AI helps governments, city planners, and organizations simulate future scenarios, compare multiple solutions, and make smarter data-driven decisions using Artificial Intelligence.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onEnterDashboard("simulator")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition-all flex items-center gap-2 hover:scale-[1.01] cursor-pointer text-sm"
            >
              Start Simulation <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDemoModalOpen(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm py-3 px-6 rounded-lg border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-500 stroke-none" /> Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Clean Product Dashboard Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full flex items-center justify-center"
        >
          <div className="w-full max-w-[500px] bg-white border border-slate-200 p-5 rounded-xl shadow-md relative overflow-hidden">
            {/* Header Mockup */}
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider font-mono">SimVerse Workspace</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">DECISION REPORT SV-384</span>
            </div>

            {/* Simulated Grid Data Visuals */}
            <div className="space-y-4">
              {/* Mini cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-slate-100 bg-slate-50 p-2.5 rounded-lg text-center">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono">Safety index</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">92%</span>
                </div>
                <div className="border border-slate-100 bg-slate-50 p-2.5 rounded-lg text-center">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono">AQI Level</span>
                  <span className="text-sm font-bold text-emerald-600 font-mono">Optimal</span>
                </div>
                <div className="border border-slate-100 bg-slate-50 p-2.5 rounded-lg text-center">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono">Energy Load</span>
                  <span className="text-sm font-bold text-orange-600 font-mono">88%</span>
                </div>
              </div>

              {/* Central Map Illustration Mockup */}
              <div className="h-40 bg-slate-50 rounded-lg border border-slate-100 p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>VECTOR NODE MONITOR</span>
                  <span className="text-blue-600 font-bold">5 ACTIVE SECTORS</span>
                </div>
                {/* Clean diagram SVG */}
                <div className="flex-1 flex items-center justify-center">
                  <svg viewBox="0 0 200 80" className="w-full h-full max-h-[70px]">
                    <line x1="20" y1="40" x2="180" y2="40" stroke="#CBD5E1" strokeDasharray="3,3" />
                    <circle cx="50" cy="40" r="15" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                    <circle cx="100" cy="40" r="25" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                    <circle cx="150" cy="40" r="15" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                    <circle cx="50" cy="40" r="4" fill="#2563EB" />
                    <circle cx="100" cy="40" r="4" fill="#64748B" />
                    <circle cx="150" cy="40" r="4" fill="#2563EB" />
                  </svg>
                </div>
                <div className="text-[9px] text-slate-500 font-mono text-center">
                  Sector Alpha Traffic Optimization Active
                </div>
              </div>

              {/* Progress and indicators */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-500">AI Confidence Index:</span>
                  <span className="text-blue-600 font-bold">95.4% Verified</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-blue-600" style={{ width: "95%" }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="w-full bg-white border-y border-slate-200 py-20 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase font-mono text-blue-600">
              Platform Features
            </h2>
            <p className="text-sm text-slate-500">
              A comprehensive toolkit for structural simulation, parameter trade-offs, and administrative decision intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="enterprise-card p-6 rounded-xl border border-slate-200 flex flex-col gap-4 text-left hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-20 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase font-mono text-blue-600">
              How It Works
            </h2>
            <p className="text-sm text-slate-500">
              Turn complex urban constraints into optimized civil blueprints in four clear steps.
            </p>
          </div>

          {/* Step flow grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connected horizontal line */}
            <div className="hidden lg:block absolute top-[36px] left-[12%] right-[12%] h-[1px] bg-slate-200 z-0" />

            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white border border-slate-200 p-6 rounded-xl relative z-10 flex flex-col items-center text-center gap-4 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-mono font-bold text-xs text-blue-600 shrink-0">
                  {step.num}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="w-full bg-white border-y border-slate-200 py-16 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <h3 className="text-4xl font-extrabold text-blue-600 font-mono tracking-tight">1,000+</h3>
              <p className="text-xs text-slate-500 uppercase font-mono tracking-wider font-semibold">Simulations Completed</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-extrabold text-blue-600 font-mono tracking-tight">50+</h3>
              <p className="text-xs text-slate-500 uppercase font-mono tracking-wider font-semibold">Zoning Parameters</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-extrabold text-blue-600 font-mono tracking-tight">95%</h3>
              <p className="text-xs text-slate-500 uppercase font-mono tracking-wider font-semibold">AI Confidence Match</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-extrabold text-blue-600 font-mono tracking-tight">24/7</h3>
              <p className="text-xs text-slate-500 uppercase font-mono tracking-wider font-semibold">Planner Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 z-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-200 p-8 md:p-12 rounded-xl text-center shadow-md relative overflow-hidden"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-950 mb-3">
              Ready to explore the future before making a decision?
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto mb-8 leading-relaxed">
              Launch our clean administrative workspace, input specific city constraints, and generate validated solutions templates.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => onEnterDashboard("dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer text-xs"
              >
                Launch Dashboard
              </button>
              <button
                onClick={() => onEnterDashboard("simulator")}
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-all cursor-pointer text-xs"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About/Footer Section */}
      <section id="about" className="w-full bg-white border-t border-slate-200 py-16 z-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-blue-600 font-mono">Civic Analytics Reimagined</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              SimVerse AI couples digital twin models with multi-objective optimization algorithms to evaluate municipal infrastructure shifts. Provide actionable templates with verifiable cost, timeline, and risk metrics.
            </p>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                <Database className="w-3 h-3 text-slate-500" /> IoT Integration
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                <Network className="w-3 h-3 text-slate-500" /> Mesh Grid Twining
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg space-y-3 font-mono text-xs text-slate-700 shadow-inner">
            <div className="flex justify-between border-b border-slate-200 pb-2 text-slate-400 font-bold">
              <span>PARAMETER PARAM</span>
              <span>COEFFICIENT</span>
            </div>
            <div className="flex justify-between">
              <span>Grid Stability Index</span>
              <span className="text-slate-900 font-semibold">92.4% Optimal</span>
            </div>
            <div className="flex justify-between">
              <span>Dynamic Fare Margin</span>
              <span className="text-slate-900 font-semibold">+12% Adjusted</span>
            </div>
            <div className="flex justify-between">
              <span>Smog Throttling Delay</span>
              <span className="text-slate-900 font-semibold">15 mins Loop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-12 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span className="text-base font-bold tracking-tight text-slate-900">SIMVERSE AI</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
              Decision intelligence platforms for smart energy grids, logistics transit grids, and municipal command centers.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-800 tracking-wider">QUICK LINKS</h4>
            <ul className="space-y-1.5 text-xs text-slate-500 font-mono">
              <li><a href="#features" className="hover:text-blue-600">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-600">How It Works</a></li>
              <li><a href="#statistics" className="hover:text-blue-600">Statistics</a></li>
              <li><a href="#about" className="hover:text-blue-600">Platform Data</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-800 tracking-wider">CONTACT</h4>
            <p className="text-xs text-slate-500 font-mono leading-relaxed">
              Global HQ:<br />
              100 Civil Plaza, Sector Alpha<br />
              support@simverseai.gov
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-800 tracking-wider">LEGAL & REPO</h4>
            <ul className="space-y-1.5 text-xs text-slate-500 font-mono">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 flex items-center gap-0.5">GITHUB <ArrowUpRight className="w-3 h-3 text-slate-400" /></a></li>
              <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600">Terms of Use</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-slate-400 gap-4">
          <span>© 2026 SIMVERSE AI CORE. GOVERNMENT PLATFORM SCHED-3.</span>
          <span>LATENCY Telemetry 42ms • SECURITY LINK SECURE</span>
        </div>
      </footer>

      {/* Demo Modal Presentation */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-xl relative">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold font-mono cursor-pointer"
            >
              ✕ CLOSE
            </button>
            <h3 className="text-base font-bold text-slate-900 font-mono uppercase">SimVerse AI Platform Demo</h3>
            
            <div className="aspect-video w-full rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-center items-center p-8 text-center relative overflow-hidden">
              <Brain className="w-12 h-12 text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-900 text-sm">Autonomous Scenario Simulation Playback</h4>
              <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
                Watch how SimVerse schedules dynamic zoning, predicts municipal carbon shifts, and computes real-time decision indexes. Click below to enter the live command workspace and execute your own challenge simulations!
              </p>
              
              <button
                onClick={() => {
                  setDemoModalOpen(false);
                  onEnterDashboard("simulator");
                }}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition-all cursor-pointer text-xs"
              >
                Launch Simulator Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
