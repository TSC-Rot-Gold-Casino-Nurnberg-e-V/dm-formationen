import Link from "next/link";

export const Footer = () => (
  <footer className="container flex gap-4 justify-center py-4 text-sm text-base-200">
    <Link
      className="hover:text-base-100 transition-colors"
      href="https://www.rot-gold-casino.de/impressum"
      target="_blank"
    >
      Impressum
    </Link>
    <Link
      className="hover:text-base-100 transition-colors"
      href="https://www.rot-gold-casino.de/datenschutzerklaerung"
      target="_blank"
    >
      Datenschutz
    </Link>
  </footer>
);
