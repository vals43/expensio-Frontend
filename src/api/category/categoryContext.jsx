// src/context/categoryContext.jsx
import { useEffect, useState, createContext, useContext } from "react";
import { useLocation } from "react-router-dom"; // ← Ajout pour refetch sur route change
import {
  fetchAllCategories,
  createNewCategory,
  updateExistingCategory,
  deleteExistingCategory,
} from "./categoryService";
import { NotificationModal } from "../../components/ui/NotificationModal";

// 🔹 Context pour les catégories
const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ← Ajout pour UX loading
  const location = useLocation(); // ← Récupère la route actuelle

  // 🔹 État de la modal de notification
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  // 🔹 Fetch initial ET à chaque route change
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true); // ← Début loading
      try {
        const data = await fetchAllCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Erreur lors du fetch des catégories :", error);
        // ← Condition : Pas de notif sur login/signup
        if (!["/login", "/signup"].includes(location.pathname)) {
          showNotification("error", "Failed to fetch categories");
        }
      } finally {
        setIsLoading(false); // ← Fin loading
      }
    };
    fetchCategories();
  }, [location.pathname]); // ← Dépendance : Refetch à chaque pathname change

  // 🔹 Fonction refetch manuelle
  const refetchCategories = async () => {
    await fetchCategories(); // Réutilise la logique ci-dessus
  };

  // 🔹 Helper pour ouvrir la notification
  const showNotification = (type, message) => {
    // ← Condition : Pas de notif sur login/signup
    if (["/login", "/signup"].includes(location.pathname)) return;
    setNotification({ isOpen: true, type, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isOpen: false }));
    }, 2500); // auto close après 2.5s
  };

  // 🔹 Actions sur les catégories (inchangées, mais ajout condition notif)
  const handleCreateCategory = async (newCategoryData) => {
    try {
      const response = await createNewCategory(newCategoryData);
      setCategories((prev) => [...prev, response]);
      showNotification("success", "Category created successfully");
      return response;
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie:", error);
      showNotification("error", "Failed to create category");
      throw error;
    }
  };

  const handleUpdateCategory = async (id, updatedData) => {
    try {
      const response = await updateExistingCategory(id, updatedData);
      setCategories((prev) =>
        prev.map((category) => (category.id === id ? response : category))
      );
      showNotification("success", "Category updated successfully");
      return response;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
      showNotification("error", "Failed to update category");
      throw error;
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteExistingCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      showNotification("success", "Category deleted successfully");
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
      showNotification("error", "Failed to delete category there is expense re-attached");
      throw error;
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        isLoading, // ← Exposé pour spinner
        refetchCategories, // ← Pour refetch manuel
        handleCreateCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        showNotification,
      }}
    >
      {children}
      {/* Notification Modal : Conditionnel pour login/signup */}
      {notification.isOpen && !["/login", "/signup"].includes(location.pathname) && (
        <NotificationModal
          isOpen={notification.isOpen}
          onClose={() => setNotification((prev) => ({ ...prev, isOpen: false }))}
          type={notification.type}
          message={notification.message}
        />
      )}
    </CategoryContext.Provider>
  );
}

// 🔹 Hook pour utiliser les catégories
export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategories doit être utilisé à l'intérieur d'un CategoryProvider"
    );
  }
  return context;
}

// 🔹 Hook pour accéder uniquement aux actions
export function useCategoryActions() {
  const { handleCreateCategory, handleUpdateCategory, handleDeleteCategory, showNotification } =
    useCategories();
  return {
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    showNotification,
  };
}