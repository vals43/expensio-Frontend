import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { PlusIcon, ArrowRightIcon, ClockIcon, HistoryIcon } from 'lucide-react';
import TransactionForm from '../transaction/TransactionForm';

export function ActionButtonsCard() {

  const { theme } = useTheme();
  

  const actions = [{
    title: "Add expense",
    icon: <PlusIcon size={20} />,
    color: "green",
    delay: 0
  }, {
    title: "Add income",
    icon: <ArrowRightIcon size={20} />,
    color: "blue",
    delay: 0.1
  }, {
    title: "Request",
    icon: <ClockIcon size={20} />,
    color: "purple",
    delay: 0.2
  }, {
    title: "History",
    icon: <HistoryIcon size={20} />,
    color: "gray",
    delay: 0.3
  }];

  return (
    <motion.div
      whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
      className={`rounded-xl p-4`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            title={action.title}
            icon={action.icon}
            color={action.color}
            delay={action.delay}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ActionButton({ title, icon, color, delay }) {
  const { theme } = useTheme();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const colorClasses = {
    green: {
      bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50',
      text: 'text-green-600 dark:text-green-400'
    },
    blue: {
      bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50',
      text: 'text-blue-600 dark:text-blue-400'
    },
    purple: {
      bg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50',
      text: 'text-purple-600 dark:text-purple-400'
    },
    gray: {
      bg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100',
      text: 'text-gray-600 dark:text-gray-300'
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`flex flex-col items-center justify-center p-4 rounded-xl ${colorClasses[color].bg} ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}
    >
      <div className={`mb-2 ${colorClasses[color].text}`}>
        {icon}
      </div>
      <p className="text-sm font-medium">{title}</p>

    </motion.button>
    
  );
}