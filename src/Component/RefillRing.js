import React from "react";
import "./RefillRing.css";

export default function RefillRing({ left, total }) {
  const pct = left / total;
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const isLow = left <= 7;
  const id = `rg-${left}-${total}`;

  const trackColor = "#E0E7FF";
  const fillColor = isLow ? "#E11D48" : "#4F46E5";

  return (
    <div className="refill-ring-wrap">
      <svg width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r={r} fill="none" stroke={trackColor} strokeWidth="4.5" />
        <circle
          cx="25" cy="25" r={r}
          fill="none"
          stroke={fillColor}
          strokeWidth="4.5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          strokeDashoffset={circ * 0.25}
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="refill-ring-inner">
        <span className="refill-num" style={{ color: isLow ? "#E11D48" : "#4F46E5" }}>{left}</span>
        <span className="refill-label">left</span>
      </div>
    </div>
  );
}