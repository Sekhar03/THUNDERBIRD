import { NextResponse } from "next/server";

export async function GET() {
  const server = process.env.SERVER_BASE_URL || "";
  const simulator = process.env.SIMULATOR_BASE_URL || "";

  return NextResponse.json({
    ok: true,
    serverBaseUrlSet: Boolean(server),
    simulatorBaseUrlSet: Boolean(simulator),
    serverBaseUrl: server ? "(set)" : "",
    simulatorBaseUrl: simulator ? "(set)" : "",
    timestamp: new Date().toISOString(),
    note:
      "Set SERVER_BASE_URL and SIMULATOR_BASE_URL in Vercel Project Settings → Environment Variables",
  });
}


