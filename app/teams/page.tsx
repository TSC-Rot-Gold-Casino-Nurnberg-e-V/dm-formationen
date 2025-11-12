import { InformationCircleIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams | Deutsche Meisterschaft der Formationen 2026",
  description:
    "Die qualifizierten Teams für die Deutsche Meisterschaft der Formationen 2026",
};

export default function TeamsPage() {
  return (
    <main className="container !max-w-xl prose sm:prose-lg prose-invert prose-neutral mx-auto py-8">
      <h1 className="text-center">Teams</h1>
      <p>
        Die jeweils 8 besten Mannschaften Deutschlands aus der Standard- und
        Lateinsektion dürfen bei der Deutschen Meisterschaft an den Start gehen.
      </p>
      <div className="not-prose border border-base-700 flex gap-2 rounded-3xl text-sm p-3 text-base-400">
        <InformationCircleIcon className="size-5 shrink-0" />
        <div>
          Die qualifizierten Teams stehen erst nach Abschluss der
          Bundesligasaison 2026 fest und werden danach hier veröffentlicht.
        </div>
      </div>
    </main>
  );
}
