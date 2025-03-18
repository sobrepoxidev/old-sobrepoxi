import Image from "next/image";
import { revalidatePath } from "next/cache";
import { useTranslations } from "next-intl";

// Declaramos la acción del formulario:
async function handleSubmit(formData: FormData) {
  "use server";

  // Obtenemos los campos
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const subject = formData.get("subject")?.toString() || "";
  const message = formData.get("message")?.toString() || "";

  // Aquí podrías conectarte a una base de datos, enviar un correo,
  // llamar a una API o lo que desees.
  // Por demo, haremos un simple console.log:
  console.log("Nuevo mensaje recibido:");
  console.log({ name, email, subject, message });

  // Si deseas, puedes refrescar la ruta actual tras procesar el form:
  revalidatePath("/contact-us");
}


export default function ContactPage() {
  const t = useTranslations("contact"); 
  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Portada/Hero Contacto */}
      <section className="relative w-full h-[60vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/contact.webp"
          alt="Contacta a Sobrepoxi"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-white/5 dark:bg-black/5 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
            {t("hero.title")}
          </h1>
          <p className="max-w-2xl text-lg md:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Sección de Información de Contacto */}
      <section className="py-12 md:py-7 bg-card px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Información de la Empresa */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("info.heading")}
            </h2>
            <p className="text-base md:text-lg text-text-secondary mb-4 leading-relaxed">
              {t("info.description")}
            </p>

            <div className="flex items-center mb-3">
              <svg
                className="w-6 h-6 text-secondary mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 10.5a8.38 8.38 0 01-.9 3.8l-1.66 3a2.1 2.1 0 01-2.88.88l-.89-.44a2.1 2.1 0 00-2.29.24l-2.2 1.76a2.1 2.1 0 01-2.8-.3l-1.6-1.9a2.1 2.1 0 01.24-2.89l2.2-1.76a2.1 2.1 0 00.74-2l-.34-1.02a2.1 2.1 0 01.88-2.5l3-1.7a8.38 8.38 0 013.8-.9c4.64 0 8.41 3.77 8.41 8.41z"
                />
              </svg>
              <p className="text-base md:text-lg text-text-secondary">
                {t("contactDetails.phone")}
              </p>
            </div>

            <div className="flex items-center mb-3">
              <svg
                className="w-6 h-6 text-secondary mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 2H8a2 2 0 00-2 2v2c0 3.95 3.58 7.16 8 7.16s8-3.21 8-7.16V4a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10a9 9 0 0118 0v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4z"
                />
              </svg>
              <p className="text-base md:text-lg text-text-secondary">
                {t("contactDetails.email")}
              </p>
            </div>

            <div className="flex items-center mb-3">
              <svg
                className="w-6 h-6 text-secondary mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                />
              </svg>
              <p className="text-base md:text-lg text-text-secondary">
                {t("contactDetails.location")}
              </p>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="bg-background p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4">
              {t("form.heading")}
            </h3>
            
            <form action={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-base font-medium mb-1">
                  {t("form.labels.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full border border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder={t("form.placeholders.name")}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-base font-medium mb-1">
                  {t("form.labels.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full border border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder={t("form.placeholders.email")}
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-base font-medium mb-1">
                  {t("form.labels.subject")}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full border border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder={t("form.placeholders.subject")}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-base font-medium mb-1">
                  {t("form.labels.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full border border-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder={t("form.placeholders.message")}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-primary px-6 py-3 text-lg font-bold w-full md:w-auto"
              >
                {t("form.button")}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Mapa o Sección Final (Opcional) */}
      <section className="py-12 md:py-20 bg-card px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("footer.heading")}
          </h2>
          <p className="text-base md:text-lg text-text-secondary mb-8">
            {t("footer.description")}
          </p>
        </div>
      </section>
    </div>
  );
}

