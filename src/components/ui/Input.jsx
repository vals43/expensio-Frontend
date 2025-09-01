import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
export default function Input({
  label,
  icon,
  type = 'text',
  error,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    theme
  } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? showPassword ? 'text' : 'password' : type;
  const baseClasses = 'w-full px-4 py-3 rounded-lg transition-all duration-200 outline-none';
  const focusClasses = isFocused ? 'ring-2 ring-primary-400' : '';
  const themeClasses = theme === 'dark' ? 'bg-dark-card border-dark-border text-white' : 'bg-white border-gray-200 text-gray-900';
  const errorClasses = error ? 'border-red-500' : 'border';
  return <div className={`mb-4 animate-fade-in ${className}`}>
      <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <input type={inputType} className={`${baseClasses} ${themeClasses} ${focusClasses} ${errorClasses} ${icon ? 'pl-10' : ''}`} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} {...props} />
        {isPasswordType && <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 animate-slide-up">{error}</p>}
    </div>;
}