import React from 'react';
import { MoreHorizontal } from "lucide-react"
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';




export function UserProfileCard({ name, balance }) {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
      className="rounded-xl flex px-16 flex-col items-center hover:scale-105 transition-all duration-500"
    >
      <div
        className={"relative w-full h-48 text-light-text dark:text-dark-text rounded-2xl p-6 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-900 dark:to-black"}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-700/30 to-transparent rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-600/20 to-transparent rounded-full translate-y-8 -translate-x-8" />

        {/* Menu dots */}
        <div className="absolute top-4 right-4">
          <MoreHorizontal className="w-5 h-5 " />
        </div>

        {/* Balance section */}
        <div className="relative z-10">
          <div className=" text-2xl font-bold mb-1">
            <p className="text-2xl font-bold">
              {Number(balance).toLocaleString('fr-FR')} Ar
            </p>
          </div>
          <div className=" text-sm mb-6">Balance</div>

          {/* Progress bar */}
          <div className="w-20 h-1 bg-white/20 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, 60))}%` }}
            />
          </div>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
          <div className=" text-sm font-mono tracking-wider">{name}</div>

          {/* Mastercard logo */}
          <div className="flex items-center space-x-[-4px]">
            <div className="w-6 h-6 bg-red-500 rounded-full opacity-90" />
            <div className="w-6 h-6 bg-orange-400 rounded-full opacity-90" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}