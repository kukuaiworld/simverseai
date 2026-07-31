"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  Map as MapIcon, Activity, AlertTriangle, ShieldAlert, 
  Wind, Clock, HelpCircle, Layers, CheckCircle, 
  TrendingUp, TrendingDown, Thermometer, ShieldCheck, 
  MapPin, Plus, Play, Cpu, Sparkles, Filter, Info,
  Zap, Droplet, UserCheck, Flame, Compass
} from "lucide-react";

interface CityMapProps {
  onLoadChallenge: (challenge: string) => void;
  latitude: number;
  longitude: number;
  onSetCoordinates: (lat: number, lng: number) => void;
}

// Live Incidents Feed data
const INITIAL_INCIDENTS = [
  { time: "08:45 AM", text: "Arterial road accident reported in Sector Alpha", severity: "high", location: "Downtown Core" },
  { time: "09:10 AM", text: "Traffic congestion increasing near railway line", severity: "medium", location: "Central Hub" },
  { time: "09:35 AM", text: "Emergency medical vehicle dispatched from Sector Delta", severity: "low", location: "Residential West" },
  { time: "09:55 AM", text: "Emergency lane transit normalized", severity: "nominal", location: "Highway corridor" }
];

export default function CityMap({ onLoadChallenge, latitude, longitude, onSetCoordinates }: CityMapProps) {
  
  // Dynamic Leaflet maps controller
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  // Interactive states
  const [selectedLayer, setSelectedLayer] = useState<string>("traffic");
  const [predictionLayer, setPredictionLayer] = useState<"current" | "24h" | "7d" | "30d">("current");
  const [activeScenario, setActiveScenario] = useState<"none" | "A" | "B" | "C">("none");
  const [timeSlider, setTimeSlider] = useState<number>(0); // 0: current, 1: +6h, 2: +12h, 3: +24h, 4: +3d, 5: +7d
  const [activeFilters, setActiveFilters] = useState<string[]>(["traffic", "emergency"]);
  const [activeHeatmap, setActiveHeatmap] = useState<string>("none");
  const [simulatedEvent, setSimulatedEvent] = useState<string>("none");

  // Global search & real city context states
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("Sector Alpha, Core City");
  const [selectedMeta, setSelectedMeta] = useState<any>({
    city: "Bangalore",
    district: "Urban",
    state: "Karnataka",
    country: "India",
    postcode: "560001",
    elevation: "920m",
    timezone: "GMT+5:30"
  });
  const [liveContext, setLiveContext] = useState<any>(null);

  // debounced Nominatim location suggestions lookup
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      setIsSearching(true);
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=5`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(Array.isArray(data) ? data : []);
          setIsSearching(false);
        })
        .catch(err => {
          console.error("Nominatim search failed:", err);
          setIsSearching(false);
        });
    }, 450);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Load contextual data block for current lat/lng safely
  const loadCityContext = async (lat: number, lng: number) => {
    try {
      // 1. Fetch address details dynamically using Nominatim reverse geocode
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
      try {
        const geoRes = await fetch(geoUrl, { headers: { "User-Agent": "SimVerseAI/1.0" } });
        if (geoRes.ok) {
          const geoData = await geoRes.ok ? await geoRes.json() : null;
          if (geoData) {
            setSelectedAddress(geoData.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            const addr = geoData.address || {};
            setSelectedMeta({
              city: addr.city || addr.town || addr.village || addr.suburb || "Metropolitan Zone",
              district: addr.county || "Core District",
              state: addr.state || "Central Territory",
              country: addr.country || "Global Grid",
              postcode: addr.postcode || "000000",
              elevation: "540m",
              timezone: "GMT+5:30"
            });
          }
        }
      } catch (err) {
        console.error("Geocoding fetch failed:", err);
      }

      // 2. Fetch live context from API
      const response = await fetch(`/api/city-context?lat=${lat}&lng=${lng}`);
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        let errMessage = `Error: ${response.status}`;
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errMessage = errData?.error?.message || errData?.detail || errMessage;
        } else {
          errMessage = await response.text();
        }
        console.error("City context fetch error:", errMessage);
        return;
      }
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setLiveContext(data);
      }
    } catch (err) {
      console.error("City context fetch failed:", err);
    }
  };

  useEffect(() => {
    loadCityContext(latitude, longitude);
  }, [latitude, longitude]);

  const handleSelectLocation = (sug: any) => {
    const lat = parseFloat(sug.lat);
    const lng = parseFloat(sug.lon);
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 14, { animate: true, duration: 1.5 });
      
      import("leaflet").then((LModule) => {
        const L = LModule.default;
        if (layerGroupRef.current) {
          layerGroupRef.current.clearLayers();
          L.marker([lat, lng])
            .addTo(layerGroupRef.current)
            .bindPopup(`<b>${sug.display_name}</b>`)
            .openPopup();
        }
      });
    }

    onSetCoordinates(lat, lng);
    setSelectedAddress(sug.display_name);

    const addr = sug.address || {};
    setSelectedMeta({
      city: addr.city || addr.town || addr.village || addr.suburb || "Metropolitan Zone",
      district: addr.county || "Core District",
      state: addr.state || "Central Territory",
      country: addr.country || "Global Grid",
      postcode: addr.postcode || "000000",
      elevation: "840m",
      timezone: "GMT+5:30"
    });
    setSuggestions([]);
    setSearchQuery("");
  };

  // Dynamic Leaflet map initialization
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;
    let map: any = null;

    // Dynamically load Leaflet client-side module to prevent build SSR fails
    import("leaflet").then((LModule) => {
      const L = LModule.default;

      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        // Initialize OpenStreetMap centered dynamically
        map = L.map(mapContainerRef.current).setView([latitude, longitude], 13);
        
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        mapInstanceRef.current = map;
        layerGroupRef.current = L.layerGroup().addTo(map);

        // Initial default traffic layer markers
        L.marker([latitude, longitude])
          .addTo(layerGroupRef.current)
          .bindPopup("<b>Selected Core</b><br>Geocoding layers active.")
          .openPopup();

        // Listen to clicks to geocode selection coordinates dynamically
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          onSetCoordinates(lat, lng);
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`<b>Selected Coordinates</b><br>Latitude: ${lat.toFixed(5)}<br>Longitude: ${lng.toFixed(5)}`)
            .openOn(map);
        });
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Leaflet map pan positions dynamically when coordinates props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([latitude, longitude], 13, { animate: true });
      import("leaflet").then((LModule) => {
        const L = LModule.default;
        if (layerGroupRef.current) {
          layerGroupRef.current.clearLayers();
          L.marker([latitude, longitude])
            .addTo(layerGroupRef.current)
            .bindPopup(`<b>Selected Coordinate Basin</b><br>Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`)
            .openPopup();
        }
      });
    }
  }, [latitude, longitude]);

// Helper to fetch live features from Overpass API around coordinate center
const fetchOverpassData = async (lat: number, lng: number, layer: string) => {
  let query = "";
  if (layer === "hospitals") {
    query = `node(around:2000,${lat},${lng})["amenity"="hospital"];out;`;
  } else if (layer === "schools") {
    query = `node(around:2000,${lat},${lng})["amenity"="school"];out;`;
  } else if (layer === "emergency") {
    query = `node(around:2000,${lat},${lng})["amenity"~"police|fire_station|emergency"];out;`;
  } else if (layer === "power") {
    query = `node(around:2000,${lat},${lng})["power"~"substation|generator|transformer"];out;`;
  } else if (layer === "construction") {
    query = `way(around:2000,${lat},${lng})["landuse"="construction"];out;`;
  }
  if (!query) return [];
  try {
    const res = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];${query}`);
    if (res.ok) {
      const data = await res.json();
      return data.elements || [];
    }
  } catch (err) {
    console.error("Overpass fetch failed:", err);
  }
  return [];
};

  // Reactive layer updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let active = true;

    import("leaflet").then(async (LModule) => {
      const L = LModule.default;

      if (!layerGroupRef.current) {
        layerGroupRef.current = L.layerGroup().addTo(map);
      }
      layerGroupRef.current.clearLayers();

      const timestamp = new Date().toLocaleTimeString();

      const createPopupHtml = (title: string, source: string, severity: string, lat: number, lng: number, desc: string) => {
        let sevColor = "bg-green-100 text-green-800 border-green-200";
        if (severity.toLowerCase() === "critical" || severity.toLowerCase() === "high") {
          sevColor = "bg-red-100 text-red-800 border-red-200";
        } else if (severity.toLowerCase() === "medium") {
          sevColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
        
        return `
          <div class="font-sans text-xs space-y-1 p-1 max-w-xs text-slate-800">
            <div class="font-bold border-b border-slate-100 pb-1 text-sm text-slate-900">${title}</div>
            <div class="text-[10px] text-slate-500 mt-1"><b>Source:</b> ${source}</div>
            <div class="text-[10px] text-slate-500"><b>Timestamp:</b> ${timestamp}</div>
            <div class="text-[10px] text-slate-500"><b>Severity:</b> <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${sevColor}">${severity.toUpperCase()}</span></div>
            <div class="text-[10px] text-slate-500"><b>Coordinates:</b> ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
            <div class="mt-1 text-slate-700 font-sans leading-normal">${desc}</div>
          </div>
        `;
      };

      if (selectedLayer === "traffic") {
        const isOptimized = activeScenario === "A" || activeScenario === "B";
        const color = isOptimized ? "green" : "red";
        const severity = isOptimized ? "nominal" : "high";
        const desc = isOptimized 
          ? "Traffic flow optimized by adaptive smart signaling overlays. Average speed: 45 km/h."
          : "Heavy traffic congestion loop detected near central corridor. Average speed: 12 km/h.";

        const line = L.polyline([
          [latitude - 0.005, longitude - 0.005],
          [latitude + 0.005, longitude + 0.005]
        ], { color, weight: 5 }).addTo(layerGroupRef.current);
        
        line.bindPopup(createPopupHtml("Central Traffic Corridor", "OpenStreetMap / Live Speed Telemetry", severity, latitude, longitude, desc));
        
        if (!isOptimized) {
          L.marker([latitude, longitude])
            .addTo(layerGroupRef.current)
            .bindPopup(createPopupHtml("Bottleneck Alert", "Municipal Loop Sensors", "high", latitude, longitude, "Severe delay segment matching road narrows."))
            .openPopup();
        }
      }

      else if (selectedLayer === "closures") {
        const isOptimized = activeScenario === "B";
        const severity = isOptimized ? "nominal" : "high";
        const desc = isOptimized
          ? "Bypass corridor completed. Road closure resolved."
          : "Corridor blocked completely for civil excavation segment erection. Local detours in place.";
        
        L.marker([latitude + 0.003, longitude - 0.003])
          .addTo(layerGroupRef.current)
          .bindPopup(createPopupHtml("Bridge Closure Segment", "MoRTH Civil Registry", severity, latitude + 0.003, longitude - 0.003, desc))
          .openPopup();
      }

      else if (selectedLayer === "construction") {
        L.polygon([
          [latitude - 0.006, longitude + 0.005],
          [latitude - 0.010, longitude + 0.012],
          [latitude - 0.002, longitude + 0.015]
        ], {
          color: "orange",
          fillColor: "#ffa500",
          fillOpacity: 0.3
        }).addTo(layerGroupRef.current).bindPopup(createPopupHtml(
          "Metro Elevated Line Erection",
          "Smart Cities Mission Planner",
          "medium",
          latitude - 0.006,
          longitude + 0.005,
          "Ongoing elevated concrete girder erection. Speed limit restricted to 20 km/h."
        ));
      }

      else if (selectedLayer === "flood") {
        const rainfall = liveContext?.weather?.rainfall || 0;
        const severity = rainfall > 5 ? "critical" : (rainfall > 1 ? "medium" : "nominal");
        const desc = rainfall > 0 
          ? `Active monsoon runoff detected (${rainfall} mm). Soil saturation capacity exceeded with waterlogging risk.`
          : "No active monsoon waterlogging risk. Soil absorption capacity within safety thresholds.";

        L.circle([latitude + 0.002, longitude - 0.002], {
          color: rainfall > 0 ? "red" : "blue",
          fillColor: rainfall > 0 ? "#ff0000" : "#3080ff",
          fillOpacity: 0.2,
          radius: 500
        }).addTo(layerGroupRef.current).bindPopup(createPopupHtml(
          "Low-Lying Catchment Basin",
          "NDMA Flood Warning System",
          severity,
          latitude + 0.002,
          longitude - 0.002,
          desc
        )).openPopup();
      }

      else if (selectedLayer === "aqi") {
        const aqiVal = liveContext?.air_quality?.aqi || 42;
        let severity = "nominal";
        let color = "green";
        let label = "Satisfactory";
        if (aqiVal > 150) { severity = "critical"; color = "red"; label = "Severe"; }
        else if (aqiVal > 100) { severity = "high"; color = "orange"; label = "Moderate"; }
        else if (aqiVal > 50) { severity = "medium"; color = "yellow"; label = "Poor"; }

        L.circle([latitude, longitude], {
          color: color,
          fillColor: color,
          fillOpacity: 0.25,
          radius: 800
        }).addTo(layerGroupRef.current).bindPopup(createPopupHtml(
          "CPCB Air Quality Zone",
          "CPCB Monitoring Network",
          severity,
          latitude,
          longitude,
          `Dynamic AQI score: ${aqiVal} (${label}). PM2.5: ${liveContext?.air_quality?.pm25 || 22} µg/m³.`
        )).openPopup();
      }

      else if (selectedLayer === "emergency") {
        try {
          const elements = await fetchOverpassData(latitude, longitude, "emergency");
          if (active && elements.length > 0) {
            elements.slice(0, 10).forEach((el: any) => {
              const name = el.tags?.name || "Local Emergency Unit";
              L.marker([el.lat, el.lon])
                .addTo(layerGroupRef.current)
                .bindPopup(createPopupHtml(
                  name,
                  "OpenStreetMap Registry",
                  "nominal",
                  el.lat,
                  el.lon,
                  `Emergency dispatch unit listed under '${el.tags?.amenity || "police"}' tags.`
                ));
            });
          } else {
            L.marker([latitude + 0.004, longitude - 0.004])
              .addTo(layerGroupRef.current)
              .bindPopup(createPopupHtml(
                "District Emergency Head Office",
                "Municipal Disaster Plan",
                "nominal",
                latitude + 0.004,
                longitude - 0.004,
                "Central disaster command station with 12 dispatch units."
              )).openPopup();
          }
        } catch (err) {
          console.error("Emergency render failed:", err);
        }
      }

      else if (selectedLayer === "hospitals") {
        try {
          const elements = await fetchOverpassData(latitude, longitude, "hospitals");
          if (active && elements.length > 0) {
            elements.slice(0, 10).forEach((el: any) => {
              const name = el.tags?.name || "Municipal Hospital";
              L.marker([el.lat, el.lon])
                .addTo(layerGroupRef.current)
                .bindPopup(createPopupHtml(
                  name,
                  "National Health Registry",
                  "nominal",
                  el.lat,
                  el.lon,
                  "Medical facility and emergency triage center fully operational."
                ));
            });
          } else {
            L.marker([latitude - 0.005, longitude + 0.004])
              .addTo(layerGroupRef.current)
              .bindPopup(createPopupHtml(
                "Apex General Hospital",
                "National Health Authority",
                "nominal",
                latitude - 0.005,
                longitude + 0.004,
                "Central tertiary healthcare facility. Emergency beds: 48 available."
              )).openPopup();
          }
        } catch (err) {
          console.error("Hospitals render failed:", err);
        }
      }

      else if (selectedLayer === "schools") {
        try {
          const elements = await fetchOverpassData(latitude, longitude, "schools");
          if (active && elements.length > 0) {
            elements.slice(0, 10).forEach((el: any) => {
              const name = el.tags?.name || "Local Educational Academy";
              L.marker([el.lat, el.lon])
                .addTo(layerGroupRef.current)
                .bindPopup(createPopupHtml(
                  name,
                  "Department of Education",
                  "nominal",
                  el.lat,
                  el.lon,
                  "Educational institution and evacuation shelter hub."
                ));
            });
          } else {
            L.marker([latitude + 0.006, longitude + 0.006])
              .addTo(layerGroupRef.current)
              .bindPopup(createPopupHtml(
                "City Central High School",
                "State Board Registry",
                "nominal",
                latitude + 0.006,
                longitude + 0.006,
                "State educational facility. Serves as active evacuation center during flood alerts."
              )).openPopup();
          }
        } catch (err) {
          console.error("Schools render failed:", err);
        }
      }

      else if (selectedLayer === "power") {
        try {
          const elements = await fetchOverpassData(latitude, longitude, "power");
          if (active && elements.length > 0) {
            elements.slice(0, 10).forEach((el: any) => {
              const name = el.tags?.name || "Grid Substation";
              L.marker([el.lat, el.lon])
                .addTo(layerGroupRef.current)
                .bindPopup(createPopupHtml(
                  name,
                  "State Power Grid",
                  "nominal",
                  el.lat,
                  el.lon,
                  "Local substation. Distribution status: operational."
                ));
            });
          } else {
            L.marker([latitude - 0.006, longitude - 0.006])
              .addTo(layerGroupRef.current)
              .bindPopup(createPopupHtml(
                "Substation Grid Node 12",
                "State Electricity Board",
                "nominal",
                latitude - 0.006,
                longitude - 0.006,
                "Primary distribution transformer. Voltage: 33KV nominal."
              )).openPopup();
          }
        } catch (err) {
          console.error("Power render failed:", err);
        }
      }
    });

    return () => { active = false; };
  }, [selectedLayer, latitude, longitude, activeScenario, predictionLayer, timeSlider, liveContext]);

  // Toggle filter chips
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(prev => prev.filter(f => f !== filter));
    } else {
      setActiveFilters(prev => [...prev, filter]);
    }
  };

  // Convert time slider idx to string
  const timeSliderLabel = useMemo(() => {
    return ["Current", "+6 Hours", "+12 Hours", "+24 Hours", "+3 Days", "+7 Days"][timeSlider];
  }, [timeSlider]);

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600 animate-spin-slow" />
            Smart City Operations Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitor city conditions, visualize AI predictions, and explore scenario impacts in real time.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-4 border border-slate-200 rounded-lg shadow-sm cursor-pointer">
            Change Map Layer
          </button>
          <button className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-4 border border-slate-200 rounded-lg shadow-sm cursor-pointer">
            Export Map
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-sm cursor-pointer">
            Generate Report
          </button>
        </div>
      </div>

      {/* Main Responsive Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Map Controls & Large Map (75% - 3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Map Sandbox Wrapper */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            
            {/* Top map controls */}
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-3">
              {/* Layers List */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Layers:</span>
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: "traffic", label: "Traffic Flow" },
                    { id: "closures", label: "Road Closures" },
                    { id: "flood", label: "Flood Zones" },
                    { id: "construction", label: "Construction" },
                    { id: "emergency", label: "Emergency" },
                    { id: "aqi", label: "Air Quality" },
                    { id: "power", label: "Power Grid" },
                    { id: "hospitals", label: "Hospitals" },
                    { id: "schools", label: "Schools" }
                  ].map((lyr) => (
                    <button
                      key={lyr.id}
                      onClick={() => setSelectedLayer(lyr.id)}
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border transition-all cursor-pointer ${
                        selectedLayer === lyr.id 
                          ? "bg-blue-50 border-blue-600 text-blue-600" 
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {lyr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Predictions */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">AI Forecast:</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[9px] font-mono font-bold">
                  {[
                    { id: "current", label: "Live" },
                    { id: "24h", label: "24h" },
                    { id: "7d", label: "7d" },
                    { id: "30d", label: "30d" }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPredictionLayer(p.id as any)}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        predictionLayer === p.id ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scenario Impact Toggles */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-blue-600" /> Projected Scenario Impact Overrides
              </span>
              
              <div className="flex gap-1.5 font-mono text-[9px] font-bold">
                {[
                  { id: "none", label: "Live Situation" },
                  { id: "A", label: "Scenario A: Smart Signals" },
                  { id: "B", label: "Scenario B: Road Expansion" },
                  { id: "C", label: "Scenario C: Transit Opt." }
                ].map((scen) => (
                  <button
                    key={scen.id}
                    onClick={() => setActiveScenario(scen.id as any)}
                    className={`px-2.5 py-1 rounded border transition-all cursor-pointer ${
                      activeScenario === scen.id 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {scen.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Global Search Input */}
            <div className="relative w-full z-20">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cities, roads, landmarks, addresses globally..."
                    className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2.5 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-sans text-slate-800"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4.5 w-4.5 border-b-2 border-blue-600" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Autocomplete Dropdown suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectLocation(sug)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs text-slate-700 font-sans transition-colors block truncate"
                    >
                      {sug.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Large Interactive Leaflet Map */}
            <div ref={mapContainerRef} className="h-96 w-full border border-slate-200 rounded-xl relative overflow-hidden z-10" />

            {/* Time Slider */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Interactive Forecast Timeline
                </span>
                <span className="text-blue-600 font-bold">{timeSliderLabel} Projection</span>
              </div>
              
              <input 
                type="range" 
                min="0" 
                max="5" 
                value={timeSlider}
                onChange={(e) => setTimeSlider(parseInt(e.target.value))}
                className="w-full accent-blue-600 h-1 bg-slate-200 rounded-lg cursor-pointer border border-slate-300"
              />
              
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>Current</span>
                <span>+6h</span>
                <span>+12h</span>
                <span>+24h</span>
                <span>+3 Days</span>
                <span>+7 Days</span>
              </div>
            </div>

            {/* Heatmaps selection bar */}
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="font-mono text-slate-400 font-bold uppercase text-[9px]">Heatmaps overlays:</span>
              {[
                { id: "density", label: "Traffic Density" },
                { id: "pollution", label: "Pollution" },
                { id: "population", label: "Population" },
                { id: "accidents", label: "Accidents" },
                { id: "flood", label: "Flood Risk" },
                { id: "noise", label: "Noise Levels" }
              ].map((hm) => (
                <button
                  key={hm.id}
                  onClick={() => setActiveHeatmap(activeHeatmap === hm.id ? "none" : hm.id)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border transition-all cursor-pointer ${
                    activeHeatmap === hm.id 
                      ? "bg-orange-50 border-orange-500 text-orange-600" 
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {hm.label}
                </button>
              ))}
            </div>

          </div>

          {/* Quick simulation sandbox & AI recommendation panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Quick Simulation controls */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Trigger Tactical Scenarios</h3>
                <p className="text-[10px] text-slate-500">Inject immediate incidents to inspect model shifts</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[9px] font-bold">
                {[
                  { id: "closure", label: "Road Closure" },
                  { id: "heavy_rain", label: "Heavy Rain" },
                  { id: "festival", label: "Festival Event" },
                  { id: "power", label: "Power Failure" },
                  { id: "metro", label: "Metro Delay" },
                  { id: "accident", label: "Accident" },
                  { id: "evacuation", label: "Emergency Evac" }
                ].map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSimulatedEvent(simulatedEvent === event.id ? "none" : event.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      simulatedEvent === event.id 
                        ? "bg-red-50 border-red-600 text-red-600" 
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    {event.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Recommendation panel below map */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-blue-600 font-bold uppercase tracking-widest">AI Action Recommendation</span>
                <h4 className="font-bold text-slate-900 text-sm">Optimize traffic signal timings at Junction A</h4>
                
                <p className="text-xs text-slate-500 leading-normal">
                  Reduces queue loops by adjusting optical interval cycles directly over the high priority corridor.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 font-mono text-center">
                <div>
                  <span className="text-[8px] text-slate-400 block uppercase">Est. Reduction</span>
                  <span className="text-xs font-bold text-slate-800">18% congestion</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 block uppercase">Certainty</span>
                  <span className="text-xs font-bold text-blue-600">91% score</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 block uppercase">Setup Time</span>
                  <span className="text-xs font-bold text-slate-800">2 Weeks</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Information & Live Analytics panel (25% - 1 col) */}
        <div className="space-y-6">
          
          {/* Smart filters chips */}
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-blue-600" /> Focus Filters
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["traffic", "infrastructure", "environment", "healthcare", "emergency", "utilities", "education", "safety"].map((chip) => {
                const isActive = activeFilters.includes(chip);
                return (
                  <button
                    key={chip}
                    onClick={() => toggleFilter(chip)}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border transition-all cursor-pointer ${
                      isActive 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live City Snapshot Panel */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 animate-pulse" /> Live City Snapshot
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-600 leading-normal font-sans">
                <span className="font-bold text-slate-900 block mb-0.5">📍 Selected Address</span>
                {selectedAddress}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-slate-50/50 p-2 rounded border border-slate-100">
                  <span className="text-slate-400 block uppercase text-[8px]">Latitude</span>
                  <span className="font-bold text-slate-700">{latitude.toFixed(5)}</span>
                </div>
                <div className="bg-slate-50/50 p-2 rounded border border-slate-100">
                  <span className="text-slate-400 block uppercase text-[8px]">Longitude</span>
                  <span className="font-bold text-slate-700">{longitude.toFixed(5)}</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-500 font-mono text-[10px]">Administrative Zone</span>
                  <span className="font-bold text-slate-800">{liveContext?.population?.zone || "Central Hub"}</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-500 font-mono text-[10px]">Population Estimate</span>
                  <span className="font-bold text-slate-800">{(liveContext?.population?.population || 185000).toLocaleString()} citizens</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-500 font-mono text-[10px]">Density (sq/km)</span>
                  <span className="font-bold text-slate-800">{(liveContext?.population?.density || 11200).toLocaleString()}/km²</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-500 font-mono text-[10px]">Elevation</span>
                  <span className="font-bold text-slate-800">{selectedMeta.elevation}</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-500 font-mono text-[10px]">Timezone</span>
                  <span className="font-bold text-slate-800">{selectedMeta.timezone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current status cards group */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Operational Telemetry</h3>
            
            <div className="space-y-3">
              {/* Traffic status */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">Traffic status</span>
                <span className="font-bold text-slate-800">NOMINAL (Historical)</span>
              </div>

              {/* Weather info */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">Temperature</span>
                <span className="font-bold text-blue-600">{liveContext?.weather?.temperature || 24.5}°C</span>
              </div>

              {/* Rain */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">Rain Probability</span>
                <span className="font-bold text-slate-800">{liveContext?.weather?.rain_probability || 35}%</span>
              </div>

              {/* AQI */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">Air Quality</span>
                <span className={`font-bold ${
                  (liveContext?.air_quality?.aqi || 42) > 100 ? "text-red-600" :
                  (liveContext?.air_quality?.aqi || 42) > 50 ? "text-orange-600" : "text-green-600"
                }`}>{liveContext?.air_quality?.aqi || 42} AQI</span>
              </div>

              {/* Hospitals count */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">Nearby Hospitals</span>
                <span className="font-bold text-slate-800">{liveContext?.infrastructure?.hospitals || 2} Units</span>
              </div>

              {/* Schools count */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">Nearby Schools</span>
                <span className="font-bold text-slate-800">{liveContext?.infrastructure?.schools || 3} Units</span>
              </div>
            </div>
          </div>

          {/* Incident Feed Activity timeline */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Incident Feed</h3>
            
            <div className="space-y-4 font-mono text-[10px]">
              {INITIAL_INCIDENTS.map((inc, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="text-slate-400 shrink-0">{inc.time}</span>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-bold uppercase mr-1.5 ${
                      inc.severity === "high" ? "bg-red-50 text-red-700" :
                      inc.severity === "medium" ? "bg-orange-50 text-orange-700" :
                      inc.severity === "low" ? "bg-blue-50 text-blue-700" :
                      "bg-green-50 text-green-700"
                    }`}>
                      {inc.severity}
                    </span>
                    <p className="text-slate-600 mt-1 font-sans text-xs leading-normal">{inc.text}</p>
                    <span className="text-slate-400 text-[9px] block mt-0.5">{inc.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live AI Insights ticker */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Continuous AI Insights</h3>
              <p className="text-[9px] text-slate-400">Pulsing telemetry logs</p>
            </div>

            <div className="space-y-3 font-sans text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="font-bold text-blue-600 font-mono text-[9px] uppercase">94% Cert • HIGH Priority</span>
                <p>Heavy congestion detected near City Center grid routes.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <span className="font-bold text-slate-500 font-mono text-[9px] uppercase">88% Cert • Medium Priority</span>
                <p>Flood probability increasing in Zone 3 near bay basins.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Analytics summary KPIs footer */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-sm font-mono text-center">
        <div>
          <span className="text-[8px] text-slate-400 block uppercase">Traffic Index</span>
          <span className="text-sm font-bold text-slate-800">142 AQI</span>
        </div>
        <div>
          <span className="text-[8px] text-slate-400 block uppercase">Response Time</span>
          <span className="text-sm font-bold text-slate-800">8.4 mins</span>
        </div>
        <div>
          <span className="text-[8px] text-slate-400 block uppercase">Average AQI</span>
          <span className="text-sm font-bold text-slate-800">62 ppm</span>
        </div>
        <div>
          <span className="text-[8px] text-slate-400 block uppercase">Road Utilization</span>
          <span className="text-sm font-bold text-slate-800">74% cap</span>
        </div>
        <div>
          <span className="text-[8px] text-slate-400 block uppercase">Transit Efficiency</span>
          <span className="text-sm font-bold text-slate-800">92% score</span>
        </div>
        <div>
          <span className="text-[8px] text-slate-400 block uppercase">Mobility Index</span>
          <span className="text-sm font-bold text-slate-800">88.5 pt</span>
        </div>
      </div>

    </div>
  );
}
