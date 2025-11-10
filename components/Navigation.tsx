import Link from "next/link";

export const Navigation = () => (
  <header>
    <nav>
      <ul className="flex gap-4 ml-auto w-fit">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/teilnehmer">Teilnehmer</Link>
        </li>
        <li>
          <Link href="/zeitplan">Zeitplan</Link>
        </li>
        <li>
          <Link href="/tickets">Tickets</Link>
        </li>
        <li>
          <Link href="/hotels">Hotels</Link>
        </li>
        <li>
          <Link href="/presse">Presse</Link>
        </li>
        <li>
          <Link href="/livestream">Livestream</Link>
        </li>
        <li>
          <Link href="/anfahrt">Anfahrt</Link>
        </li>
      </ul>
    </nav>
  </header>
);
