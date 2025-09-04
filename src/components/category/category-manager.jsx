import React, { useState } from "react"
import { useCategories } from "../../api/category/categoryContext"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Card from "../ui/Card"
import { Plus, Edit2, Trash2, Save, X } from "lucide-react"
import { ConfirmDeleteModal } from "../ui/ConfirmDeleteModal"
import { useJsonExpensesBySource } from "../../api/summary/useJsonSummary"

export function CategoryManager() {
  const { categories, handleCreateCategory, handleUpdateCategory, handleDeleteCategory } = useCategories()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const cat = useJsonExpensesBySource().data
  if (!cat) return "loading"

  console.log(cat);


  function getRandomHexColor(theme = "dark") {
    let color = "#"
    if (theme === "dark") {
      for (let i = 0; i < 3; i++) {
        const darkValue = Math.floor(Math.random() * 8)
        color += darkValue.toString(16) + darkValue.toString(16)
      }
    } else if (theme === "light") {
      const letters = "89ABCDEF"
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)]
      }
    } else {
      const letters = "0123456789ABCDEF"
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
    }
    return color
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      if (editingId) {
        await handleUpdateCategory(editingId, formData)
        setEditingId(null)
      } else {
        await handleCreateCategory(formData)
        setIsCreating(false)
      }
      setFormData({ name: "", description: "" })
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const startEdit = (category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      description: category.description,
    })
    setIsCreating(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({ name: "", description: "" })
  }

  const confirmDelete = (category) => {
    setSelectedCategory(category)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedCategory) {
      await handleDeleteCategory(selectedCategory.id)
      setDeleteModalOpen(false)
      setSelectedCategory(null)
    }
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Category Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize and manage your categories with ease</p>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-4">
            <h2 className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold mb-4">
              <Plus className="w-5 h-5" />
              {editingId ? "Edit Category" : "Create New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  className="dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Add Category Button */}
        {!isCreating && !editingId && (
          <div className="text-center">
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Category
            </Button>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {selectedCategory && (
          <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            itemName={selectedCategory.name}
            onConfirm={handleConfirmDelete}
          />
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const expenses = Array.isArray(cat) ? cat : Object.values(cat).filter(item => item?.category);
            const matchedExpense = expenses.find((e) => e.category === category.name);

            return (
              <Card
                key={category.id}
                className="group hover:shadow-lg font-bold transition-all duration-200 border-l-4 border-b-4 dark:border-gray-700 dark:bg-gray-800 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getRandomHexColor("light") }}
                    />
                    <h3 className="text-lg text-gray-900 dark:text-white">{category.name}</h3>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {matchedExpense
                    ? `Expense Count: ${parseFloat(matchedExpense.expenseCount)}`
                    : category.expenseCount || "No expense yet"}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {matchedExpense
                    ? `Total: $${parseFloat(matchedExpense.totalAmount).toFixed(2)}`
                    : category.description || "No amount yet"}
                </p>


                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(category)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => confirmDelete(category)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>


        {/* Empty state */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by creating your first category</p>
            <Button onClick={() => setIsCreating(true)}>Create Category</Button>
          </div>
        )}
      </div>
    </div>
  )
}
