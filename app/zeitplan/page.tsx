import type { Metadata } from "next";
import { EventDateChip } from "@/components/EventDateChip";

export const metadata: Metadata = {
  title: "Zeitplan | Deutsche Meisterschaft der Formationen 2026",
  description: "Zeitplan der Deutschen Meisterschaft der Formationen 2026",
};

export default function ZeitplanPage() {
  return (
    <main className="container prose sm:prose-lg prose-invert prose-neutral mx-auto py-8">
      <h1 className="text-center">Zeitplan</h1>
      <EventDateChip className="container" />
      <div className="w-full sm:w-fit mx-auto">
        <section>
          <h2 className="text-primary-300 !mt-10">Nachmittagsveranstaltung</h2>
          <div className="grid grid-cols-[max-content_minmax(0,1fr)] items-start gap-x-3 gap-y-3">
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              13:30 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Einlass Zuschauer
            </div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              14:30 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">Begrüßung</div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              14:40 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Vorrunde Latein
            </div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              15:45 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Ende Vorrunde Latein
            </div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              16:00 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Vorrunde Standard
            </div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              17:05 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Ende Nachmittagsveranstaltung
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-primary-300">Abendveranstaltung</h2>
          <div className="grid grid-cols-[max-content_minmax(0,1fr)] items-start gap-x-3 gap-y-3">
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              18:30 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Einlass Zuschauer
            </div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              19:30 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">Begrüßung</div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              19:35 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Vorstellung aller Teams Latein &amp; Standard
            </div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              20:00 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Zwischenrunde Latein
            </div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              20:55 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Zwischenrunde Standard
            </div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              21:45 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">Pause</div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              22:15 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Finale Latein
            </div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              22:55 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Finale Standard
            </div>
            <div className="font-black text-base-100 text-xl sm:text-2xl whitespace-nowrap">
              23:40 Uhr
            </div>
            <div className="min-w-0 break-words text-base-300">
              Siegerehrung
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
