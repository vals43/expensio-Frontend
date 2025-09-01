import React from 'react';
import { useTheme } from './theme/ThemeProvider';
import { FacebookIcon, GithubIcon, Mail } from 'lucide-react';
export function SocialLogin() {
  const {
    theme
  } = useTheme();
  const socialButtons = [{
    name: 'Google',
    icon: <Mail/>
  }, {
    name: 'GitHub',
    icon: <GithubIcon/>
  }, {
    name: 'Facebook',
    icon: <FacebookIcon/>
  }];
  return <div className="w-full">
      <div className="relative flex items-center justify-center my-6">
        <div className={`flex-grow border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
        <span className={`mx-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          or continue with
        </span>
        <div className={`flex-grow border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
      </div>
      <div className="flex gap-3 justify-center">
        {socialButtons.map(button => <button key={button.name} className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${theme === 'dark' ? 'bg-dark-card text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} aria-label={`Sign in with ${button.name}`}>
            {button.icon}
          </button>)}
      </div>
    </div>;
}