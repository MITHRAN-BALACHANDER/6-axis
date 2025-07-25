import React, { useMemo } from "react";

// These values can be adjusted to better match your robot's proportions.
const LINK_LENGTHS = { link2: 60, link3: 50, link5: 40 };

// Colors are matched to the 3D model for consistency.
const LINK_COLORS = {
  link2: "#e74c3c", // Red
  link3: "#2ecc71", // Green
  link5: "#3498db", // Blue
};

const Robot2DViewer = ({ jointAngles }) => {
  const linkPositions = useMemo(() => {
    const positions = [];
    const base = { x: 150, y: 280 }; // The anchor point for the 2D model.

    if (!jointAngles) return [];

    // The angles from the sliders (in radians).
    // A 90-degree offset (Math.PI / 2) is added to the first joint angle.
    // This makes the arm start in an UPRIGHT position instead of flat.
    const angle2 = (jointAngles.A2 || 0) + Math.PI / 2;
    const angle3 = jointAngles.A3 || 0;
    const angle5 = jointAngles.A5 || 0;

    // Calculate the end point of the first link (from the base).
    const p1 = {
      x: base.x + LINK_LENGTHS.link2 * Math.cos(angle2),
      y: base.y - LINK_LENGTHS.link2 * Math.sin(angle2),
    };

    // The angle of the second link is added to the first to form a chain.
    const cumulativeAngle2 = angle2 + angle3;
    const p2 = {
      x: p1.x + LINK_LENGTHS.link3 * Math.cos(cumulativeAngle2),
      y: p1.y - LINK_LENGTHS.link3 * Math.sin(cumulativeAngle2),
    };

    // The third link's angle is added to the previous cumulative angle.
    const cumulativeAngle3 = cumulativeAngle2 + angle5;
    const p3 = {
      x: p2.x + LINK_LENGTHS.link5 * Math.cos(cumulativeAngle3),
      y: p2.y - LINK_LENGTHS.link5 * Math.sin(cumulativeAngle3),
    };
    
    positions.push({ start: base, end: p1, color: LINK_COLORS.link2 });
    positions.push({ start: p1, end: p2, color: LINK_COLORS.link3 });
    positions.push({ start: p2, end: p3, color: LINK_COLORS.link5 });

    return positions;
  }, [jointAngles]);

  return (
    <div className="flex flex-col h-full">
      {/* <h4 className="text-md font-semibold mb-3 text-gray-700 text-center">2D Preview</h4> */}
      <div className="flex-grow w-full">
        <svg
          width="100%"
          height="50%"
          viewBox="0 0 300 300"
          // The background and border classes have been removed for a transparent look.
        >
          {/* Robot Base */}
          <rect x="125" y="280" width="50" height="20" fill="#2c3e50" rx="4" />

          {/* Render Links */}
          {linkPositions.map((pos, index) => (
            <line
              key={index}
              x1={pos.start.x} y1={pos.start.y}
              x2={pos.end.x} y2={pos.end.y}
              stroke={pos.color}
              strokeWidth="10" strokeLinecap="round"
            />
          ))}

          {/* Render Joints */}
          {linkPositions.map((pos, index) => (
            <circle key={`joint-${index}`} cx={pos.start.x} cy={pos.start.y} r="6" fill="white" stroke="#374151" strokeWidth="2" />
          ))}
          {linkPositions.length > 0 && (
            <circle key="end-effector" cx={linkPositions[linkPositions.length - 1].end.x} cy={linkPositions[linkPositions.length - 1].end.y} r="6" fill="white" stroke="#374151" strokeWidth="2" />
          )}
        </svg>
      </div>
    </div>
  );
};

export default Robot2DViewer;
