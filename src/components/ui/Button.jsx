import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  className = '',
  ...props
}) {
  const {
    theme
  } = useTheme();
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center';
  const sizeClasses = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3'
  };
  const variantClasses = {
    primary: theme === 'dark' ? 'bg-primary-600 hover:bg-primary-500 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: theme === 'dark' ? 'bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-200' : 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  return <button className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> : icon ? <span className="mr-2">{icon}</span> : null}
      {children}
    </button>;
}