import { motion, AnimatePresence } from "framer-motion"
import Button from "./Button"

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-bold">{itemName}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
