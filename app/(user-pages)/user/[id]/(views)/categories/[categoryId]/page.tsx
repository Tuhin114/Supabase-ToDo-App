import CategoryMetrics from "@/components/layout/categories/CategoryMetrics";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string; categoryId: string }>;
}) {
  const resolvedParams = await params;

  return (
    <>
      <CategoryMetrics categoryId={resolvedParams.categoryId} />
    </>
  );
}
