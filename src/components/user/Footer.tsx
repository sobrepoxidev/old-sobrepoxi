
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-auto bg-blue-500 py-6 transition-colors border-t border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 text-center text-text-secondary dark:text-text-secondary">
        
        {/* Mensajes legales */}
        <p className="text-sm tracking-wide mb-2">
          {/* Ejemplo usando `t.rich` para inyectar el año y formatear algo en bold */}
          {t.rich("copyright", {
            year: new Date().getFullYear(),
            bold: (chunks) => <span className="font-semibold text-primary">{chunks}</span>
          })}
        </p>
        <p className="text-sm">{t("allRightsReserved")}</p>

        {/* Enlace a Términos y Condiciones */}
        <div className="mt-4">
          <Link href="/terms" className="underline hover:text-secondary">
            {t("termsAndConditions")}
          </Link>
        </div>

        {/* Redes sociales */}
        <div className="mt-4 flex justify-center items-center space-x-4">
          <span>{t("followUs")}:</span>
          <Link href="https://facebook.com" target="_blank" className="hover:text-secondary">
            {t("socialLinks.facebook")}
          </Link>
          <Link href="https://instagram.com" target="_blank" className="hover:text-secondary">
            {t("socialLinks.instagram")}
          </Link>
          <Link href="https://wa.me/XXXXXXXXX" target="_blank" className="hover:text-secondary">
            {t("socialLinks.whatsapp")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
