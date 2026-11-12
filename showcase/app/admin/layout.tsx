export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Individual sub-routes handle their own layout shells
  return <>{children}</>;
}
