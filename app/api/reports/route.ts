/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

// In-memory mock database of reported civic issues
const reportsDatabase: any[] = [
  {
    isValidCivicIssue: true,
    reportId: "SR-2026-10293",
    category: "Road Infrastructure Hazard",
    severity: "High",
    description: "Deep pothole and asphalt cracking on the Sector-15 main corridor, causing vehicle decelerations.",
    status: "Scheduled for Repair (Next 24h)",
    actionPlan: ["Delineate zone with signage", "Fill pothole cavity", "Steam roll asphalt resurface"],
    timestamp: new Date(Date.now() - 3600000 * 2)
  },
  {
    isValidCivicIssue: true,
    reportId: "SR-2026-89472",
    category: "Water Utility Pipe Leakage",
    severity: "Critical",
    description: "Pipeline crack near metro column 47, spraying high pressure drinking water across sidewalk path.",
    status: "Emergency Crew Active (En Route)",
    actionPlan: ["Shut main branch valve", "Replace coupling valve connector", "Verify pressure integrity"],
    timestamp: new Date(Date.now() - 3600000 * 5)
  }
];

export async function GET() {
  return NextResponse.json(reportsDatabase);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportId, category, severity, description, status, actionPlan } = body;

    if (!reportId || !category || !severity || !description) {
      return NextResponse.json({ error: "Missing required report attributes" }, { status: 400 });
    }

    const newReport = {
      isValidCivicIssue: true,
      reportId,
      category,
      severity,
      description,
      status,
      actionPlan: actionPlan || [],
      timestamp: new Date()
    };

    reportsDatabase.unshift(newReport); // Insert at beginning to display latest reports first
    console.log(`[SENTINEL DATABASE LOG] New Report Recorded:`, newReport);

    return NextResponse.json({ success: true, totalRecords: reportsDatabase.length });
  } catch (error: any) {
    console.error("Error in reports route:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
