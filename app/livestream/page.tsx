import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livestream | Deutsche Meisterschaft der Formationen 2026",
  description:
    "Informationen zum Livestream der Deutschen Meisterschaft der Formationen 2026",
};

export default function LivestreamPage() {
  return (
    <main className="container !max-w-xl prose sm:prose-lg prose-invert prose-neutral mx-auto py-8">
      <h1 className="text-center">Livestream</h1>
      <p>
        Informationen zum Livestream der Deutschen Meisterschaft der Formationen
        2026 werden hier rechtzeitig vor der Veranstaltung veröffentlicht.
      </p>
    </main>
  );
}
