import React from "react";
import "./RefillRing.css";

export default function RefillRing({ left, total, color, colorGradStart, colorGradEnd }) {
  const pct = left / total;
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const isLow = left <= 7;
  const id = `rg-${left}-${total}`;

  return (
    <div className="refill-ring-wrap">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLow ? "#EF4444" : colorGradStart} />
            <stop offset="100%" stopColor={isLow ? "#F87171" : colorGradEnd} />
          </linearGradient>
        </defs>
        <circle cx="26" cy="26" r={r} fill="none" stroke="#E8EDFF" strokeWidth="5" />
        <circle
          cx="26" cy="26" r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          strokeDashoffset={circ * 0.25}
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="refill-ring-inner">
        <span className="refill-num" style={{ color: isLow ? "#EF4444" : color }}>{left}</span>
        <span className="refill-label">left</span>
      </div>
    </div>
  );
}