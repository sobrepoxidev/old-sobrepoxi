import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nvnsptdwijqnetahaojg.supabase.co', // TU dominio de Supabase
        pathname: '/storage/v1/object/public/**', // Permitir todas las imágenes en el bucket público
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
