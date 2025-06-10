import { Category } from "@/types/Task";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export function useCategories() {
  const queryClient = useQueryClient();

  // GET categories
  const fetchCategories = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/task/category");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });

  // GET category name by id
  const getCategoryNameById = (id: string): string => {
    const cached = queryClient.getQueryData<Category[]>(["categories"]);
    return cached?.find((c) => c.id === id)?.name ?? "";
  };

  // ADD category (optional for completeness)
  const addCategory = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/task/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to add category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // UPDATE category
  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await fetch(`/api/category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to update category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // DELETE category
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/category/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    fetchCategories,
    getCategoryNameById,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
