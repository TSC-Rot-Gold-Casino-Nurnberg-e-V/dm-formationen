import { InformationCircleIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Presse | Deutsche Meisterschaft der Formationen 2026",
  description:
    "Presseinformationen zur Deutschen Meisterschaft der Formationen 2026",
};

export default function PressePage() {
  return (
    <main className="container prose sm:prose-lg prose-invert prose-neutral mx-auto py-8">
      <h1 className="text-center">Presse</h1>
      <p>
        Informationen zu Presseakkreditierungen, Medienkontakten und Downloads
        werden hier in Kürze bereitgestellt.
      </p>
      <div className="not-prose border border-base-700 flex gap-2 rounded-3xl text-sm p-3 text-base-400">
        <InformationCircleIcon className="size-5 shrink-0" />
        <div className="flex flex-wrap gap-2">
          <div>Für Presseanfragen wenden Sie sich bitte an:</div>
          <Link href="mailto:pressewart@rot-gold-casino.de">
            pressewart@rot-gold-casino.de
          </Link>
        </div>
      </div>
    </main>
  );
}
