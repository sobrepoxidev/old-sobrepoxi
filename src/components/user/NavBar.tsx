'use client'

import React, { useEffect, useState } from 'react'
import { useSupabase } from '@/app/supabase-provider/provider'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

interface NavLink {
  href: string
  label: string
  requiresAuth?: boolean
  highlight?: boolean // Indica si se destaca con un btn-primary
}

export default function Navbar() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Cargar la sesión inicial y escuchar cambios
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }
    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/') // Redirige al home
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  // Define tus links principales
  const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/tickets', label: 'Tickets', requiresAuth: true },
    { href: '/contact', label: 'Contact Us' }
  ]

  // Links si no está logueado
  const guestLinks: NavLink[] = [
    { href: '/login', label: 'Iniciar Sesión' },
    { href: '/register', label: 'Registrarse', highlight: true }
  ]

  // Para marcar la ruta actual
  const isActive = (href: string) => (pathname === href ? 'text-primary dark:text-primary hover:opacity-80 font-bold' : '')

  // Filtra links según la sesión
  const shownLinks = navLinks.filter(link => {
    if (link.requiresAuth) {
      return session // Muestra solo si hay sesión
    }
    return true
  })

  return (
    <header className="top-0 z-50 shadow-md transition-colors">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* 🔹 Logo / Branding */}
        <div className="text-2xl font-extrabold text-primary hover:opacity-90 transition">
          <a href="/">Web Demo</a>
        </div>

        {/* 🔹 Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-text-primary font-medium">
          {shownLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`hover:text-secondary transition-colors ${isActive(link.href)}`}
            >
              {link.label}
            </a>
          ))}
          
          {session ? (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-danger transition"
            >
              Cerrar Sesión
            </button>
          ) : (
            guestLinks.map(link => {
              const highlightClasses = link.highlight
                ? 'btn-primary px-4 py-2'
                : 'hover:text-secondary transition-colors'
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`${highlightClasses} ${isActive(link.href)}`}
                >
                  {link.label}
                </a>
              );
            })
          )}
        </div>

        {/* 🔹 Botón de Menú (Mobile) */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-text-primary" />
            )}
          </button>
        </div>
      </nav>

      {/* 🔹 Mobile Menu Refinado */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card px-6 py-4 shadow-md border-t border-gray-300 dark:border-gray-700 transition-all">
          <div className="flex flex-col text-text-primary font-medium space-y-4">
            {shownLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`hover:text-secondary transition-colors ${isActive(link.href)}`}
              >
                {link.label}
              </a>
            ))}

            {session ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-danger transition"
              >
                Cerrar Sesión
              </button>
            ) : (
              guestLinks.map(link => {
                const highlightClasses = link.highlight
                  ? 'btn-primary px-4 py-2'
                  : 'hover:text-secondary transition-colors';
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${highlightClasses} ${isActive(link.href)}`}
                  >
                    {link.label}
                  </a>
                );
              })
            )}
          </div>
        </div>
      )}
    </header>
  );
}
