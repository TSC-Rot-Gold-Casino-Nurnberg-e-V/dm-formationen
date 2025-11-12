import Link from "next/link";

export const Footer = () => (
  <footer className="container @container py-4 text-sm text-base-300 divide-y divide-base-700">
    <div className="grid @lg:grid-cols-2 gap-x-4 gap-y-2 pb-1 w-fit mx-auto">
      <div className="@lg:text-right justify-between @max-lg:flex items-center gap-2">
        <div className="text-xs text-base-400">Ausrichter</div>
        <Link
          className="hover:text-base-200 transition-colors"
          href="https://www.rot-gold-casino.de"
          target="_blank"
        >
          TSC Rot-Gold-Casino Nürnberg e.V
        </Link>
      </div>
      <div className="@max-lg:flex items-center justify-between gap-2">
        <div className="text-xs text-base-400">Veranstalter</div>
        <Link
          className="hover:text-base-200 transition-colors"
          href="https://www.tanzsport.de"
          target="_blank"
        >
          Deutscher Tanzsportverband e.V
        </Link>
      </div>
    </div>
    <div className="grid gap-4 grid-cols-2 mt-1">
      <Link
        className="hover:text-base-100 text-right transition-colors"
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
    </div>
  </footer>
);
