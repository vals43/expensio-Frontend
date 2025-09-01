import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Composant d'infobulle personnalisé
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-gray-800 text-white rounded-lg p-2 shadow-lg text-sm border border-gray-700">
        <p className="font-bold">{dataPoint.name}</p> {/* Affiche la date complète */}
        <p className="mt-1">
          <span className="text-gray-400">value:</span> {dataPoint.value}
        </p> {/* Affiche la valeur correcte */}
      </div>
    );
  }

  return null;
};

export const LineChart = ({
  data,
  dataKey,
  lineColor = '#3B82F6',
  height = 300,
  className = '',
  showGrid = false,
  showAxis = true,
  showDots = true
}) => {
  return <div className={`w-full ${className}`} style={{
    height
  }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{
        top: 5,
        right: 5,
        left: 5,
        bottom: 5
      }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
          {showAxis && <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={{
          stroke: '#374151'
        }} />}
          {showAxis && <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={{
          stroke: '#374151'
        }} />}
          <Tooltip 
            content={<CustomTooltip />} // Utilise le composant personnalisé
            cursor={{ stroke: lineColor, strokeWidth: 1.5, strokeDasharray: '3 3' }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={lineColor} 
            strokeWidth={2} 
            dot={showDots ? {
              stroke: lineColor,
              strokeWidth: 2,
              fill: '#1F2937'
            } : false} 
            activeDot={{
              r: 6,
              stroke: lineColor,
              strokeWidth: 2,
              fill: '#1F2937'
            }} 
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>;
};
