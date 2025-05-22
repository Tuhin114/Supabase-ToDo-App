export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>;
}
