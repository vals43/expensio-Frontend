import React from 'react';
import { Logo } from '../Logo';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useTheme } from '../theme/ThemeProvider';
export function AuthLayout({
  children,
  title,
  subtitle
}) {
  const {
    theme
  } = useTheme();
  return <div className={`min-h-screen w-full flex flex-col md:flex-row transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-background text-dark-text' : 'bg-gray-50 text-gray-900'}`}>
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col animate-fade-in">
        <div className="flex justify-between items-center mb-12">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8 animate-slide-up">
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h1>
            {subtitle && <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {subtitle}
              </p>}
          </div>
          {children}
        </div>
      </div>
      {/* Right side - Banner */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-dark-card' : 'bg-primary-900'}`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-400 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-primary-600 to-transparent rounded-full"></div>
          </div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="animate-slide-up">
            <Logo size="large" />
          </div>
          <div className="mt-12 max-w-md animate-slide-up delay-100">
            <h2 className="text-3xl font-bold mb-4">
              Track your expenses with ease
            </h2>
            <p className="text-gray-300 mb-6">
              Our powerful expense tracker helps you manage your finances, track
              spending patterns, and reach your financial goals.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-8">
              <h3 className="text-xl font-semibold mb-2">
                Get insights on your spending
              </h3>
              <p className="text-gray-300 mb-4">
                Join thousands of users who have taken control of their
                finances.
              </p>
              <div className="flex -space-x-2 mt-4">
                <div className="w-8 h-8 rounded-full bg-primary-300 flex items-center justify-center text-xs font-medium">
                  JD
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-xs font-medium">
                  TK
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs font-medium">
                  MR
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-medium">
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}