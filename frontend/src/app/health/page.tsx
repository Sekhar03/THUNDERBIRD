import React from "react";

function getEnv(name: string): { name: string; value: string; set: boolean } {
  const value = process.env[name];
  return { name, value: value ?? "", set: Boolean(value && value.length > 0) };
}

export default async function HealthPage() {
  const serverBase = getEnv("SERVER_BASE_URL");
  const simulatorBase = getEnv("SIMULATOR_BASE_URL");

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Deployment Health</h1>
      <p style={{ marginBottom: 24 }}>
        Use this page to verify environment configuration on Vercel and links to backend services.
      </p>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Environment Variables</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <code>SERVER_BASE_URL</code>: {serverBase.set ? (
              <a href={serverBase.value} target="_blank" rel="noreferrer">{serverBase.value}</a>
            ) : (
              <strong style={{ color: "#b91c1c" }}>NOT SET</strong>
            )}
          </li>
          <li>
            <code>SIMULATOR_BASE_URL</code>: {simulatorBase.set ? (
              <a href={simulatorBase.value} target="_blank" rel="noreferrer">{simulatorBase.value}</a>
            ) : (
              <strong style={{ color: "#b91c1c" }}>NOT SET</strong>
            )}
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Expected Routes</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <code>/api/status</code> → <code>{serverBase.set ? `${serverBase.value}/status` : "(requires SERVER_BASE_URL)"}</code>
          </li>
          <li>
            <code>/ws</code> → <code>{serverBase.set ? `${serverBase.value}/ws` : "(requires SERVER_BASE_URL)"}</code>
          </li>
          <li>
            <code>/telemetry</code> → <code>{simulatorBase.set ? `${simulatorBase.value}/telemetry` : "(requires SIMULATOR_BASE_URL)"}</code>
          </li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Diagnostics API</h2>
        <p>
          Call <a href="/api/ping" target="_blank" rel="noreferrer">/api/ping</a> to see the serverless env that this deployment reads.
        </p>
      </section>
    </div>
  );
}


