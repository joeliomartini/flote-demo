
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
    
    // If no parent is directly selected, check if a subcategory is selected
    // and if so, find its parent
    const selectedSubcategory = allCategories.find(cat => 
      cat.parent_id && selectedCategories.includes(cat.name)
    );
    
    if (selectedSubcategory) {
      return parentCategories.find(parent => parent.id === selectedSubcategory.parent_id) || null;
    }
    
    return null;
  }, [selectedCategories, allCategories]);

  // Get all parent categories
  const parentCategories = useMemo(() => {
    return allCategories.filter(cat => !cat.parent_id);
  }, [allCategories]);

  // Get subcategories of selected parent (if any)
  const subcategories = useMemo(() => {
    if (!selectedParentCategory) return [];
    return allCategories.filter(cat => cat.parent_id === selectedParentCategory.id);
  }, [selectedParentCategory, allCategories]);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium">Filter by category:</h2>
      
      <div className="flex flex-wrap gap-2">
        {parentCategories.map(category => (
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
      
      {selectedParentCategory && subcategories.length > 0 && (
        <div className="mt-3">
          <h3 className="text-xs font-medium mb-2">Subcategories:</h3>
          <div className="flex flex-wrap gap-2">
            {subcategories.map(subcategory => (
              <Badge
                key={subcategory.id}
                variant={selectedCategories.includes(subcategory.name) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleCategory(subcategory.name)}
              >
                {subcategory.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {selectedCategories.length > 0 && (
        <button 
          onClick={resetFilters}
          className="text-xs text-primary hover:underline"
        >
          Reset filters
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
