import type { Metadata } from "next";
import Link from "next/link";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Tickets | Deutsche Meisterschaft der Formationen 2026",
  description:
    "Ticketinformationen zur Deutschen Meisterschaft der Formationen 2026",
};

export default function TicketsPage() {
  return (
    <main className="container @container prose sm:prose-lg prose-invert prose-neutral mx-auto py-8">
      <h1 className="text-center">Tickets</h1>
      <p>
        Tanzsport-Formationen in Harmonie, pulsierende Schritte und klare
        Linien, ein Abend voller kontrollierter Energie und ästhetischer
        Präzision auf der Tanzfläche. Erleben Sie die Deutsche Meisterschaft der
        Formationen live in Nürnberg, präsentiert vom TSC Rot-Gold-Casino
        Nürnberg e.V., wenn Teams ihre Choreografien in perfekter Synchronität
        zeigen.
      </p>
      <p>
        Die Abendveranstaltung bietet spannende Zwischen- und Endrunden, bei dem
        jede Formation um technische Brillanz und gestalterische Ausdruckskraft
        kämpft. Genießen Sie die Atmosphäre in der Halle, wo rhythmische Kraft
        auf filigrane Präzision trifft.
      </p>
      <p>
        Lassen Sie sich dieses Highlight des Tanzsports nicht entgehen und
        erleben Sie erstklassige Leistungen auf der großen Bühne.
      </p>
      <div className="grid @xl:grid-cols-2 gap-6 mt-8">
        <section className="bg-base-800 p-6 rounded-4xl not-prose">
          <h2 className="text-primary-300 text-2xl md:text-3xl mb-4 font-bold">
            Tagesveranstaltung
          </h2>
          <div className="space-y-2">
            <div>
              <div className="text-base-300 text-sm">Einlass der Zuschauer</div>
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                13:30 Uhr
              </div>
            </div>
            <div>
              <div className="text-base-300 text-sm">Vorrunden</div>
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                14:30 Uhr
              </div>
            </div>
            <div>
              <div className="text-base-300 text-sm">Ende</div>
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                17:00 Uhr
              </div>
            </div>
          </div>
          <div className="not-prose border border-base-700 w-fit flex gap-2 mt-4 rounded-3xl text-xs px-3 py-2 text-base-400">
            <InformationCircleIcon className="size-4 shrink-0" />
            <p>Freie Platzwahl</p>
          </div>
          <Link
            href="https://www.eventim-light.com/de/a/62e933c3f787a077f3bcff90/e/69149735a899f2366e56ee8c?lang=de"
            target="_blank"
            className="container mt-4 block text-center not-prose bg-secondary-700 text-lg hover:bg-secondary-600 px-6 py-3 rounded-full transition-colors font-bold cursor-pointer !text-white"
          >
            Jetzt Tickets sichern
          </Link>
        </section>
        <section className="bg-base-800 p-6 rounded-4xl not-prose">
          <h2 className="text-primary-300 text-2xl md:text-3xl mb-4 font-bold">
            Abendveranstaltung
          </h2>
          <div className="space-y-2">
            <div>
              <div className="text-base-300 text-sm">Einlass der Zuschauer</div>
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                18:30 Uhr
              </div>
            </div>
            <div>
              <div className="text-base-300 text-sm">Zwischen- & Endrunden</div>
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                19:30 Uhr
              </div>
            </div>
            <div>
              <div className="text-base-300 text-sm">Ende</div>
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                23:45 Uhr
              </div>
            </div>
          </div>
          <div className="not-prose border border-base-700 w-fit flex gap-2 mt-4 rounded-3xl text-xs px-3 py-2 text-base-400">
            <InformationCircleIcon className="size-4 shrink-0" />
            <p>Sitzplatzanspruch</p>
          </div>
          <Link
            href="https://www.eventim-light.com/de/a/62e933c3f787a077f3bcff90/e/69027d9aac6f162b5182a918?lang=de"
            target="_blank"
            className="container mt-4 block text-center not-prose bg-secondary-700 text-lg hover:bg-secondary-600 px-6 py-3 rounded-full transition-colors font-bold cursor-pointer !text-white"
          >
            Jetzt Tickets sichern
          </Link>
        </section>
        <section className="bg-base-800 p-6 rounded-4xl not-prose @xl:col-span-2">
          <h2 className="text-primary-300 text-2xl md:text-3xl mb-4 font-bold">
            Kombinationsticket
          </h2>
          <div className="font-semibold text-base-100 text-xl sm:text-2xl mb-4">
            Tages- & Abendveranstaltung
          </div>
          <p>
            Profitieren Sie von unserem Kombinationsticket und sichern Sie sich
            Zugang zu beiden Veranstaltungen zu einem attraktiven Preis!
          </p>
          <div className="not-prose border border-base-700 mt-4  rounded-3xl text-sm p-3 text-base-400">
            <div className="flex gap-2">
              <InformationCircleIcon className="size-5 shrink-0" />
              <p>
                Für das Kombiticket nach Auswahl des Platzes unter
                &#34;Ermäßigungen und Buchungsoptionen&#34; den Kombipreis
                wählen und dann zur Kasse gehen.
              </p>
            </div>
          </div>

          <Link
            href="https://www.eventim-light.com/de/a/62e933c3f787a077f3bcff90/e/69027d9aac6f162b5182a918?lang=de"
            target="_blank"
            className="container mt-4 block text-center not-prose bg-secondary-700 text-lg hover:bg-secondary-600 px-6 py-3 rounded-full transition-colors font-bold cursor-pointer !text-white"
          >
            Jetzt Tickets sichern
          </Link>
        </section>
      </div>
      <div className="not-prose border border-base-700 mt-8  rounded-3xl text-sm p-3 text-base-400">
        <div className="flex gap-2">
          <InformationCircleIcon className="size-5 shrink-0" />
          <div className="space-y-2">
            <p>
              Kinder bis einschließlich 6 Jahren in Begleitung von
              Vollzahler:innen erhalten freien Eintritt ohne Sitzplatzanspruch
              (Schoßkinder). Sie benötigen kein eigenes Ticket.
            </p>
            <p>Alle Angaben ohne Gewähr! Änderungen vorbehalten.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
