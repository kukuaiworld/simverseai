"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Heart, Sparkles, Shield, User, Search, 
  RefreshCw, BarChart2, FileText, ChevronRight, 
  Flame, Dumbbell, AlertTriangle, CheckCircle2, TrendingUp
} from "lucide-react";

// Mock subset of the first 30 patient records for the Dataset Explorer
const patientSubset = [
  { Patient_ID: 1, Age: 42, Gender: "Female", BMI: 22.8, Systolic_BP: 128, Diastolic_BP: 80, Cholesterol: 210, Exercise_Hours_Wk: 6.5, Smoking_Status: "Non-smoker", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 2, Age: 65, Gender: "Male", BMI: 28.4, Systolic_BP: 148, Diastolic_BP: 92, Cholesterol: 265, Exercise_Hours_Wk: 2.0, Smoking_Status: "Current", Diabetic: 1, Heart_Disease: 1 },
  { Patient_ID: 3, Age: 38, Gender: "Female", BMI: 24.1, Systolic_BP: 120, Diastolic_BP: 78, Cholesterol: 195, Exercise_Hours_Wk: 8.5, Smoking_Status: "Non-smoker", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 4, Age: 52, Gender: "Male", BMI: 31.2, Systolic_BP: 154, Diastolic_BP: 96, Cholesterol: 280, Exercise_Hours_Wk: 1.5, Smoking_Status: "Former", Diabetic: 1, Heart_Disease: 1 },
  { Patient_ID: 5, Age: 71, Gender: "Female", BMI: 26.5, Systolic_BP: 160, Diastolic_BP: 90, Cholesterol: 295, Exercise_Hours_Wk: 3.0, Smoking_Status: "Non-smoker", Diabetic: 1, Heart_Disease: 1 },
  { Patient_ID: 6, Age: 29, Gender: "Male", BMI: 21.0, Systolic_BP: 115, Diastolic_BP: 72, Cholesterol: 180, Exercise_Hours_Wk: 10.0, Smoking_Status: "Non-smoker", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 7, Age: 48, Gender: "Female", BMI: 29.7, Systolic_BP: 138, Diastolic_BP: 86, Cholesterol: 245, Exercise_Hours_Wk: 4.5, Smoking_Status: "Former", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 8, Age: 58, Gender: "Male", BMI: 27.2, Systolic_BP: 142, Diastolic_BP: 88, Cholesterol: 250, Exercise_Hours_Wk: 5.0, Smoking_Status: "Current", Diabetic: 0, Heart_Disease: 1 },
  { Patient_ID: 9, Age: 31, Gender: "Female", BMI: 23.4, Systolic_BP: 122, Diastolic_BP: 76, Cholesterol: 190, Exercise_Hours_Wk: 7.0, Smoking_Status: "Non-smoker", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 10, Age: 67, Gender: "Female", BMI: 33.1, Systolic_BP: 165, Diastolic_BP: 98, Cholesterol: 310, Exercise_Hours_Wk: 0.5, Smoking_Status: "Current", Diabetic: 1, Heart_Disease: 1 },
  { Patient_ID: 11, Age: 45, Gender: "Male", BMI: 25.8, Systolic_BP: 132, Diastolic_BP: 82, Cholesterol: 225, Exercise_Hours_Wk: 6.0, Smoking_Status: "Non-smoker", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 12, Age: 50, Gender: "Female", BMI: 26.9, Systolic_BP: 136, Diastolic_BP: 84, Cholesterol: 235, Exercise_Hours_Wk: 5.5, Smoking_Status: "Former", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 13, Age: 61, Gender: "Male", BMI: 30.5, Systolic_BP: 152, Diastolic_BP: 92, Cholesterol: 270, Exercise_Hours_Wk: 2.5, Smoking_Status: "Current", Diabetic: 1, Heart_Disease: 1 },
  { Patient_ID: 14, Age: 34, Gender: "Female", BMI: 20.3, Systolic_BP: 118, Diastolic_BP: 74, Cholesterol: 175, Exercise_Hours_Wk: 9.0, Smoking_Status: "Non-smoker", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 15, Age: 55, Gender: "Male", BMI: 28.9, Systolic_BP: 144, Diastolic_BP: 90, Cholesterol: 255, Exercise_Hours_Wk: 4.0, Smoking_Status: "Former", Diabetic: 0, Heart_Disease: 1 },
  { Patient_ID: 16, Age: 40, Gender: "Female", BMI: 25.2, Systolic_BP: 130, Diastolic_BP: 80, Cholesterol: 215, Exercise_Hours_Wk: 6.0, Smoking_Status: "Non-smoker", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 17, Age: 73, Gender: "Male", BMI: 27.6, Systolic_BP: 162, Diastolic_BP: 94, Cholesterol: 300, Exercise_Hours_Wk: 1.0, Smoking_Status: "Current", Diabetic: 1, Heart_Disease: 1 },
  { Patient_ID: 18, Age: 27, Gender: "Female", BMI: 22.0, Systolic_BP: 112, Diastolic_BP: 70, Cholesterol: 185, Exercise_Hours_Wk: 11.5, Smoking_Status: "Non-smoker", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 19, Age: 49, Gender: "Male", BMI: 29.2, Systolic_BP: 140, Diastolic_BP: 86, Cholesterol: 248, Exercise_Hours_Wk: 5.0, Smoking_Status: "Former", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 20, Age: 56, Gender: "Female", BMI: 32.4, Systolic_BP: 156, Diastolic_BP: 94, Cholesterol: 290, Exercise_Hours_Wk: 2.0, Smoking_Status: "Current", Diabetic: 1, Heart_Disease: 1 },
  { Patient_ID: 21, Age: 43, Gender: "Male", BMI: 24.7, Systolic_BP: 126, Diastolic_BP: 80, Cholesterol: 212, Exercise_Hours_Wk: 7.0, Smoking_Status: "Non-smoker", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 22, Age: 60, Gender: "Female", BMI: 28.0, Systolic_BP: 146, Diastolic_BP: 90, Cholesterol: 260, Exercise_Hours_Wk: 3.5, Smoking_Status: "Former", Diabetic: 0, Heart_Disease: 1 },
  { Patient_ID: 23, Age: 36, Gender: "Male", BMI: 23.9, Systolic_BP: 124, Diastolic_BP: 78, Cholesterol: 202, Exercise_Hours_Wk: 8.0, Smoking_Status: "Non-smoker", Diabetic: 0, Heart_Disease: 0 },
  { Patient_ID: 24, Age: 54, Gender: "Female", BMI: 30.1, Systolic_BP: 148, Diastolic_BP: 90, Cholesterol: 275, Exercise_Hours_Wk: 2.2, Smoking_Status: "Current", Diabetic: 1, Heart_Disease: 1 },
  { Patient_ID: 25, Age: 66, Gender: "Male", BMI: 26.2, Systolic_BP: 150, Diastolic_BP: 92, Cholesterol: 285, Exercise_Hours_Wk: 3.0, Smoking_Status: "Non-smoker", Diabetic: 1, Heart_Disease: 1 }
];

