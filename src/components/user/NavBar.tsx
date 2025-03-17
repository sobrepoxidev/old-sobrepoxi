'use client'

import React, { useEffect, useState } from 'react'
import { useSupabase } from '@/app/supabase-provider/provider'
import { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';

import { useRouter, usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

import { useTranslations } from 'next-intl';

import LocaleSwitcher from '@/components/user/LocaleSwitcher';

interface NavLink {
  href: string
  label: string
  requiresAuth?: boolean
  highlight?: boolean // Indica si se destaca con un btn-primary
}


export default function Navbar() {
  const t = useTranslations('header');
  const { supabase } = useSupabase()
  const router = useRouter()
  const pathname = usePathname() || "";
  const [session, setSession] = useState<Session | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


  console.log("PATHNAME: ", pathname)

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Activar el fondo cuando el scroll supere el 80% del alto de la ventana
      const scrolled = window.scrollY > window.innerHeight * 0.20;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setSession(null);
    router.push('/') // Redirige al home
  }

  // Define tus links principales
  const navLinks: NavLink[] = [
    { href: "/", label: t("navLinks.home") },
    { href: "/about-us", label: t("navLinks.about") },
    { href: "/gallery", label: t("navLinks.gallery") },
    { href: "/poxicards", label: t("navLinks.poxicards") },
    { href: "/contact-us", label: t("navLinks.contact") }
  ];

  // Links si no está logueado
  const guestLinks: NavLink[] = [
    { href: "/login", label: t("guestLinks.login") },
    { href: "/register", label: t("guestLinks.register"), highlight: true }
  ];

  // Obtener ruta sin locale
  const segments = pathname.split('/')
  let pathWithoutLocale = '/' + segments.slice(2).join('/')
  pathWithoutLocale = pathWithoutLocale.replace(/\/+$/, '') || '/'

  const isActive = (href: string) => {
    const normalizedHref = href.replace(/\/+$/, '')
    
    // Caso especial para el home
    if (normalizedHref === '') {
      return pathWithoutLocale === '/' ? 'active' : ''
    }
  
    return pathWithoutLocale === normalizedHref || 
           pathWithoutLocale.startsWith(`${normalizedHref}/`) ? 'active' : ''
  }

  // Filtra links según la sesión
  const shownLinks = navLinks.filter(link => {
    if (link.requiresAuth) {
      return session // Muestra solo si hay sesión
    }
    return true
  })

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-sky-100 dark:bg-[#2D3748] shadow-md}' 
        : 'bg-transparent shadow-none' 
    }`} style={{ backdropFilter: `${ isScrolled  ? "" : "blur(1px)"}` }}>
      <nav className="max-w-full mx-auto pl-1 sm:px-4 py-0 flex items-center justify-between">

        {/* 🔹 Logo / Branding */}
        <div className="flex items-center">
          <Link href="/" className="flex items-start space-x-1 group">
            {/* Logo SVG de Sobrepoxi */}
            <Image
              src="/logo3.svg"
              alt="Sobrepoxi"
              width={27}
              height={27}
              className="w-15 h-15 pt-0.5 "
            />
            <span className={`text-2xl pl-0 ml-0 font-extrabold transition-colors ${
        isScrolled 
          ? 'text-primary dark:text-white' 
          : ' dark:text-gray-100'
      }`}>
              Sobrepoxi
            </span>
          </Link>
        </div>
        

        {/* 🔹 Desktop Menu */}
        <div className="hidden md:flex items-center space-x-5 text-text-primary font-medium">
        <LocaleSwitcher  />
          {shownLinks.map(link => (
            <Link
            key={link.href}
            href={link.href}
            className={`nav-link transition-colors 
              ${isScrolled 
                ? 'text-gray-800 dark:text-gray-200 hover:text-secondary' 
                : 'dark:text-gray-100 hover:text-gray-300 hover:text-secondary'} 
              ${isActive(link.href)}`}
          >
            {link.label}
          </Link>
          ))}

          

          {session ? (
            <button
              onClick={handleLogout}
              className="nav-link text-sm hover:text-danger transition-colors"
            >
             {t("logout")}
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              {guestLinks.map(link => {
                const highlightClasses = link.highlight
                  ? 'btn-primary dark:text-white px-1 py-1   shadow-lg shadow-primary/20'
                  : 'nav-link dark:text-white hover:text-secondary transition-colors';
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`${highlightClasses} ${isActive(link.href) ? 'active' : ''}`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
            
          )}
          
        </div>

        {/* 🔹 Botón de Menú (Mobile) */}
        <div className="md:hidden flex items-center">
        <LocaleSwitcher  />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 rounded-full bg-gray-light dark:bg-gray-dark hover:bg-primary/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-primary dark:text-white" />
            ) : (
              <Menu className="h-6 w-6 text-primary dark:text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* 🔹 Mobile Menu Refinado */}
      <div
        className={`md:hidden bg-white dark:bg-[#2D3748] border-t border-gray-light dark:border-gray-dark overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="flex flex-col text-text-primary font-medium space-y-5 px-6 py-5">
          {shownLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`transform transition hover:translate-x-2 text-gray-dark dark:text-gray-light hover:text-secondary dark:hover:text-secondary ${isActive(link.href) ? 'text-primary dark:text-secondary font-semibold' : ''
                }`}
            >
              {link.label}
            </a>
          ))}

          <div className="border-t border-gray-light dark:border-gray pt-4 mt-4">
            {session ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className=" text-gray-600 hover:text-danger transition-colors w-full text-left py-2"
              >
                {t("logout")}
              </button>
            ) : (
              <div className="flex flex-col space-y-3">
                {guestLinks.map(link => {
                  const highlightClasses = link.highlight
                    ? 'btn-primary text-center rounded-full'
                    : 'text-gray-dark dark:text-gray-light hover:text-secondary dark:hover:text-secondary transition-colors';
                  return (
                    <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${highlightClasses} ${isActive(link.href) ? 'text-primary dark:text-secondary' : ''}`}
                  >
                    {link.label}
                  </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
