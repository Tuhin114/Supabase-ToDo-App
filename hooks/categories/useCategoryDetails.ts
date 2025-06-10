import { useQuery } from "@tanstack/react-query";

export function useCategoryDetails() {
  // Helper to map client range to API range
  function mapRange(range: string): "week" | "month" | "year" {
    switch (range) {
      case "this-week":
        return "week";
      case "this-month":
        return "month";
      case "this-year":
        return "year";
      default:
        return "week";
    }
  }

  function getCategoryMetrics(id: string, range: string) {
    const apiRange = mapRange(range);

    return useQuery({
      queryKey: ["categoryMetrics", id, apiRange],
      queryFn: async () => {
        const res = await fetch(
          `/api/category-details/${id}?range=${apiRange}`
        );
        if (!res.ok) throw new Error("Failed to fetch category metrics");
        return res.json();
      },
      enabled: !!id && !!range,
    });
  }

  return { getCategoryMetrics };
}
