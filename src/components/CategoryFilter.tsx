import React, { useMemo } from "react";
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
  // Find the currently selected parent category (if any)
  const selectedParentCategory = useMemo(() => {
    if (selectedCategories.length === 0) return null;
    
    // Find parent categories
    const parentCategories = allCategories.filter(cat => !cat.parent_id);
    
    // Check if a parent category is selected
    for (const parent of parentCategories) {
      if (selectedCategories.includes(parent.name)) {
        return parent;
      }
    }
    
    return null;
  }, [selectedCategories, allCategories]);

  // Determine which categories to display
  const displayedCategories = useMemo(() => {
    // If a parent category is selected, show its subcategories
    if (selectedParentCategory) {
      return allCategories.filter(cat => 
        cat.parent_id === selectedParentCategory.id || cat.id === selectedParentCategory.id
      );
    }
    // Otherwise, show only parent categories
    return allCategories.filter(cat => !cat.parent_id);
  }, [selectedParentCategory, allCategories]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium">
          {selectedParentCategory 
            ? `Filter by ${selectedParentCategory.name} subcategories:` 
            : "Filter by category:"}
        </h2>
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
        {displayedCategories.map(category => (
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
