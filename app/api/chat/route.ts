/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, image, mimeType } = body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    const isApiKeyConfigured = apiKey && apiKey !== "your_api_key_here";
    
    // Fallback simulation for demonstration if API key is not configured
    if (!isApiKeyConfigured) {
      console.warn("GEMINI_API_KEY is not set. Running in holographic simulator mode.");
      
      // Simulate image analysis if image is provided
      if (image) {
        const lowerMessage = message?.toLowerCase() || "";
        const isNonCivicSimulated = image.includes("non-civic") || image.includes("person") || image.includes("pet") || lowerMessage.includes("person") || lowerMessage.includes("pet") || lowerMessage.includes("non-civic");
        
        if (isNonCivicSimulated) {
          return NextResponse.json({
            isValidCivicIssue: false,
            message: "This image does not contain a reportable civic issue. Please upload a clear photo of a public infrastructure problem.",
            isImageAnalysis: true,
            isSimulated: true
          });
        }

        const randId = Math.floor(100000 + Math.random() * 900000);
        
        // 1. Dynamic Simulation: Water Leak / Pipe Burst
        if (lowerMessage.includes("leak") || lowerMessage.includes("water") || lowerMessage.includes("pipe") || lowerMessage.includes("flood")) {
          return NextResponse.json({
            isValidCivicIssue: true,
            isImageAnalysis: true,
            isSimulated: true,
            reportId: `SR-2026-${randId}`,
            category: "Water Utility Pipe Leakage",
            severity: "Critical",
            description: "[SIMULATOR MODE] Identified main line water pipe burst with significant pressure loss and regional flooding. Poses hazard to local roadbed stability and residential flooding.",
            status: "Emergency Dispatch to Delhi Jal Board Division-2",
            actionPlan: [
              "Isolate main line valve gate to cut off flow",
              "Excavate damaged concrete conduit section",
              "Install high-pressure steel coupling pipe sleeve",
              "Restore surface paving and verify pressure seal integrity"
            ]
          });
        } 
        
        // 2. Dynamic Simulation: Electrical grid wires / streetlight
        if (lowerMessage.includes("light") || lowerMessage.includes("dark") || lowerMessage.includes("lamp") || lowerMessage.includes("wire") || lowerMessage.includes("electric") || lowerMessage.includes("power")) {
          return NextResponse.json({
            isValidCivicIssue: true,
            isImageAnalysis: true,
            isSimulated: true,
            reportId: `SR-2026-${randId}`,
            category: "Electrical Grid Hazard",
            severity: "High",
            description: "[SIMULATOR MODE] Exposed 220V street lighting cables from broken junction housing. Direct contact hazard for pedestrians during monsoon season.",
            status: "Dispatched to State Electricity Board Emergency Line Team-4",
            actionPlan: [
              "De-energize local lighting circuit feed",
              "Encase exposed wires in insulated conduit sleeve",
              "Replace broken junction housing cover and lock",
              "Test circuit load and re-enable lighting feed"
            ]
          });
        }
        
        // 3. Dynamic Simulation: Garbage / Dump / Trash
        if (lowerMessage.includes("garbage") || lowerMessage.includes("trash") || lowerMessage.includes("waste") || lowerMessage.includes("dump") || lowerMessage.includes("debris")) {
          return NextResponse.json({
            isValidCivicIssue: true,
            isImageAnalysis: true,
            isSimulated: true,
            reportId: `SR-2026-${randId}`,
            category: "Sanitation & Waste Accumulation",
            severity: "Medium",
            description: "[SIMULATOR MODE] Large pile of uncollected solid waste clogging storm drain inlet, creating pest breeding conditions and drainage blockade.",
            status: "Scheduled for MCD Sanitation Division Crew B",
            actionPlan: [
              "Deploy mechanical loader and waste hauling truck",
              "Clear debris blockages from catch basin grill",
              "Sanitize local area with eco-disinfectant spray",
              "Install municipal 'No Dumping' community signs"
            ]
          });
        }

        // 4. Default Simulation: Road Pothole
        return NextResponse.json({
          isValidCivicIssue: true,
          isImageAnalysis: true,
          isSimulated: true,
          reportId: `SR-2026-${randId}`,
          category: "Road Infrastructure Hazard",
          severity: "High",
          description: "[SIMULATOR MODE] Identified deep asphalt depression / pothole with exposed aggregates. It poses a high risk to commuter safety and vehicle health, requiring immediate municipal resurfacing.",
          status: "Dispatched to PWD Road Maintenance Unit Division-3",
          actionPlan: [
            "Log civic sentinel report in municipal database",
            "Dispatch local engineering crew for barrier setup",
            "Schedule cold-mix patching within 24 hours",
            "Update citizen dashboard on work completion status"
          ]
        });
      }
      
      // Simulate scheme queries
      const lowercaseMsg = message?.toLowerCase() || "";
      if (lowercaseMsg.includes("scheme") || lowercaseMsg.includes("pension") || lowercaseMsg.includes("pm") || lowercaseMsg.includes("eligibility") || lowercaseMsg.includes("yojana") || lowercaseMsg.includes("kisan") || lowercaseMsg.includes("bharat")) {
        return NextResponse.json({
          text: "Under the PM-Kisan Samman Nidhi Yojana, small and marginal farmers with landholdings up to 2 hectares receive ₹6,000 annually in three equal installments. Eligibility is verified via Aadhaar and land records. Institutional landholders and tax-paying farmers are excluded.",
          actions: [
            { label: "Generate PM-Kisan Application", scheme: "PM-Kisan Samman Nidhi" },
            { label: "Check Land Registry Status", scheme: "Land Verification" }
          ],
          isSimulated: true
        });
      }
      
      return NextResponse.json({
        text: `Welcome to BharatSaathi, your civic companion. (Simulated Mode) You asked: "${message}". How can I assist you with civic services, scheme inquiries, or reporting infrastructure issues today?`,
        actions: [],
        isSimulated: true
      });
    }
    
    // Normal Flow using Gemini SDK (Real Image Analysis)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are BharatSaathi, a professional, empathetic, and expert civic companion. You simplify complex government information, identify civic issues from images, and provide actionable, multilingual advice in under 150 words.",
    });

    if (image) {
      // Process image input (multimodal)
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType || "image/jpeg"
        }
      };

      const prompt = `You are BharatSaathi, the official Civic Companion. Your primary role is to analyze images uploaded by users.
      CRITICAL: First, determine if the image depicts a valid civic infrastructure issue (e.g., pothole, debris, broken light, water leak, unsafe structure, road blockage).
      IF NOT A CIVIC ISSUE: If the image is a person, a pet, or irrelevant content, respond politely: 'This image does not contain a reportable civic issue. Please upload a clear photo of a public infrastructure problem.' and do NOT generate a report.
      IF A CIVIC ISSUE: Proceed to generate a professional, high-severity report, identifying the issue type, department, and resolution steps.
      
      You must return a JSON response matching the following TypeScript interface, do not return any other text than the JSON block:
      interface IssueAnalysis {
        isValidCivicIssue: boolean; // True if it is a valid civic issue, false if not.
        message?: string; // Polite rejection message if isValidCivicIssue is false: 'This image does not contain a reportable civic issue. Please upload a clear photo of a public infrastructure problem.'
        isImageAnalysis: true;
        reportId?: string; // Generate a unique ID like SR-2026-XXXXX where XXXXX is a number
        category?: string; // The category of the issue e.g., Pothole, Garbage, Water Leakage, Electrical
        severity?: "Low" | "Medium" | "High" | "Critical";
        description?: string; // Description of the issue in under 50 words
        status?: string; // Dispatched status message, e.g., 'Dispatched to PWD Team-A'
        actionPlan?: string[]; // 3-4 actionable resolution steps
      }`;

      const response = await model.generateContent([prompt, imagePart]);
      const responseText = response.response.text();
      
      // Parse the JSON from the Gemini response
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```json/, "").replace(/^```/, "").trim();
      }
      
      try {
        const parsed = JSON.parse(cleanedText);
        return NextResponse.json({ ...parsed, isSimulated: false });
      } catch (err) {
        console.error("Failed to parse JSON from Gemini image response, text was:", responseText);
        return NextResponse.json({
          isValidCivicIssue: true,
          isImageAnalysis: true,
          isSimulated: false,
          reportId: `SR-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          category: "Detected Civic Issue",
          severity: "Medium",
          description: responseText.slice(0, 150),
          status: "Under Investigation by Municipal Hub",
          actionPlan: ["Assess site condition", "Schedule repair team", "Inform reporter"]
        });
      }
    } else {
      // Text-only conversational interface
      const prompt = `The user asks: "${message}".
      If the user is asking about a government scheme, yojana, benefits, or eligibility, provide a clear explanation under 150 words.
      Also, generate 1 or 2 relevant action buttons that the user can press (like 'Generate Application', 'Check Eligibility Criteria', etc.).
      You must respond ONLY with a JSON object in this format (do not include markdown formatting tags):
      {
        "text": "Your helpful response under 150 words explaining the scheme and eligibility criteria",
        "actions": [
          { "label": "Action Button Text", "scheme": "Scheme Name" }
        ]
      }`;
      
      const response = await model.generateContent(prompt);
      let responseText = response.response.text().trim();
      if (responseText.startsWith("```")) {
        responseText = responseText.replace(/^```json/, "").replace(/^```/, "").trim();
      }
      
      try {
        const parsed = JSON.parse(responseText);
        return NextResponse.json({ ...parsed, isSimulated: false });
      } catch (err) {
        console.error("Failed to parse JSON from Gemini text response, text was:", responseText);
        return NextResponse.json({
          text: responseText,
          actions: [],
          isSimulated: false
        });
      }
    }
  } catch (error: any) {
    console.error("Error in chat route:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
