// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import type { Database } from '@/types-db'
import SupabaseProvider from './supabase-provider/provider'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navbar from '@/components/user/NavBar'
import FloatingTicket from '@/components/user/FloatingTicket';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ticket Demo',
  description: 'Demo para compra y edición de tickets',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en" className="h-full">
       
    <body className={`h-full flex flex-col ${inter.className} bg-background text-foreground transition-colors`}>
   
      <SupabaseProvider session={session}>
        
        {/* 🔹 NAVBAR (Client-Side) */}
        <Navbar />

        {/* 🔹 MAIN que empuja el footer */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        

        {/* 🔹 FOOTER - Refinado */}
        <footer className="mt-auto bg-slate-500 py-6 transition-colors border-t border-gray-300 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 text-center text-text-secondary dark:text-text-secondary">
            <p className="text-sm tracking-wide">
              © {new Date().getFullYear()} - <span className="font-semibold text-primary">Web Demo</span>. Todos los derechos reservados.
            </p>
          </div>
        </footer>

      </SupabaseProvider>
    </body>
  </html>
  )
}
