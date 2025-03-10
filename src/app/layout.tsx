// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import type { Database } from '@/types-db'
import SupabaseProvider from './supabase-provider/provider'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navbar from '@/components/user/NavBar'
import  Footer  from '@/components/user/Footer'
import { CartProvider } from "@/components/context/CartContext";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sobrepoxi',
  description: 'Diseño & Mobiliario Exclusivo para Espacios Únicos',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="es" className="h-full">
       
    <body className={`h-full flex flex-col ${inter.className} bg-background text-foreground transition-colors`}>
   
      <SupabaseProvider session={session}>
      <CartProvider>
        
        {/* 🔹 NAVBAR (Client-Side) */}
        <Navbar />

        {/* 🔹 MAIN que empuja el footer */}
        <main className="flex-1 max-w-full mx-auto w-full ">
          {children}
        </main>

        

        {/* 🔹 FOOTER - Refinado */}
        
        <Footer />
        </CartProvider>
      </SupabaseProvider>
    </body>
  </html>
  )
}
