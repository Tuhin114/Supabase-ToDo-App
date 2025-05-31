import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Category {
  id: string;
  name: string;
}

export interface TaskCategoryProps {
  categories: Category[];
  defaultCategory?: Category | null;
}

export default function TaskCategory({
  categories,
  defaultCategory,
}: TaskCategoryProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [localCategories, setLocalCategories] =
    useState<Category[]>(categories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    defaultCategory || null
  );

  const handleCategorySelect = (value: string) => {
    const selected = localCategories.find((c) => c.id === value);
    if (selected) {
      setSelectedCategory(selected);
    }
  };

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) return;

    const existing = localCategories.find(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existing) {
      setSelectedCategory(existing);
    } else {
      const newCategory: Category = {
        id: uuidv4(),
        name: trimmedName,
      };
      setLocalCategories((prev) => [...prev, newCategory]);
      setSelectedCategory(newCategory);
    }

    setNewCategoryName("");
    setIsAddingCategory(false);
  };

  const handleCancel = () => {
    setNewCategoryName("");
    setIsAddingCategory(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddCategory();
    else if (e.key === "Escape") handleCancel();
  };

  return (
    <div className="space-y-2">
      {/* Hidden form fields for form submission */}
      <input
        type="hidden"
        name="categoryId"
        value={selectedCategory?.id || ""}
      />
      <input
        type="hidden"
        name="categoryName"
        value={selectedCategory?.name || ""}
      />

      <Label htmlFor="category-select">Category</Label>

      <div className="flex gap-2">
        <Select
          value={selectedCategory?.id || ""}
          onValueChange={handleCategorySelect}
        >
          <SelectTrigger id="category-select" className="flex-1">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {localCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              aria-label="Add new category"
            >
              Add
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-category-name">Category Name</Label>
                <Input
                  id="new-category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter category name"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                >
                  Add Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
