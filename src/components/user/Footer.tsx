export default function Footer() {
    return (
        <footer className="mt-auto bg-blue-500 py-6 transition-colors border-t border-gray-300 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 text-center text-text-secondary dark:text-text-secondary">
          <p className="text-sm tracking-wide">
            © {new Date().getFullYear()} - <span className="font-semibold text-primary">Sobrepoxi</span>. Todos los derechos reservados.
          </p>
        </div>
      </footer>
);
}