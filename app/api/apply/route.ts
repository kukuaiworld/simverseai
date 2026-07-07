/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

// In-memory ledger array for mock data storage
const applicationLedger: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, aadhaar, contact, state, landholding, scheme } = body;

    if (!name || !aadhaar || !contact || !scheme) {
      return NextResponse.json({ error: "Missing required form fields" }, { status: 400 });
    }

    // Generate secure transaction hash representation
    const txHash = `tx-0x${Math.random().toString(16).slice(2, 10).toUpperCase()}${Math.random().toString(16).slice(2, 10).toUpperCase()}${Math.random().toString(16).slice(2, 10).toUpperCase()}`;

    const newApplication = {
      applicationId: `APP-${Date.now()}`,
      name,
      aadhaar: `********${aadhaar.slice(-4)}`,
      contact,
      state,
      landholding,
      scheme,
      txHash,
      timestamp: new Date()
    };

    applicationLedger.push(newApplication);
    console.log(`[LEDGER REGISTRY LOG] Saved Scheme Application:`, newApplication);

    return NextResponse.json({
      success: true,
      txHash,
      applicationId: newApplication.applicationId
    });
  } catch (error: any) {
    console.error("Error in apply route:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(applicationLedger);
}
