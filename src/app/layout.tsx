// app/layout.tsx

import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Sobrepoxi',
  description: 'Diseño & Mobiliario Exclusivo para Espacios Únicos',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
