import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useJsonSummary } from '../../api/summary/useJsonSummary';

function getRandomHexColor(theme = 'dark') {
  let color = '#';

  if (theme === 'dark') {
    for (let i = 0; i < 3; i++) {
      const darkValue = Math.floor(Math.random() * 8);
      color += darkValue.toString(16) + darkValue.toString(16);
    }
  } else if (theme === 'light') {
    const letters = '89ABCDEF';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
  } else {
    const letters = '0123456789ABCDEF';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  }

  return color;
}

// Tooltip personnalisé
const CustomTooltip = ({ active, payload, theme }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div
        className={`p-2 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
        style={{ minWidth: '120px' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          ></div>
          <span className="font-medium">{item.name}</span>
        </div>
        <div className="text-right font-bold">{item.value} Ar</div>
      </div>
    );
  }

  return null;
};

export function StatisticsCard() {
  const { theme } = useTheme();
  const summary = useJsonSummary();
  const [colors] = useState([]);

  if (!summary) {
    return (
      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-sm text-center text-light-text dark:text-dark-text">
        <p className="text-gray-500 dark:text-gray-400">Chargement des stats...</p>
      </div>
    );
  }

  const data = summary.expensesByCategory;

  // Associer une couleur à chaque catégorie
  data.forEach((item, i) => {
    item.color = colors[i] || getRandomHexColor(theme);
    colors[i] = item.color;
  });

  const totalSpending = data.reduce((total, dat) => total + Number(dat.value), 0);

  return (
    <motion.div
      whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
      className="rounded-xl p-4 hover:scale-105 transition-all duration-500 bg-light-card dark:bg-dark-card"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-light-text dark:text-dark-text">Statistics</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Chart */}
        <div className="w-full md:w-1/2 h-64 md:h-72">
          <ResponsiveContainer width="70%" height="70%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius="100%"
                innerRadius={0} // Cercle plein
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip theme={theme} />}
                cursor={{ fill: 'transparent' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Spending</p>
            <p className="text-xl font-bold text-light-text dark:text-dark-text">{totalSpending.toFixed(2)} Ar</p>
          </div>
        </div>

        {/* Legend / List */}
        <div className="w-full md:w-1/2">
          <ul className="space-y-2">
            {data.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
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
