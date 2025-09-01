import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { ChevronDownIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useJsonSummary } from '../../api/summary/useJsonSummary';

function getRandomHexColor(theme = 'dark') {
  let color = '#';
  let letters;

  if (theme === 'dark') {
    // Caractères pour des couleurs sombres (moins de lumière)
    letters = '0123456789ABCDEF';
    // On génère 3 paires de chiffres
    for (let i = 0; i < 3; i++) {
      const darkValue = Math.floor(Math.random() * 8); // Génère des valeurs de 0 à 7
      color += darkValue.toString(16) + darkValue.toString(16);
    }
  } else if (theme === 'light') {
    // Caractères pour des couleurs claires (plus de lumière)
    letters = '89ABCDEF';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
  } else {
    // Par défaut, on génère une couleur aléatoire
    letters = '0123456789ABCDEF';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  }

  return color;
}


export function StatisticsCard() {
  const {
    theme
  } = useTheme();
    const summary = useJsonSummary();

  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  if (!summary) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement des stats...</p>
      </div>
    );
  }
  
  

  const data = summary.expensesByCategory;


  const totalSpending = data.reduce((total, dat) => total + Number(dat.value), 0);
  return (
    <motion.div
      whileHover={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }}
      className="rounded-xl p-4 hover:scale-105 transition-all duration-500 bg-light-card dark:bg-dark-card"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-light-text dark:text-dark-text">Statistic</h3>
        <div className="relative">
          <button
            onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border"
          >
            <span className="text-sm">This Month</span>
            <ChevronDownIcon size={16} />
          </button>
          {monthDropdownOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -10
              }}
              className="absolute right-0 mt-1 py-1 rounded-lg shadow-lg z-10 w-32 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
            >
              <button className="w-full text-left px-3 py-1 text-sm text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background">
                This Month
              </button>
              <button className="w-full text-left px-3 py-1 text-sm text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background">
                Last Month
              </button>
              <button className="w-full text-left px-3 py-1 text-sm text-light-text dark:text-dark-text hover:bg-light-background dark:hover:bg-dark-background">
                Last 3 Months
              </button>
            </motion.div>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 h-[160px] mb-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRandomHexColor(theme)} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1e1e1e' : 'white',
                  color: theme === 'dark' ? 'white' : '#1e1e1e' ,
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value} Ar `, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Spending</p>
            <p className="text-xl font-bold text-light-text dark:text-dark-text">{totalSpending} Ar</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <ul className="space-y-2">
            {data.map((item, index) => (
              <motion.li
                key={index}
                initial={{
                  opacity: 0,
                  x: 20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 rounded-full mr-2"
                    style={{
                      backgroundColor: item.color
                    }}
                  ></div>
                  <span className="text-sm text-light-text dark:text-dark-text">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-light-text dark:text-dark-text">{item.value} Ar</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}