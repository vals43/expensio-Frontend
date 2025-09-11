import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, InfoIcon } from "lucide-react";
import { useEffect } from "react"; // ← Ajout pour useEffect

const typeIcons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-600" />,
  error: <XCircleIcon className="w-6 h-6 text-red-600" />,
  info: <InfoIcon className="w-6 h-6 text-blue-600" />,
};

export const NotificationModal = ({ isOpen, onClose, type = "success", message }) => {
  // 🔹 Fermeture auto après 1,5 seconde
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose(); // Appelle la fonction de fermeture
      }, 1000); // 1,5 seconde

      // Nettoyage du timer si modale fermée avant ou démontée
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]); // Dépendances : relance si isOpen change

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 w-full max-w-sm flex items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>{typeIcons[type]}</div>
            <div className="flex-1 text-sm font-medium text-foreground dark:text-gray-100">
              {message}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};