import React from 'react';
import { Card } from './Card';
import { Trend } from '../ui/Trend';
export default function StatsCard ({
  title,
  value,
  trend = 0,
  chart,
  className = '',
  prefix = '',
  suffix = 'Ar'
}) {
  return <Card className={`${className}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm mb-1">{title}</p>
          <div className="flex items-center">
            <h3 className=" font-medium text-xl mr-2 flex gap-1">
              {value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            })}
              <span>{suffix}</span>
            </h3>
            <Trend value={trend} />
          </div>
        </div>
      </div>
      {chart && <div className="mt-2">{chart}</div>}
    </Card>;
};