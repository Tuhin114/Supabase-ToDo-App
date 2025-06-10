// CategoryUpdateModal.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
  onUpdate: (data: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function CategoryUpdateModal({
  isOpen,
  onClose,
  categoryId,
  categoryName,
  onUpdate,
  isLoading = false,
}: CategoryUpdateModalProps) {
  const [name, setName] = useState(categoryName);

  // Reset name when modal opens with new category data
  useEffect(() => {
    if (isOpen) {
      setName(categoryName);
    }
  }, [isOpen, categoryName]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (name.trim() && name.trim() !== categoryName) {
        onUpdate({ id: categoryId, name: name.trim() });
      }
      onClose();
    },
    [name, categoryName, categoryId, onUpdate, onClose]
  );

  const handleClose = useCallback(() => {
    setName(categoryName); // Reset to original name
    onClose();
  }, [categoryName, onClose]);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    []
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>
            Make changes to your category name here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                className="col-span-3"
                placeholder="Enter category name"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