export default function HealthEDADashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "predictor" | "visualizations" | "dataset">("overview");

  // Predictor form state
  const [predAge, setPredAge] = useState(50);
  const [predBMI, setPredBMI] = useState(25.0);
  const [predSystolicBP, setPredSystolicBP] = useState(130);
  const [predCholesterol, setPredCholesterol] = useState(220);
  const [predSmoking, setPredSmoking] = useState<"Non-smoker" | "Former" | "Current">("Non-smoker");
  const [predExercise, setPredExercise] = useState(5.0);

  // Filter state for explorer
  const [searchId, setSearchId] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [diseaseFilter, setDiseaseFilter] = useState("All");

  // Selected visualization modal
  const [selectedViz, setSelectedViz] = useState<string | null>(null);

  // Real-time logistic regression predictions based on generated parameters
  const predictions = useMemo(() => {
    // 1. Diabetes Probability
    // z = -6.5 + 0.04 * Age + 0.12 * BMI - 0.15 * Exercise
    const zDiab = -6.5 + 0.04 * predAge + 0.12 * predBMI - 0.15 * predExercise;
    const probDiab = 1.0 / (1.0 + Math.exp(-zDiab));

    // 2. Heart Disease Probability
    // z = -9.0 + 0.055 * Age + 0.02 * Systolic_BP + 0.008 * Cholesterol + 1.2 * Smoking_numeric - 0.1 * Exercise
    const smokingVal = predSmoking === "Current" ? 1.0 : predSmoking === "Former" ? 0.5 : 0.0;
    const zHeart = -9.0 + 0.055 * predAge + 0.02 * predSystolicBP + 0.008 * predCholesterol + 1.2 * smokingVal - 0.1 * predExercise;
    const probHeart = 1.0 / (1.0 + Math.exp(-zHeart));

    return {
      diabetesRisk: Math.min(Math.max(probDiab * 100, 0), 100),
      heartRisk: Math.min(Math.max(probHeart * 100, 0), 100)
    };
  }, [predAge, predBMI, predSystolicBP, predCholesterol, predSmoking, predExercise]);

  // Filtered dataset records
  const filteredPatients = useMemo(() => {
    return patientSubset.filter(p => {
      const matchesSearch = searchId ? p.Patient_ID.toString() === searchId.trim() : true;
      const matchesGender = genderFilter === "All" ? true : p.Gender === genderFilter;
      const matchesDisease = diseaseFilter === "All" ? true :
                             diseaseFilter === "Diabetic" ? p.Diabetic === 1 :
                             diseaseFilter === "Heart Disease" ? p.Heart_Disease === 1 :
                             diseaseFilter === "Healthy" ? (p.Diabetic === 0 && p.Heart_Disease === 0) : true;
      return matchesSearch && matchesGender && matchesDisease;
    });
  }, [searchId, genderFilter, diseaseFilter]);

  const visualizations = [
    {
      id: "distributions",
      title: "BMI, Blood Pressure & Cholesterol Distributions",
      path: "/visualizations/distributions.png",
      desc: "Histograms and boxplots validating univariate data spreads. Highlighting right-skewed BMI profile indicating presence of obese clinical subclasses, and symmetric age/BP populations."
    },
    {
      id: "scatterplots",
      title: "Bivariate Trends vs. Disease Outcomes",
      path: "/visualizations/scatterplots.png",
      desc: "Bivariate regression scatterplots illustrating strong linear associations between BMI vs. Blood Pressure, and Age vs. Cholesterol, color-coded by diabetic and coronary disease status."
    },
    {
      id: "correlation_heatmap",
      title: "Pearson & Spearman Correlation Heatmap",
      path: "/visualizations/correlation_heatmap.png",
      desc: "Comparative heatmaps revealing tight linear and rank relationships (Age and Systolic BP: r = 0.65; Age and Cholesterol: r = 0.68) and active physical protection parameters."
    },
    {
      id: "categorical_associations",
      title: "Disease Incidence rates by Smoking Status",
      path: "/visualizations/categorical_associations.png",
      desc: "Prevalence rates comparison proving elevated diabetic (18%) and coronary (35%+) incidence rates in current active smokers compared to non-smokers."
    }
  ];

  return (
    <div className="relative min-h-screen font-sans text-slate-200 overflow-x-hidden selection:bg-cyan-500/30">
      {/* Visual Design Elements */}
      <div className="holo-grid opacity-60"></div>
      <div className="holo-radial"></div>
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-rose-600/10 blur-[130px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Dashboard Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-cyan-500/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/20 text-cyan-400">
                <Activity className="w-6 h-6 animate-pulse" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Clinical Data Analytics</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              Health Indicators EDA
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl">
              Exploratory Data Analysis and Real-Time Risk Profiling Dashboard of 1,000 Patient Records.
            </p>
          </div>
          
          <div className="flex gap-3">
            <a 
              href="/health_eda_report.md" 
              download
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition duration-200"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              Download Report
            </a>
          </div>
        </header>

        {/* Highlight Stats Panels */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Cohort Sample Size", val: "1,000", sub: "Patients Profiled", border: "border-cyan-500/20", text: "text-cyan-400" },
            { label: "Heart Disease Rate", val: "25.6%", sub: "256 Diagnosed Cases", border: "border-rose-500/20", text: "text-rose-400" },
            { label: "Diabetes Prevalence", val: "11.5%", sub: "115 Diagnosed Cases", border: "border-amber-500/20", text: "text-amber-400" },
            { label: "Avg Physical Activity", val: "5.6 hrs/wk", sub: "Active Lifestyle Factor", border: "border-emerald-500/20", text: "text-emerald-400" }
          ].map((stat, i) => (
            <div key={i} className={`p-5 rounded-xl bg-slate-900/60 backdrop-blur-md border ${stat.border} hover:-translate-y-1 transition duration-300`}>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">{stat.label}</p>
              <p className={`text-2xl md:text-3xl font-black ${stat.text} tracking-tight`}>{stat.val}</p>
              <p className="text-[10px] text-slate-500 mt-1">{stat.sub}</p>
            </div>
          ))}
        </section>

        {/* Tabs Bar */}
        <div className="flex overflow-x-auto gap-2 p-1 rounded-xl bg-slate-900/80 border border-slate-800 mb-8 backdrop-blur-md">
          {[
            { id: "overview", label: "Executive Summary", icon: FileText },
            { id: "predictor", label: "Interactive Risk Calculator", icon: Heart },
            { id: "visualizations", label: "Exploratory Charts", icon: BarChart2 },
            { id: "dataset", label: "Cohort Explorer", icon: User }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <main className="min-h-[400px]">
          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === "overview" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Key Analytical Insights
                  </h2>
                  <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                    <p>
                      <strong>1. Dominance of Age-Related Shifts:</strong> Exploratory correlation analyses reveal that 
                      <strong> Age</strong> exhibits a strong positive relationship with blood lipids (Cholesterol: $r = 0.678$) 
                      and Systolic Blood Pressure ($r = 0.648$). Age operates as a core metabolic driver.
                    </p>
                    <p>
                      <strong>2. Synergy of Smoking Behaviours:</strong> Current smokers display a 
                      <strong> Diabetes rate of 18.2%</strong> and a 
                      <strong> Heart Disease prevalence of 35.8%</strong>, compared to just 8.1% and 18.5% in non-smokers. 
                      Non-smoking serves as the single strongest modifiable protective baseline against coronary complications.
                    </p>
                    <p>
                      <strong>3. Blood Pressure Mediation:</strong> Standardized regression indicates that while BMI and 
                      Cholesterol have modest direct associations with heart disease, their impact is heavily mediated 
                      through Systolic Blood Pressure. Controlling hypertension (Systolic BP &lt; 140 mmHg) cuts heart disease likelihood by <strong>50%</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
                  <h3 className="text-lg font-bold text-white mb-4">Continuous Clinical Indicators (Descriptive Stats)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2.5">Indicator</th>
                          <th className="py-2.5">Mean</th>
                          <th className="py-2.5">Median</th>
                          <th className="py-2.5">Std Dev</th>
                          <th className="py-2.5">Skewness</th>
                          <th className="py-2.5">Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-slate-300">
                        <tr>
                          <td className="py-3 font-semibold">Age (Years)</td>
                          <td className="py-3">50.68</td>
                          <td className="py-3">50.00</td>
                          <td className="py-3">19.78</td>
                          <td className="py-3">0.001</td>
                          <td className="py-3">18.0 - 84.0</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold">BMI (kg/m²)</td>
                          <td className="py-3">25.54</td>
                          <td className="py-3">24.98</td>
                          <td className="py-3">3.60</td>
                          <td className="py-3 text-amber-400">3.161 (Right Skew)</td>
                          <td className="py-3">19.0 - 60.0</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold">Systolic BP (mmHg)</td>
                          <td className="py-3">142.33</td>
                          <td className="py-3">142.33</td>
                          <td className="py-3">11.43</td>
                          <td className="py-3">0.051</td>
                          <td className="py-3">108.2 - 177.7</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold">Diastolic BP (mmHg)</td>
                          <td className="py-3">86.28</td>
                          <td className="py-3">86.48</td>
                          <td className="py-3">8.21</td>
                          <td className="py-3">-0.106</td>
                          <td className="py-3">57.3 - 111.7</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold">Cholesterol (mg/dL)</td>
                          <td className="py-3">239.73</td>
                          <td className="py-3">239.97</td>
                          <td className="py-3">32.24</td>
                          <td className="py-3">0.743</td>
                          <td className="py-3">159.4 - 450.0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Sidebar stats */}
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Causal Predictor Ranking
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold mb-2">Diabetes Risk Factors (Odds Ratio)</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span>Age (per SD)</span>
                          <span className="font-bold text-rose-400">2.44x Risk</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>BMI (per SD)</span>
                          <span className="font-bold text-amber-400">1.17x Risk</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "50%" }}></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>Exercise (per SD)</span>
                          <span className="font-semibold text-emerald-400">0.81x (Protective)</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "35%" }}></div>
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-800/60 my-4" />

                    <div>
                      <p className="text-xs text-slate-400 font-semibold mb-2">Heart Disease Risk Factors</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span>Age (per SD)</span>
                          <span className="font-bold text-rose-400">2.97x Risk</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "95%" }}></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>Systolic BP (per SD)</span>
                          <span className="font-bold text-rose-400">1.50x Risk</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: "70%" }}></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>Non-smoker (protective)</span>
                          <span className="font-semibold text-emerald-400">0.47x (Protective)</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: INTERACTIVE RISK CALCULATOR */}
          {activeTab === "predictor" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Form Input */}
              <div className="lg:col-span-7 p-6 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">Interactive Risk Parameter Input</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div className="space-y-2">
                    <label className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Age (Years)</span>
                      <span className="text-cyan-400">{predAge} yr</span>
                    </label>
                    <input 
                      type="range" min="18" max="85" value={predAge} 
                      onChange={(e) => setPredAge(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>18</span>
                      <span>85</span>
                    </div>
                  </div>

                  {/* BMI */}
                  <div className="space-y-2">
                    <label className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>BMI (Body Mass Index)</span>
                      <span className="text-cyan-400">{predBMI.toFixed(1)} kg/m²</span>
                    </label>
                    <input 
                      type="range" min="15" max="45" step="0.5" value={predBMI} 
                      onChange={(e) => setPredBMI(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>15.0 (Lean)</span>
                      <span>45.0 (Obese)</span>
                    </div>
                  </div>

                  {/* Systolic BP */}
                  <div className="space-y-2">
                    <label className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Systolic BP (mmHg)</span>
                      <span className="text-cyan-400">{predSystolicBP} mmHg</span>
                    </label>
                    <input 
                      type="range" min="90" max="200" value={predSystolicBP} 
                      onChange={(e) => setPredSystolicBP(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>90 (Normal)</span>
                      <span>200 (Stage-3 HBP)</span>
                    </div>
                  </div>

                  {/* Cholesterol */}
                  <div className="space-y-2">
                    <label className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Cholesterol (mg/dL)</span>
                      <span className="text-cyan-400">{predCholesterol} mg/dL</span>
                    </label>
                    <input 
                      type="range" min="120" max="400" value={predCholesterol} 
                      onChange={(e) => setPredCholesterol(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>120 (Optimal)</span>
                      <span>400 (High)</span>
                    </div>
                  </div>

                  {/* Exercise Hours */}
                  <div className="space-y-2">
                    <label className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>Exercise Hours / Week</span>
                      <span className="text-cyan-400">{predExercise.toFixed(1)} hrs</span>
                    </label>
                    <input 
                      type="range" min="0" max="20" step="0.5" value={predExercise} 
                      onChange={(e) => setPredExercise(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0.0 (Sedentary)</span>
                      <span>20.0 (High Athlete)</span>
                    </div>
                  </div>

                  {/* Smoking Status */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Smoking Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Non-smoker", "Former", "Current"] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => setPredSmoking(status)}
                          className={`py-2 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                            predSmoking === status 
                              ? "bg-cyan-500/15 border-cyan-500 text-cyan-400" 
                              : "border-slate-800 bg-slate-900/30 text-slate-400 hover:text-white"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Predictions Display */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-md flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      Calculated Outcome Risk Profiles
                    </h3>
                    
                    {/* Diabetes Meter */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Diabetes Risk Probability</span>
                        <span className={predictions.diabetesRisk > 40 ? "text-amber-400" : predictions.diabetesRisk > 70 ? "text-rose-400" : "text-cyan-400"}>
                          {predictions.diabetesRisk.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            predictions.diabetesRisk > 60 ? "bg-rose-500" : predictions.diabetesRisk > 30 ? "bg-amber-500" : "bg-cyan-500"
                          }`} 
                          style={{ width: `${predictions.diabetesRisk}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Heart Disease Meter */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Heart Disease Risk Probability</span>
                        <span className={predictions.heartRisk > 40 ? "text-amber-400" : predictions.heartRisk > 70 ? "text-rose-400" : "text-cyan-400"}>
                          {predictions.heartRisk.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            predictions.heartRisk > 60 ? "bg-rose-500" : predictions.heartRisk > 30 ? "bg-amber-500" : "bg-cyan-500"
                          }`} 
                          style={{ width: `${predictions.heartRisk}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Block */}
                  <div className="mt-8 p-4 rounded-lg bg-slate-800/40 border border-slate-700/30 flex items-start gap-3">
                    {predictions.heartRisk > 50 || predictions.diabetesRisk > 50 ? (
                      <>
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">Elevated Risk Alert</p>
                          <p className="text-slate-300 text-xs mt-1">
                            {predSmoking === "Current" && "• Quitting smoking can cut your heart disease risk in half. "}
                            {predExercise < 3.0 && "• Increasing exercise to 4 hours per week will reduce diabetes risk. "}
                            {predSystolicBP > 140 && "• Seek clinical pathways to bring Systolic BP below 135 mmHg."}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Optimal Baseline</p>
                          <p className="text-slate-300 text-xs mt-1">
                            Patient metrics sit inside low-risk thresholds. Continue regular cardiorespiratory activities and balanced dietary guidelines.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: EXPLORATORY CHARTS */}
          {activeTab === "visualizations" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visualizations.map((viz) => (
                  <div 
                    key={viz.id} 
                    onClick={() => setSelectedViz(viz.id)}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-cyan-500/30 cursor-pointer group transition duration-300"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4 aspect-video border border-slate-800 bg-slate-950">
                      <img 
                        src={viz.path} 
                        alt={viz.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500" 
                      />
                      <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition duration-300"></div>
                    </div>
                    <h3 className="text-md font-bold text-white mb-2 group-hover:text-cyan-400 transition">{viz.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{viz.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: COHORT EXPLORER */}
          {activeTab === "dataset" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-6"
            >
              {/* Filter controls */}
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/4 space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Search Patient ID</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. 5, 23..." 
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="w-full py-2.5 pl-9 pr-4 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="w-full md:w-1/4 space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gender</label>
                  <select 
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="w-full py-2.5 px-3 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="All">All Genders</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="w-full md:w-1/4 space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Clinical Status</label>
                  <select 
                    value={diseaseFilter}
                    onChange={(e) => setDiseaseFilter(e.target.value)}
                    className="w-full py-2.5 px-3 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="All">All Cohort</option>
                    <option value="Diabetic">Diabetics only</option>
                    <option value="Heart Disease">Heart Disease only</option>
                    <option value="Healthy">Healthy (No diabetes & heart disease)</option>
                  </select>
                </div>

                <button 
                  onClick={() => { setSearchId(""); setGenderFilter("All"); setDiseaseFilter("All"); }}
                  className="px-4 py-2.5 bg-slate-800 text-xs font-semibold rounded-lg border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-slate-800/60 rounded-lg">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Age</th>
                      <th className="py-3 px-4">Gender</th>
                      <th className="py-3 px-4">BMI</th>
                      <th className="py-3 px-4">BP (Sys/Dia)</th>
                      <th className="py-3 px-4">Cholesterol</th>
                      <th className="py-3 px-4">Exercise</th>
                      <th className="py-3 px-4">Smoking</th>
                      <th className="py-3 px-4">Diabetes</th>
                      <th className="py-3 px-4">Heart Disease</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map(p => (
                        <tr key={p.Patient_ID} className="hover:bg-slate-800/20">
                          <td className="py-3 px-4 font-bold text-cyan-400">#{p.Patient_ID}</td>
                          <td className="py-3 px-4">{p.Age}</td>
                          <td className="py-3 px-4">{p.Gender}</td>
                          <td className="py-3 px-4">{p.BMI.toFixed(1)}</td>
                          <td className="py-3 px-4">{p.Systolic_BP}/{p.Diastolic_BP}</td>
                          <td className="py-3 px-4">{p.Cholesterol}</td>
                          <td className="py-3 px-4">{p.Exercise_Hours_Wk} h/wk</td>
                          <td className="py-3 px-4">{p.Smoking_Status}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              p.Diabetic === 1 ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-500"
                            }`}>
                              {p.Diabetic === 1 ? "Diabetic" : "Negative"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              p.Heart_Disease === 1 ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" : "bg-slate-800 text-slate-500"
                            }`}>
                              {p.Heart_Disease === 1 ? "Positive" : "Negative"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-500 text-sm">
                          No matching patient records found in explorer.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Image Modal Lightbox */}
      <AnimatePresence>
        {selectedViz && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSelectedViz(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            {visualizations.filter(v => v.id === selectedViz).map(v => (
              <motion.div 
                key={v.id}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 cursor-default"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{v.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{v.desc}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedViz(null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video">
                  <img src={v.path} alt={v.title} className="w-full h-full object-contain" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
