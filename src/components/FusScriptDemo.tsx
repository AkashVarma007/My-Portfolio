"use client";

import { useEffect, useRef, useState } from "react";

/**
 * FusScriptDemo — a frontend-only playground that simulates a sample
 * FUS Script definition parsing and transforming an inbound device message.
 *
 * Not real FUS Script syntax from WaveFuel — hand-authored, representative.
 * Visitors can press "Run" to watch a mock message flow through the parser.
 */

const SAMPLE_SCRIPT = `device "smart-meter-v2" {
  protocol mqtt
  topic   "meters/+/data"

  field voltage   path "v"       type float
  field current   path "i"       type float
  field serial    path "s"       type string

  transform power = voltage * current

  on emit {
    encrypt serial with rsa(client_key)
    publish "ingest/meters"
  }
}`;

type Step = {
  label: string;
  detail: string;
};

const STEPS: Step[] = [
  { label: "01 · RECEIVE",   detail: 'mqtt  "meters/A7/data"  { "v": 239.4, "i": 5.1, "s": "A7-2024" }' },
  { label: "02 · PARSE",     detail: "match device 'smart-meter-v2' → ok" },
  { label: "03 · EXTRACT",   detail: "voltage=239.4   current=5.1   serial=A7-2024" },
  { label: "04 · TRANSFORM", detail: "power = 239.4 × 5.1 = 1220.94 W" },
  { label: "05 · ENCRYPT",   detail: "serial → rsa(client_key) → ████████████" },
  { label: "06 · EMIT",      detail: 'publish "ingest/meters" { power: 1220.94, serial: <encrypted> }' },
];

export function FusScriptDemo() {
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(true);
    setActiveStep(-1);
    STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setActiveStep(i), 350 + i * 520));
    });
    timers.current.push(
      setTimeout(() => setRunning(false), 350 + STEPS.length * 520 + 400)
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setRunning(false);
    setActiveStep(-1);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10,10,14,0.7)",
        border: "1px solid rgba(196,247,81,0.15)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "rgba(196,247,81,0.1)", background: "rgba(196,247,81,0.03)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#febc2e" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />
          <span
            className="ml-3 font-code text-[0.55rem] tracking-[2px] uppercase"
            style={{ color: "#9b97a8" }}
          >
            fus-script · playground
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={run}
            disabled={running}
            className="font-code text-[0.55rem] tracking-[2px] uppercase px-3 py-1.5 rounded-md transition-all duration-200"
            style={{
              background: running ? "rgba(196,247,81,0.05)" : "rgba(196,247,81,0.12)",
              color: running ? "rgba(196,247,81,0.4)" : "#c4f751",
              border: "1px solid rgba(196,247,81,0.25)",
              cursor: running ? "default" : "pointer",
            }}
          >
            {running ? "running…" : "▶ run"}
          </button>
          <button
            onClick={reset}
            className="font-code text-[0.55rem] tracking-[2px] uppercase px-3 py-1.5 rounded-md transition-all duration-200"
            style={{
              color: "#9b97a8",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
            }}
          >
            reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Code panel */}
        <pre
          className="font-code text-[0.68rem] leading-[1.75] p-5 overflow-x-auto"
          style={{ color: "#d7d4e0", background: "rgba(0,0,0,0.25)" }}
        >
          <code>{SAMPLE_SCRIPT}</code>
        </pre>

        {/* Execution panel */}
        <div className="p-5 flex flex-col gap-2 lg:border-l" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {STEPS.map((step, i) => {
            const active = i === activeStep;
            const done = i < activeStep || (!running && activeStep === STEPS.length - 1 && i <= activeStep);
            const visible = activeStep >= i;
            return (
              <div
                key={step.label}
                className="rounded-md px-3 py-2 transition-all duration-300"
                style={{
                  opacity: visible ? 1 : 0.25,
                  transform: visible ? "translateX(0)" : "translateX(-6px)",
                  background: active
                    ? "rgba(196,247,81,0.1)"
                    : done
                    ? "rgba(196,247,81,0.03)"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(196,247,81,0.35)"
                    : "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div
                  className="font-code text-[0.55rem] tracking-[2px] uppercase"
                  style={{ color: active ? "#c4f751" : done ? "#9b97a8" : "#56526a" }}
                >
                  {step.label}
                </div>
                <div
                  className="font-code text-[0.65rem] leading-[1.6] mt-0.5"
                  style={{ color: visible ? "#d7d4e0" : "#3a3847" }}
                >
                  {step.detail}
                </div>
              </div>
            );
          })}
          {activeStep < 0 && !running && (
            <div
              className="font-code text-[0.6rem] tracking-[1.5px] uppercase mt-auto pt-3"
              style={{ color: "#56526a" }}
            >
              press run to see a sample message flow through the parser →
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
