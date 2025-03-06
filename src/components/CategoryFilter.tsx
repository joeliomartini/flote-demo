
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/services/categoryService";

interface CategoryFilterProps {
  allCategories: Category[];
  selectedCategories: string[];
  toggleCategory: (categoryName: string) => void;
  resetFilters: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  allCategories, 
  selectedCategories, 
  toggleCategory,
  resetFilters
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium">Filter by category:</h2>
        {selectedCategories.length > 0 && (
          <button 
            onClick={resetFilters}
            className="text-xs text-primary hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {allCategories.map(category => (
          <Badge
            key={category.id}
            variant={selectedCategories.includes(category.name) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleCategory(category.name)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
