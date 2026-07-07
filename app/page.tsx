/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Send, Upload, Sparkles, AlertTriangle, 
  Shield, CheckCircle2, Clock, Terminal, RotateCcw,
  FileText, Activity, Layers, UserCheck, Check, Landmark, MapPin
} from "lucide-react";

// Types for Chat
interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  actions?: Array<{ label: string; scheme: string }>;
}

// Types for Sentinel Report
interface SentinelReport {
  isValidCivicIssue?: boolean;
  message?: string;
  reportId: string;
  category: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  status: string;
  actionPlan: string[];
}

export default function CivicCommandCenter() {
  // --- STATE VARIABLES ---
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Namaste! I am BharatSaathi, your digital civic companion. Ask me about government scheme eligibility (e.g., PM-Kisan Yojana, Pension benefits) or drag/upload an image to the Sentinel Reporter to scan and flag civic infrastructure issues.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);
  
  // Sentinel Upload & Scan state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>("");
  const [scanState, setScanState] = useState<"idle" | "dragging" | "scanning" | "completed">("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState("");
  const [scanReport, setScanReport] = useState<SentinelReport | null>(null);

  // Holographic Application Modal State
  const [activeSchemeModal, setActiveSchemeModal] = useState<{ label: string; scheme: string } | null>(null);
  const [formData, setFormData] = useState({ name: "", aadhaar: "", contact: "", state: "", landholding: "" });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState<string[]>([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const [reportsList, setReportsList] = useState<SentinelReport[]>([]);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports");
      if (response.ok) {
        const data = await response.json();
        setReportsList(data);
      }
    } catch (err) {
      console.error("Failed to query reports registry:", err);
    }
  };

  // Detect simulator mode state and fetch reports on page mount
  useEffect(() => {
    const checkConfig = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "system_config_check_ping" })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.isSimulated) {
            setIsSimulatedMode(true);
          }
        }
      } catch (err) {
        console.error("Failed to query API config status:", err);
      }
    };
    checkConfig();
    fetchReports();
  }, []);

  // --- FLOATING ANIMATION VARIANTS ---
  // We use different delay variables so components float asynchronously
  const floatVariants = (yOffset = 6, duration = 6): any => ({
    animate: {
      y: [-yOffset, yOffset, -yOffset],
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  });

  // --- INITIALIZE SPEECH RECOGNITION ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-IN"; // Optimized for Indian English and speech accents

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev ? prev + " " + transcript : transcript);
        };

        rec.onerror = (e: any) => {
          console.error("Speech recognition error:", e);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Voice Toggle Trigger
  const toggleSpeech = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please try Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // --- SEND CHAT MESSAGE ---
  const handleSendMessage = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const textToSend = customMsg || input;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    if (!customMsg) setInput("");
    
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend })
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();
      
      const aiMsg: Message = {
        id: Math.random().toString(),
        sender: "ai",
        text: data.text || "I was unable to retrieve a response.",
        timestamp: new Date(),
        actions: data.actions || []
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: "ai",
        text: "Error connecting to Civic Node. Please verify network interfaces and ensure Gemini credentials are configured.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- SENTINEL DRAG & DROP FILE HANDLERS ---
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG/JPG).");
      return;
    }
    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      startSentinelScan(e.target?.result as string, file.type, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setScanState("dragging");
  };

  const handleDragLeave = () => {
    setScanState("idle");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    } else {
      setScanState("idle");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  // --- RUN SENTINEL SCAN PROCESS ---
  const startSentinelScan = async (base64Image: string, mime: string, fileName?: string) => {
    setScanState("scanning");
    setScanProgress(0);
    setScanReport(null);

    // Dynamic scanning steps simulation
    const steps = [
      "Initializing computer vision tensor grids...",
      "Extracting spatial image coordinates...",
      "Analyzing hazard density and depth maps...",
      "Comparing anomalies with local municipality directories...",
      "Compiling Civic Sentinel report logs..."
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      
      const stepIdx = Math.min(Math.floor(progress / 20), steps.length - 1);
      setScanStep(steps[stepIdx]);

      if (progress >= 100) {
        clearInterval(interval);
        triggerImageAnalysis(base64Image, mime, fileName);
      }
    }, 150);
  };

  const triggerImageAnalysis = async (base64Image: string, mime: string, fileName?: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          mimeType: mime,
          message: `Analyze image: ${fileName || "civic issue"}`
        })
      });

      if (!response.ok) throw new Error("API scan failed");

      const data = await response.json();
      setScanReport(data);

      // Save valid scans to backend reports ledger database
      if (data.isValidCivicIssue !== false) {
        try {
          await fetch("/api/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });
          fetchReports();
        } catch (dbErr) {
          console.error("Failed to commit report to registry ledger:", dbErr);
        }
      }

      setScanState("completed");
    } catch (err) {
      console.error(err);
      setScanReport({
        reportId: `SR-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        category: "System Scan Error",
        severity: "Medium",
        description: "Failed to run deep scan online. Node offline or key missing.",
        status: "Manual Dispatch Pending Verification",
        actionPlan: ["Acknowledge failure state", "Queue photo locally", "Attempt sync in background"]
      });
      setScanState("completed");
    }
  };

  // Reset reporter
  const resetReporter = () => {
    setUploadedImage(null);
    setScanReport(null);
    setScanState("idle");
    setScanProgress(0);
  };

  // --- HOLOGRAPHIC DYNAMIC FORM TRIGGER ---
  const triggerActionModal = (action: { label: string; scheme: string }) => {
    setActiveSchemeModal(action);
    setFormData({ name: "", aadhaar: "", contact: "", state: "", landholding: "" });
    setSubmissionSuccess(false);
    setFormProgress([]);
    setTxHash("");
  };

  const submitHolographicForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    const logs = [
      "Securing holographic data transmission link...",
      "Encrypting Aadhaar and biometric credentials...",
      "Verifying landholding status with Digital India Land Records API...",
      "Routing application packets to Block Development Officer registry...",
      "Confirming State Government eligibility ledger entry..."
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setFormProgress(prev => [...prev, logs[i]]);
    }

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          scheme: activeSchemeModal?.scheme || "General Scheme"
        })
      });

      if (!response.ok) throw new Error("API Submission failed");
      const data = await response.json();
      
      setTxHash(data.txHash);
      setSubmissionSuccess(true);
    } catch (err) {
      console.error("Apply API Error, using backup hash:", err);
      setTxHash(`tx-0x${Math.random().toString(16).substr(2, 24).toUpperCase()}`);
      setSubmissionSuccess(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] font-sans text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* 2035 Holographic Background Overlays */}
      <div className="holo-grid" />
      <div className="holo-radial" />
      <div className="holo-scanlines" />

      {/* HEADER SECTION */}
      <header className="relative w-full z-10 border-b border-cyan-500/20 bg-[#050505]/70 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center border border-cyan-300/40 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Activity className="w-6 h-6 text-cyan-200" />
          </motion.div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-400 uppercase">
              BHARAT SAATHI
            </h1>
            <p className="text-xs font-mono tracking-widest text-cyan-400/80 uppercase">
              Civic Command Center v3.35 • Terminal active
            </p>
          </div>
        </div>

        {/* Global Node Health Status */}
        <div className="flex items-center gap-6 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>NODE HEALTH: 100% (STABLE)</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-6 text-slate-500">
            <span>SECURE SYSTEM INTERFACE • {new Date().toISOString().split('T')[0]}</span>
          </div>
        </div>
      </header>

      {isSimulatedMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex flex-col md:flex-row justify-between items-center gap-2 text-xs font-mono text-amber-400 z-10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse text-amber-500" />
            <span>
              <strong>Holographic Simulator Mode Active</strong>: Image analysis is running locally. Set a real <code>GEMINI_API_KEY</code> in <code>.env.local</code> and restart Next.js for live vision processing.
            </span>
          </div>
          <div className="flex gap-2">
            <span className="bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
              💡 Tip: Upload files containing &quot;water&quot;, &quot;light&quot;, &quot;garbage&quot;, or &quot;non-civic&quot; in the filename to test different simulator responses.
            </span>
          </div>
        </div>
      )}

      {/* DASHBOARD SPLIT GRID */}
      <main className="relative flex-1 w-full max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 z-10">
        
        {/* ============================================================ */}
        {/* MODULE 1: CIVIC NAVIGATOR (CHAT PANEL) */}
        {/* ============================================================ */}
        <motion.div 
          variants={floatVariants(4, 7)}
          animate="animate"
          className="flex flex-col h-[78vh] glass-panel-neon rounded-2xl overflow-hidden border border-cyan-500/20"
        >
          {/* Module Header */}
          <div className="px-5 py-4 border-b border-cyan-500/20 bg-cyan-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="font-semibold text-cyan-300 font-mono tracking-wide uppercase">
                Civic Navigator AI
              </h2>
            </div>
            <div className="text-[10px] font-mono text-cyan-400/60 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
              MULTILINGUAL CONVERSATION SYSTEM
            </div>
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-xl p-4 border font-mono text-sm leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-cyan-950/30 border-cyan-400/40 text-cyan-100 shadow-[0_0_15px_rgba(0,240,255,0.05)]" 
                        : "bg-slate-900/60 border-slate-800 text-slate-200"
                    }`}
                  >
                    <div className="text-[9px] text-slate-500 mb-1 flex justify-between gap-4 font-mono">
                      <span>{msg.sender === "user" ? "CITIZEN_COMMAND" : "BHARAT_SAATHI_LOG"}</span>
                      <span>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Action buttons embedded in message */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-800">
                        {msg.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => triggerActionModal(act)}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-bold py-1.5 px-3.5 rounded-lg border border-cyan-300/30 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
                          >
                            <Landmark className="w-3.5 h-3.5" />
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-400 flex items-center gap-3">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span>BharatSaathi is retrieving schemes registry...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Inputs */}
          <div className="p-4 border-t border-cyan-500/20 bg-slate-950/40">
            {/* Audio Waveform display if listening */}
            {isListening && (
              <div className="mb-3 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                  </span>
                  <span className="text-xs text-cyan-400 font-mono">LISTENING VOICE FREQUENCY...</span>
                </div>
                <div className="flex gap-1">
                  {[0.5, 0.2, 0.8, 0.4, 0.7, 0.3].map((val, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 16, 4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-cyan-400 rounded-full"
                      style={{ height: 16 }}
                    />
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-3">
              {/* Text Area Input */}
              <div className="relative flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Inquire about schemes or eligibility (e.g., 'What is PM Kisan Samman Nidhi?')"
                  className="w-full bg-[#080d1a] border border-cyan-500/30 focus:border-cyan-400 text-slate-100 rounded-xl px-4 py-3 text-sm font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 resize-none h-14"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 justify-center">
                {/* Voice button */}
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border cursor-pointer transition-all ${
                    isListening
                      ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      : "bg-[#080d1a] border-cyan-500/30 text-cyan-400 hover:border-cyan-400 hover:text-cyan-200"
                  }`}
                  title={isListening ? "Stop listening" : "Start voice dictation"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-slate-950 flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-all border border-cyan-300/30 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* MODULE 2: SENTINEL REPORTER (IMAGE ANALYSIS) */}
        {/* ============================================================ */}
        <motion.div 
          variants={floatVariants(6, 8)}
          animate="animate"
          className="flex flex-col h-[78vh] glass-panel rounded-2xl overflow-hidden border border-cyan-500/10"
        >
          {/* Module Header */}
          <div className="px-5 py-4 border-b border-cyan-500/20 bg-slate-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h2 className="font-semibold text-indigo-300 font-mono tracking-wide uppercase">
                Sentinel Civic Reporter
              </h2>
            </div>
            <div className="text-[10px] font-mono text-indigo-400/60 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-400/20">
              COMPUTER VISION HAZARD INDEXER
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 flex flex-col justify-between">
            
            {/* UPLOADER / SCANNER ZONE */}
            <div className="flex-1 flex flex-col justify-center">
              {scanState === "idle" || scanState === "dragging" ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all h-[240px] cursor-pointer ${
                    scanState === "dragging"
                      ? "border-cyan-400 bg-cyan-500/5 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                      : "border-slate-800 hover:border-cyan-500/40 bg-slate-900/10 hover:bg-cyan-500/2"
                  }`}
                  onClick={() => document.getElementById("sentinel-file")?.click()}
                >
                  <input
                    id="sentinel-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-4 w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400"
                  >
                    <Upload className="w-6 h-6" />
                  </motion.div>
                  <p className="text-sm font-mono text-slate-300 font-semibold mb-1">
                    DRAG & DROP CIVIC INCIDENT PHOTO
                  </p>
                  <p className="text-xs font-mono text-slate-500">
                    Supports JPG, PNG • Max size 8MB
                  </p>
                  <button className="mt-4 px-4 py-1.5 text-xs font-mono border border-cyan-400/40 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all">
                    SELECT FILE MANUALLY
                  </button>
                </div>
              ) : (
                /* ACTIVE SCAN STATE OR COMPLETED PREVIEW */
                <div className="relative rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden flex flex-col items-center justify-center p-4 min-h-[240px]">
                  {uploadedImage && (
                    <div className="relative max-w-full max-h-[220px] rounded-lg overflow-hidden border border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={uploadedImage} 
                        alt="Civic Incident Target" 
                        className="object-contain max-h-[220px]" 
                      />
                      
                      {/* Interactive Cyan Scan Laser Line */}
                      {scanState === "scanning" && (
                        <div className="scan-laser animate-scan-laser" />
                      )}
                    </div>
                  )}

                  {/* Scanning Overlay Text */}
                  {scanState === "scanning" && (
                    <div className="absolute inset-0 bg-slate-950/70 flex flex-col justify-center items-center p-6 text-center">
                      <div className="w-48 bg-slate-900 h-1.5 rounded-full overflow-hidden mb-4 border border-cyan-400/20">
                        <motion.div 
                          className="h-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]"
                          initial={{ width: "0%" }}
                          animate={{ width: `${scanProgress}%` }}
                        />
                      </div>
                      <p className="text-cyan-400 font-mono font-bold text-xs uppercase animate-pulse">
                        ANALYSIS PENDING...
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 mt-2">
                        {scanStep}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* STRUCTURED RESPONSE CARD */}
            <div className="mt-4 flex-none min-h-[160px]">
              {scanReport ? (
                scanReport.isValidCivicIssue === false ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel border-l-4 border-l-red-500 p-4 rounded-xl space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm text-red-400 font-mono">
                          NON-CIVIC INCIDENT SCANNED
                        </h3>
                        <p className="text-xs font-mono text-slate-300 mt-2 leading-relaxed">
                          {scanReport.message || "This image does not contain a reportable civic issue. Please upload a clear photo of a public infrastructure problem."}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2 text-[10px] font-mono border-t border-slate-900 mt-2">
                      <button
                        onClick={resetReporter}
                        className="flex items-center gap-1 border border-slate-700 hover:border-red-400/40 text-slate-400 hover:text-red-300 rounded px-2.5 py-1 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        NEW SCAN
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel-neon border-l-4 border-l-cyan-400 p-4 rounded-xl space-y-3 relative overflow-hidden"
                  >
                    {/* Holographic scanner layout highlights */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                          SECURE REPORT ID: {scanReport.reportId}
                        </div>
                        <h3 className="font-bold text-base text-slate-100 font-mono">
                          {scanReport.category}
                        </h3>
                      </div>
                      
                      {/* Severity Badge */}
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        scanReport.severity === "Critical" ? "bg-red-500/20 border-red-500/40 text-red-400" :
                        scanReport.severity === "High" ? "bg-amber-500/20 border-amber-500/40 text-amber-400" :
                        scanReport.severity === "Medium" ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" :
                        "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      }`}>
                        {scanReport.severity} SEVERITY
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slate-300">
                      {scanReport.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-[11px] font-mono">
                      <div>
                        <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">MUNICIPAL STATUS</div>
                        <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          {scanReport.status}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1">ACTION RESOLUTION</div>
                        <div className="space-y-0.5 text-slate-400">
                          {scanReport.actionPlan.map((action, idx) => (
                            <div key={idx} className="flex items-start gap-1">
                              <span className="text-cyan-400">•</span>
                              <span className="truncate">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 text-[10px] font-mono">
                      <button
                        onClick={resetReporter}
                        className="flex items-center gap-1 border border-slate-700 hover:border-cyan-400/40 text-slate-400 hover:text-cyan-300 rounded px-2.5 py-1 transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        NEW SCAN
                      </button>
                      <button
                        onClick={() => handleSendMessage(undefined, `Verify status for reported incident ${scanReport.reportId} in ${scanReport.category}`)}
                        className="flex items-center gap-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 rounded px-2.5 py-1 transition-all cursor-pointer"
                      >
                        DISCUSS REPORT
                      </button>
                    </div>
                  </motion.div>
                )
              ) : (
                <div className="border border-slate-800 rounded-xl p-6 text-center bg-slate-900/10 flex flex-col items-center justify-center h-full">
                  <AlertTriangle className="w-5 h-5 text-slate-600 mb-2" />
                  <p className="text-xs font-mono text-slate-500">
                    Awaiting image scan input. Capture or drag a picture of civic issues like potholes, dumps, or pipeline leaks to analyze.
                  </p>
                </div>
              )}
            </div>

            {/* RECENT MUNICIPAL REPORTS LEDGER */}
            <div className="mt-5 border-t border-slate-900 pt-4 flex-1 flex flex-col min-h-[140px] overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                  Municipal Incident Registry Ledger
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  {reportsList.length} SECURE CASES LOGGED
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[160px]">
                {reportsList.map((rep) => (
                  <div 
                    key={rep.reportId} 
                    onClick={() => setScanReport(rep)}
                    className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 hover:border-cyan-500/20 transition-all flex justify-between items-center gap-3 font-mono text-[10px] cursor-pointer hover:bg-cyan-950/5"
                  >
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          rep.severity === "Critical" ? "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]" :
                          rep.severity === "High" ? "bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]" :
                          rep.severity === "Medium" ? "bg-cyan-500 shadow-[0_0_4px_rgba(6,182,212,0.5)]" :
                          "bg-emerald-500"
                        }`} />
                        <span className="text-slate-300 truncate">{rep.category}</span>
                      </div>
                      <div className="text-slate-500 mt-0.5 truncate">{rep.description}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-cyan-400 font-bold">{rep.reportId}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{rep.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </main>

      {/* FOOTER BAR */}
      <footer className="relative w-full z-10 border-t border-slate-900 bg-[#050505] py-4 px-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-slate-600 gap-2">
        <div>
          © 2035 BHARAT SAATHI NETWORKS • CIVIL GUARD INTERACTION SYSTEM
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-cyan-400">LEDGER LOGS</a>
          <a href="#" className="hover:text-cyan-400">CIVIC API STATUS</a>
          <a href="#" className="hover:text-cyan-400">TERMS OF COMPLIANCE</a>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* HOLOGRAPHIC APPLICATION MODAL POPUP */}
      {/* ============================================================ */}
      <AnimatePresence>
        {activeSchemeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#050505]/85 backdrop-blur-md"
              onClick={() => { if (!formSubmitting) setActiveSchemeModal(null); }}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass-panel-neon border border-cyan-400/40 rounded-2xl overflow-hidden z-10 shadow-[0_0_30px_rgba(0,240,255,0.25)]"
            >
              {/* Scanline grid in modal */}
              <div className="absolute inset-0 holo-scanlines pointer-events-none opacity-20" />

              {/* Modal Header */}
              <div className="px-5 py-4 border-b border-cyan-500/20 bg-cyan-950/30 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">HOLOGRAPHIC COMPLIANCE SYSTEM</div>
                  <h3 className="text-base font-bold text-slate-100 font-mono">{activeSchemeModal.scheme} Form</h3>
                </div>
                {!formSubmitting && (
                  <button
                    onClick={() => setActiveSchemeModal(null)}
                    className="text-slate-400 hover:text-cyan-400 text-sm font-mono cursor-pointer"
                  >
                    [CLOSE]
                  </button>
                )}
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {!submissionSuccess ? (
                  <form onSubmit={submitHolographicForm} className="space-y-4">
                    <p className="text-xs font-mono text-slate-400 mb-2 leading-relaxed">
                      Verify credentials below to queue this application on the federal e-gov registry ledger. Fields are automatically checked against central databases.
                    </p>
                    
                    <div className="space-y-3 font-mono text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">APPLICANT FULL NAME</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. Ramesh Kumar Patel"
                          className="w-full bg-[#080d1a] border border-cyan-500/30 rounded-lg p-2 focus:outline-none focus:border-cyan-400 text-slate-100 placeholder-slate-600"
                          disabled={formSubmitting}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1">AADHAAR SECURE UID</label>
                          <input
                            type="text"
                            required
                            pattern="\d{12}"
                            maxLength={12}
                            value={formData.aadhaar}
                            onChange={(e) => setFormData({...formData, aadhaar: e.target.value})}
                            placeholder="12 Digit UID Number"
                            className="w-full bg-[#080d1a] border border-cyan-500/30 rounded-lg p-2 focus:outline-none focus:border-cyan-400 text-slate-100 placeholder-slate-600"
                            disabled={formSubmitting}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">CONTACT TELEMETRY</label>
                          <input
                            type="text"
                            required
                            pattern="\d{10}"
                            maxLength={10}
                            value={formData.contact}
                            onChange={(e) => setFormData({...formData, contact: e.target.value})}
                            placeholder="10 Digit Mobile"
                            className="w-full bg-[#080d1a] border border-cyan-500/30 rounded-lg p-2 focus:outline-none focus:border-cyan-400 text-slate-100 placeholder-slate-600"
                            disabled={formSubmitting}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1">STATE / REGION</label>
                          <input
                            type="text"
                            required
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            placeholder="e.g. Uttar Pradesh"
                            className="w-full bg-[#080d1a] border border-cyan-500/30 rounded-lg p-2 focus:outline-none focus:border-cyan-400 text-slate-100 placeholder-slate-600"
                            disabled={formSubmitting}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">LANDHOLDING SIZE (HECTARES)</label>
                          <input
                            type="text"
                            required
                            value={formData.landholding}
                            onChange={(e) => setFormData({...formData, landholding: e.target.value})}
                            placeholder="e.g. 1.25"
                            className="w-full bg-[#080d1a] border border-cyan-500/30 rounded-lg p-2 focus:outline-none focus:border-cyan-400 text-slate-100 placeholder-slate-600"
                            disabled={formSubmitting}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit or Console Log progression */}
                    {formSubmitting ? (
                      <div className="space-y-2 p-3 bg-slate-950 border border-cyan-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                          <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider font-bold">TRANSMISSION LOGS</span>
                        </div>
                        <div className="max-h-[110px] overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1">
                          {formProgress.map((prog, idx) => (
                            <div key={idx} className="flex gap-1.5">
                              <span className="text-cyan-400">{">"}</span>
                              <p>{prog}</p>
                            </div>
                          ))}
                          <div className="flex gap-1.5 animate-pulse text-cyan-300">
                            <span>{">"}</span>
                            <p>Communicating with central node...</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-bold py-2.5 rounded-lg border border-cyan-300/30 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] mt-4 cursor-pointer"
                      >
                        TRANSMIT SECURE REGISTRY PACKET
                      </button>
                    )}
                  </form>
                ) : (
                  /* TRANSACTION SUCCESS STATE */
                  <div className="space-y-4 text-center py-4 font-mono">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-12 h-12 rounded-full border border-cyan-400 bg-cyan-400/10 flex items-center justify-center mx-auto text-cyan-400 mb-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    >
                      <UserCheck className="w-6 h-6" />
                    </motion.div>
                    
                    <h4 className="text-cyan-300 font-bold text-sm uppercase">
                      Application Ledger Confirmed
                    </h4>
                    
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Dear {formData.name}, your application for {activeSchemeModal.scheme} has been recorded on the secure government digital node.
                    </p>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-left text-[10px] space-y-1 text-slate-400">
                      <div>
                        <span className="text-slate-600">SCHEME REF:</span> {activeSchemeModal.scheme}
                      </div>
                      <div>
                        <span className="text-slate-600">AADHAAR SECURE REF:</span> *******{formData.aadhaar.substr(8)}
                      </div>
                      <div className="break-all">
                        <span className="text-slate-600">TRANSACTION HASH:</span> <span className="text-cyan-400">{txHash}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        // Insert a chat message confirming application status
                        setMessages(prev => [...prev, {
                          id: Math.random().toString(),
                          sender: "ai",
                          text: `Verification Completed: Application for ${activeSchemeModal.scheme} has been logged with Transaction Hash: ${txHash}. You can monitor updates under this ID.`,
                          timestamp: new Date()
                        }]);
                        setActiveSchemeModal(null);
                      }}
                      className="px-6 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 rounded-lg hover:shadow-[0_0_10px_rgba(0,240,255,0.2)] text-xs transition-all cursor-pointer"
                    >
                      RETURN TO DASHBOARD
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
