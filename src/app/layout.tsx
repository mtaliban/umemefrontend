// Minimal root layout — locale-aware layout is in [locale]/layout.tsx
// Middleware handles locale redirects
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
