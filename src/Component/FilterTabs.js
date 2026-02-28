import React, { useRef, useEffect } from "react";
import "./FilterTabs.css";

export default function FilterTabs({ tabs, active, onChange }) {
  const tabRefs = useRef([]);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const idx = tabs.indexOf(active);
    const tab = tabRefs.current[idx];
    const container = containerRef.current;
    if (!tab || !container || !sliderRef.current) return;
    const tr = tab.getBoundingClientRect();
    const cr = container.getBoundingClientRect();
    sliderRef.current.style.width = tr.width + "px";
    sliderRef.current.style.transform = `translateX(${tr.left - cr.left - 4}px)`;
  }, [active, tabs]);

  return (
    <div className="filter-tabs" ref={containerRef}>
      <div className="filter-slider" ref={sliderRef} />
      {tabs.map((tab, i) => (
        <button
          key={tab}
          ref={el => tabRefs.current[i] = el}
          className={`ftab ${active === tab ? "active" : ""}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}