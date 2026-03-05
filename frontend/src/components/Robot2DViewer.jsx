import React, { useEffect, useMemo, useRef, useState } from "react";

const LINK_LENGTHS = { link2: 90, link3: 75, link4: 45, link5: 55, link6: 40 }; 
const LINK_COLORS = [
  "#e74c3c", // link2
  "#2ecc71", // link3
  "#f9d342", // link4
  "#3498db", // link5
  "#a259fc"  // link6
];

function radToDeg(r) {
  return (r * 180) / Math.PI;
}

export default function Robot2DViewer({ jointAngles }) {
  // Smoothing setup similar to 3D model
  const damping = 1.5; // lower = smoother/slower; higher = faster
  const smoothAnglesRef = useRef({
    A1: jointAngles?.A1 || 0,
    A2: jointAngles?.A2 || 0,
    A3: jointAngles?.A3 || 0,
    A4: jointAngles?.A4 || 0,
    A5: jointAngles?.A5 || 0,
    A6: jointAngles?.A6 || 0,
  });
  const [tick, setTick] = useState(0); // triggers re-render after smoothing updates

  useEffect(() => {
    let last = performance.now();
    let rafId;
    const loop = (now) => {
      const delta = (now - last) / 1000; // seconds
      last = now;
      const alpha = 1 - Math.exp(-damping * (delta || 0.016));
      const s = smoothAnglesRef.current;

      // Lerp towards target jointAngles
      s.A1 += ((jointAngles?.A1 || 0) - s.A1) * alpha;
      s.A2 += ((jointAngles?.A2 || 0) - s.A2) * alpha;
      s.A3 += ((jointAngles?.A3 || 0) - s.A3) * alpha;
      s.A4 += ((jointAngles?.A4 || 0) - s.A4) * alpha;
      s.A5 += ((jointAngles?.A5 || 0) - s.A5) * alpha;
      s.A6 += ((jointAngles?.A6 || 0) - s.A6) * alpha;

      setTick((t) => t + 1);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [jointAngles, damping]);

  const { positions, jointSummary, base } = useMemo(() => { // Destructure 'base' here
    const baseCoord = { x: 280, y: 330 }; // Define base coordinate inside useMemo
    // Read smoothed angles for rendering
    const {
      A1 = 0, A2 = 0, A3 = 0, A4 = 0, A5 = 0, A6 = 0,
    } = smoothAnglesRef.current || {};

    // --- Kinematic Calculation for 2D Diagram ---
    // A4, A5, A6 are static in the 2D diagram geometry.
    // Their actual values (A4, A5, A6) are still used for display in the summary.

    // A2 and A3 contribute to bending
    const angles = [
      A2 + Math.PI / 2, // Shoulder (A2) + initial offset for upright arm
      undefined, undefined, undefined, undefined
    ];
    angles[1] = angles[0] + A3; // Elbow (A3)

    // For A4, A5, A6, their contributions to the bending angle are set to 0 here
    // for the 2D diagram, effectively making them static in terms of bending.
    angles[2] = angles[1];      // A4 (Wrist Roll) does not bend the arm in this 2D view
    angles[3] = angles[2];      // A5 (Wrist Pitch) does not bend the arm in this 2D view
    angles[4] = angles[3];      // A6 (Wrist Yaw) does not bend the arm in this 2D view


    const pos = [baseCoord]; // Use baseCoord here
    Object.values(LINK_LENGTHS).forEach((len, idx) => {
      const last = pos[pos.length - 1];
      const ang = angles[idx];
      pos.push({
        x: last.x + len * Math.cos(ang),
        y: last.y - len * Math.sin(ang),
      });
    });

    // --- Joint Angle Summary for Display ---
    // All actual joint angles from props (A1-A6) are used for the summary display
    const summary = [
      { joint: "A1", deg: radToDeg(A1) },
      { joint: "A2", deg: radToDeg(A2) },
      { joint: "A3", deg: radToDeg(A3) },
      { joint: "A4", deg: radToDeg(A4) },
      { joint: "A5", deg: radToDeg(A5) },
      { joint: "A6", deg: radToDeg(A6) },
    ];

    return { positions: pos, jointSummary: summary, base: baseCoord }; // Return baseCoord as 'base'
  }, [tick]); // Recalculate on each smoothing tick

  return (
    <div className="flex flex-col h-full w-full">
      <h4 className="text-lg font-semibold mb-3 text-gray-700 text-center">
        2D Robot Joint Diagram
      </h4>
      <div className="flex-grow w-full flex justify-center items-center">
        <svg className="w-full h-full" viewBox="0 0 400 420">
          {/* Base of the robot arm */}
          <rect x={base.x - 25} y={base.y} width="50" height="20" fill="#4B5563" rx="6" />

          {/* Draw links */}
          {positions.slice(0, -1).map((start, idx) => (
            <line
              key={idx}
              x1={start.x} y1={start.y}
              x2={positions[idx + 1].x} y2={positions[idx + 1].y}
              stroke={LINK_COLORS[idx] || "#888"}
              strokeWidth={18 - idx * 2} // Varying thickness for visual appeal
              strokeLinecap="round"
            />
          ))}
          {/* Draw joints */}
          {positions.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x} cy={pt.y}
              r={idx === 0 ? 15 : 11} // Larger base joint
              fill="#fff"
              stroke={idx === 0 ? "#34495e" : "#22223b"}
              strokeWidth="2.5"
            />
          ))}
        </svg>
      </div>

    </div>
  );
}
