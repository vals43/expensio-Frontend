import apiClient from "../auth/apiClient";

// 🔹 GET /categories
export const fetchAllCategories = async () => {
  try {
    const response = await apiClient.get("api/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// 🔹 POST /categories
export const createNewCategory = async (categoryData) => {
  try {
    const response = await apiClient.post("api/categories", categoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating new category:", error);
    throw error;
  }
};

// 🔹 PUT /categories/{id}
export const updateExistingCategory = async (id, categoryData) => {
  try {
    const response = await apiClient.put(`api/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// 🔹 DELETE /categories/{id}
export const deleteExistingCategory = async (id) => {
  try {
    // Axios throws an error for non-2xx status codes, including 404 (Not Found).
    // A successful DELETE often returns a 200 or 204.
    await apiClient.delete(`api/categories/${id}`);
    return { message: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
