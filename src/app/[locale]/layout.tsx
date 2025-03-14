// app/[locale]/layout.tsx

import { ReactNode } from 'react';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from '@/types-db';
import SupabaseProvider from '@/app/supabase-provider/provider';

import Navbar from '@/components/user/NavBar';
import Footer from '@/components/user/Footer';
import { CartProvider } from "@/components/context/CartContext";

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })



export async function generateStaticParams() {
  // Rutas estáticas para build: /en y /es
  return [{ locale: 'en' }, { locale: 'es' }];
}

// Este layout se invoca en /[locale]/..., por lo que param.lang es "es" o "en"
export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{locale: string}>
  ;
}) {
  // // 1) Verificamos que locale sea válido
  // if (!['en', 'es'].includes(params.locale)) {
  //   notFound(); // Permitido aquí, NO en root layout
  // }

  // // 2) Cargar las traducciones
  // let messages;
  // try {
  //   messages = (await import(`../../locales/${params.locale}.json`)).default;
  // } catch (error) {
  //   notFound();
  // }

  const {locale} = await params;


  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 

  // 3) Crear Supabase Client con cookies
// 3) Crear Supabase Client con cookies
const cookieStore = cookies();
const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  // 4) Obtener la sesión (por si necesitas user, etc.)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 5) Render
  return (
    <html lang={locale}>
      <body className={`h-full flex flex-col ${inter.className}`}>
        <NextIntlClientProvider>
          {/* Proveedor de Supabase con la session */}
          <SupabaseProvider session={session}>
            {/* Proveedor de carrito */}
            <CartProvider>
            <Navbar />
              {/* Contenido principal crece y empuja el footer hasta el final */}
              <main className="flex-grow">{children}</main>
              {/* Footer siempre al final */}
              <Footer />
            </CartProvider>
          </SupabaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
