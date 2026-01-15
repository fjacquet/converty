// Root layout - minimal wrapper that just renders children
// The actual layout with i18n support is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
