import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
export const Trend = ({
  value,
  showIcon = true,
  showValue = true,
  className = ''
}) => {
  const isPositive = value >= 0;
  const absValue = Math.abs(value);
  return <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'} ${className}`}>
      {showIcon && <span className="mr-1">
          {isPositive ? <TrendingUpIcon size={14} /> : <TrendingDownIcon size={14} />}
        </span>}
      {showValue && <span className="text-xs font-medium">
          {isPositive ? '+' : '-'}
          {absValue.toFixed(2)}% (last month)
        </span>}
    </div>;
};