import { useCategories } from "../../api/category/categoryContext";
import { TagIcon } from "lucide-react";
import { motion } from "framer-motion";

const CategoryDropdown = ({ value, onChange, errors }) => {
  const { categories } = useCategories();
  const isLoading = !categories || categories.length === 0;

  return (
    <div className="space-y-2">
      <label
        htmlFor="categoryId"
        className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
      >
        Category *
      </label>
      <div className="relative group">
        {/* Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 group-focus-within:text-primary transition-colors">
          <TagIcon className="h-5 w-5" />
        </div>

        {/* Select */}
        <select
          id="categoryId"
          name="categoryId"
          value={value}
          onChange={onChange}
          required
          disabled={isLoading}
          className={`
            block w-full pl-12 pr-8 py-4 rounded-xl text-base font-medium appearance-none cursor-pointer
            bg-white/60 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10
            focus:border-primary focus:ring-4 focus:ring-primary/30 text-gray-900 dark:text-white
            transition-all duration-300 ease-out hover:bg-white/70 dark:hover:bg-black/30
            shadow-sm hover:shadow-md focus:shadow-lg
            ${errors?.categoryId ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}
          `}
        >
          {isLoading ? (
            <option value="" disabled>
              Loading categories...
            </option>
          ) : (
            <>
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </>
          )}
        </select>

        {/* Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-focus-within:-rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Error */}
      {errors?.categoryId && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 font-medium"
        >
          {errors.categoryId}
        </motion.p>
      )}
    </div>
  );
};

export default CategoryDropdown;
