"use client";

import React, { useEffect, useState } from "react";
import { useSupabase } from "@/app/supabase-provider/provider";
import { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import LocaleSwitcher from "@/components/user/LocaleSwitcher";

interface NavLink {
  href: string;
  label: string;
  requiresAuth?: boolean;
  highlight?: boolean; // Indica si se destaca con un btn-primary
}

export default function Navbar() {
  const t = useTranslations("header"); // <-- Ajusta el namespace a tu conveniencia
  const { supabase } = useSupabase();
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cargar la sesión inicial y escuchar cambios
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push("/"); // Redirige al home
  };

  // Define tus links principales (usando traducciones)
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

  // Para marcar la ruta actual
  const isActive = (href: string) =>
    pathname === href ? "text-primary-light font-bold" : "";

  // Filtra links según la sesión
  const shownLinks = navLinks.filter(link => {
    if (link.requiresAuth) {
      return session; // Muestra solo si hay sesión
    }
    return true;
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent transition-colors">
      <nav className="max-w-full mx-auto px-4 py-1 flex items-center justify-between text-white">
        {/* 🔹 Logo / Branding */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-0 group">
            {/* Logo SVG de Sobrepoxi */}
            <Image 
              src="/logo.png" 
              alt="Sobrepoxi Logo" 
              width={60} 
              height={60} 
              priority 
            />
            <span className="text-2xl font-extrabold text-white hover:opacity-90 transition">
              {t("brand")} {/* "Sobrepoxi" en ambos idiomas, aunque podrías cambiarlo. */}
            </span>
          </Link>
        </div>

        {/* 🔹 Desktop Menu */}
        <div className="hidden md:flex items-center space-x-5 font-medium">
          <LocaleSwitcher />
          {shownLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link text-white dark:text-red-400  hover:text-white hover:opacity-80 transition-colors ${isActive(link.href)}`}
            >
              {link.label}
            </a>
          ))}

          {session ? (
            <button
              onClick={handleLogout}
              className="text-sm text-white hover:text-white hover:opacity-70 transition-colors"
            >
              {t("logout")} {/* "Cerrar Sesión" ó "Log Out" */}
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              {guestLinks.map(link => {
                const highlightClasses = link.highlight
                  ? "btn-primary px-2 py-1 rounded-lg text-white shadow-md hover:bg-blue-600 transition-all"
                  : "nav-link text-white hover:text-white hover:opacity-80 transition-colors";

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`${highlightClasses} ${isActive(link.href)}`}
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
          <LocaleSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t("toggleMenu")} /* "Toggle Menu" / "Abrir/Cerrar Menú" */
            className="p-2 rounded-full hover:bg-primary/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* 🔹 Mobile Menu Refinado */}
      <div
        className={`md:hidden bg-black/90 border-t border-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col font-medium space-y-5 px-6 py-5">
          {shownLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`transform transition hover:translate-x-2 text-white hover:text-white hover:opacity-80 ${
                isActive(link.href)
                  ? "text-white font-semibold"
                  : ""
              }`}
            >
              {link.label}
            </a>
          ))}

          <div className="border-t border-gray-700 pt-4 mt-4">
            {session ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-white hover:text-white hover:opacity-70 transition-colors w-full text-left py-2"
              >
                {t("logout")}
              </button>
            ) : (
              <div className="flex flex-col space-y-3">
                {guestLinks.map(link => {
                  const highlightClasses = link.highlight
                    ? "btn-primary text-center rounded-full text-white"
                    : "text-white hover:text-white hover:opacity-80 transition-colors";
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${highlightClasses} py-2 ${
                        isActive(link.href) ? "font-semibold" : ""
                      }`}
                    >
                      {link.label}
                    </a>
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