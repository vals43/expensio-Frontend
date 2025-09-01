import React from 'react';
import { useTheme } from './theme/ThemeProvider';
export function Logo({
  size = 'default',
  className
}) {
  const {
    theme
  } = useTheme();
  const sizeClasses = {
    small: 'h-8',
    default: 'h-12',
    large: 'h-16'
  };
  return <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
      <div className="relative">
        <div className={`absolute inset-0 blur-sm bg-primary-500 opacity-20 ${theme === 'dark' ? 'opacity-40' : ''}`}></div>
        <svg className={`${sizeClasses[size]} relative z-10`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 19.5H22L12 2Z" className={`${theme === 'dark' ? 'fill-primary-400' : 'fill-primary-600'} transition-colors duration-300`} />
          <path d="M12 13L7 22H17L12 13Z" className={`${theme === 'dark' ? 'fill-primary-200' : 'fill-primary-800'} transition-colors duration-300`} />
        </svg>
      </div>
    </div>;
}