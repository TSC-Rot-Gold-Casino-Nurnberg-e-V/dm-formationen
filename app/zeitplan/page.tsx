import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zeitplan | Deutsche Meisterschaft der Formationen 2026",
  description: "Zeitplan der Deutschen Meisterschaft der Formationen 2026",
};

export default function ZeitplanPage() {
  return (
    <main className="container prose sm:prose-lg prose-invert prose-neutral mx-auto py-8">
      <h1 className="text-center">Zeitplan</h1>
      <div className="w-fit mx-auto">
        <section>
          <h2 className="text-primary-300 pb-2">Nachmittagsveranstaltung</h2>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <div className="space-y-3">
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                13:30 Uhr
              </div>
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                14:30 Uhr
              </div>
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                17:00 Uhr
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-base-300">Einlass der Zuschauer</div>
              <div className="text-base-300">Vorrunden</div>
              <div className="text-base-300">Ende</div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-primary-300">Abendveranstaltung</h2>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <div className="space-y-3">
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                18:30 Uhr
              </div>
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                19:30 Uhr
              </div>
              <div className="font-black text-base-100 text-xl sm:text-2xl">
                23:45 Uhr
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-base-300">Einlass der Zuschauer</div>
              <div className="text-base-300">Zwischen- und Endrunden</div>
              <div className="text-base-300">Ende</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
