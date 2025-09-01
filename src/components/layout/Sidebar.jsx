import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { HomeIcon, TrendingUpIcon, TrendingDownIcon, LogOutIcon, XIcon, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { logout } from '../../api/auth/authService';
import { useTheme } from '../theme/ThemeProvider';
import { Logo } from '../Logo';

const Sidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Income', href: '/income', icon: TrendingUpIcon },
    { name: 'Expenses', href: '/expenses', icon: TrendingDownIcon },
    { name: 'Account', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    if (closeSidebar) closeSidebar();
  };

  return (
    <motion.div
      className={`flex sticky top-0 flex-col h-screen bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border
                   ${isHovered ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* En-tête de la sidebar */}
      <div className="flex items-center h-16 px-4 border-b border-light-border dark:border-dark-border">
        <Link to="/dashboard" className="flex overflow-visible items-center">
          <span className="ml-2 text-xl font-bold text-light-text dark:text-dark-text">
            <Logo size='small' className='-ml-2' />
          </span>
          <span className={`${isHovered? `ml-5 font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition-all duration-300` : `hidden transition-all duration-500`}`} >
              Expensio
          </span>
        </Link>
        {closeSidebar && (
          <button
            onClick={closeSidebar}
            className="md:hidden p-2 rounded-md transition-colors text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation principale */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <motion.div
                key={item.name}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Link
                  to={item.href}
                  onClick={closeSidebar}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg relative
                    ${isActive
                      ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background hover:text-indigo-600 dark:hover:text-indigo-400'
                    }
                    transition-all duration-200 ease-in-out
                  `}
                >
                  <item.icon className="flex-shrink-0 h-5 w-5" />
                  <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0 w-0'}`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 w-1 h-full bg-indigo-600 dark:bg-indigo-400 rounded-r-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Bouton de déconnexion */}
      <Link to={'/login'} className="p-4 border-t border-light-border dark:border-dark-border">
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background hover:text-red-500 dark:hover:text-red-400"
          >
            <LogOutIcon className="flex-shrink-0 h-5 w-5" />
            <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0 w-0'}`}>
              Logout
            </span>
          </button>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default Sidebar;