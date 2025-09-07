import React, { useState } from "react";
import Button from "./Button";

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName = "this item" }) => {
  const [successMessage, setSuccessMessage] = useState("");

  const handleConfirm = async () => {
    try {
      await onConfirm(); // Appelle la fonction de suppression
      setSuccessMessage(`${itemName} deleted successfully!`);
      setTimeout(() => {
        setSuccessMessage("");
        onClose(); // Ferme le modal après 1.5s
      }, 1500);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      {successMessage ? (
        <p className="text-green-600 dark:text-green-500 text-center">{successMessage}</p>
      ) : (
        <div className="space-y-4">
          <p>Are you sure you want to delete {itemName}?</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="danger" onClick={handleConfirm}>Delete</Button>
          </div>
        </div>
      )}
    </div>
  );
};
