import React, { useMemo } from "react";

const LINK_LENGTHS = { link2: 90, link3: 75, link4: 45, link5: 55, link6: 40 }; // Larger segments for bigger arm
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
  const { positions, jointSummary } = useMemo(() => {
    const base = { x: 190, y: 330 }; // Moved down and right for larger SVG
    const {
      A1 = 0, A2 = 0, A3 = 0, A4 = 0, A5 = 0, A6 = 0,
    } = jointAngles || {};

    const angles = [
      A2 + Math.PI/2,
      undefined, undefined, undefined, undefined
    ];
    angles[1] = angles[0] + A3;
    angles[2] = angles[1] + A4;
    angles[3] = angles[2] + A5;
    angles[4] = angles[3] + A6;

    const pos = [base];
    Object.values(LINK_LENGTHS).forEach((len, idx) => {
      const last = pos[pos.length - 1];
      const ang = angles[idx];
      pos.push({
        x: last.x + len * Math.cos(ang),
        y: last.y - len * Math.sin(ang),
      });
    });

    const summary = [
      { joint: "A1", deg: radToDeg(A1) },
      { joint: "A2", deg: radToDeg(A2) },
      { joint: "A3", deg: radToDeg(A3) },
      { joint: "A4", deg: radToDeg(A4) },
      { joint: "A5", deg: radToDeg(A5) },
      { joint: "A6", deg: radToDeg(A6) },
    ];

    return { positions: pos, jointSummary: summary };
  }, [jointAngles]);

  return (
    <div className="flex flex-col h-full w-full">
      <h4 className="text-lg font-semibold mb-3 text-gray-700 text-center">
        2D Robot Joint Diagram (Larger View)
      </h4>
      <div className="flex-grow w-full flex justify-center items-center">
        <svg width={400} height={420} viewBox="0 0 400 420">
          {/* Draw links */}
          {positions.slice(0, -1).map((start, idx) => (
            <line
              key={idx}
              x1={start.x} y1={start.y}
              x2={positions[idx + 1].x} y2={positions[idx + 1].y}
              stroke={LINK_COLORS[idx] || "#888"}
              strokeWidth={18 - idx * 2}
              strokeLinecap="round"
            />
          ))}
          {/* Draw joints */}
          {positions.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x} cy={pt.y}
              r={idx === 0 ? 15 : 11}
              fill="#fff"
              stroke={idx === 0 ? "#34495e" : "#22223b"}
              strokeWidth="2.5"
            />
          ))}
        </svg>
      </div>

      {/* Degree/Angle Table Aligned at Bottom */}
      <div className="pt-6 pb-2 flex flex-wrap justify-center items-center gap-7 border-t mt-2 bg-white">
        {jointSummary.map(({ joint, deg }) => (
          <div key={joint} className="flex flex-col items-center min-w-[64px]">
            <span className="font-bold text-blue-800">{joint}</span>
            <span className="font-mono text-base text-black">{deg.toFixed(1)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}
