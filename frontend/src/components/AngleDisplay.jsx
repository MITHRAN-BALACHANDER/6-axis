import React from 'react';

const AngleDisplay = ({ jointAngles }) => {
  const angles = [
    { name: 'A1', value: jointAngles.A1 },
    { name: 'A2', value: jointAngles.A2 },
    { name: 'A3', value: jointAngles.A3 },
    { name: 'A4', value: jointAngles.A4 },
    { name: 'A5', value: jointAngles.A5 },
    { name: 'A6', value: jointAngles.A6 },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg">
      {angles.map(angle => (
        <div key={angle.name} className="flex justify-between items-center">
          <div className="font-bold text-blue-600">{angle.name}</div>
          <div className="text-lg">{(angle.value * 180 / Math.PI).toFixed(1)}°</div>
        </div>
      ))}
    </div>
  );
};

export default AngleDisplay;
