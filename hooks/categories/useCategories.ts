// export const useCategories = () => {
//   const fetchCategories = useQuery({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const res = await fetch("/task/category");
//       if (!res.ok) throw new Error("Failed to fetch categories");
//       return res.json();
//     },
//     enabled: true,
//   });

import { useQuery, useQueryClient } from "@tanstack/react-query";

//   return fetchCategories;
// };

export function useCategories() {
  const queryClient = useQueryClient();

  // Fetch all the categories
  const fetchCategories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/task/category");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const categories = await res.json();
      queryClient.setQueryData(["categories"], categories);
      return categories;
    },
    enabled: true,
  });

  // Add new category
  const addCategory = async (name: string) => {
    const res = await fetch("/task/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to add category");
    return res.json();
  };

  // Update category
  const updateCategory = async (id: string, name: string) => {
    const res = await fetch(`/task/category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to update category");
    return res.json();
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    const res = await fetch(`/task/category/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete category");
    return res.json();
  };

  return { fetchCategories, addCategory, updateCategory, deleteCategory };
}
