import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle.jsx';
import { useJsonUser } from '../../api/user/useJsonUser.js';
import { useTheme } from '../theme/ThemeProvider.jsx';

const Header = ({ openSidebar }) => {
  const user = useJsonUser();
  const location = useLocation();
  const { theme } = useTheme();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/expenses':
        return 'Expenses';
      case '/income':
        return 'Income';
      case '/profile':
        return 'Account';
      case '/setting':
        return 'Setting';
      case '/category':
        return 'Category';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden px-4 focus:outline-none"
              onClick={openSidebar}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                {getPageTitle()}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to={"/profile"} className="flex p-10 items-center">
              <div className="hidden md:block">
                <span className="text-sm font-medium mr-2">
                  {user?.firstName}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center text-white">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;