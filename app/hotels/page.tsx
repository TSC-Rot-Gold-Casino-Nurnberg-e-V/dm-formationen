import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotels | Deutsche Meisterschaft der Formationen 2026",
  description:
    "Empfohlene Hotels und Unterkünfte für die Deutsche Meisterschaft der Formationen 2026",
};

export default function HotelsPage() {
  return (
    <main className="container !max-w-xl prose sm:prose-lg prose-invert prose-neutral mx-auto py-8">
      <h1 className="text-center">Hotels</h1>
      <p>
        Informationen zu empfohlenen Hotels in der Nähe der KIA Metropol Arena
        werden hier rechtzeitig vor der Veranstaltung veröffentlicht.
      </p>
    </main>
  );
}
