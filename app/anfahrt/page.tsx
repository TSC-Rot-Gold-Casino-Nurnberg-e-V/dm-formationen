import {
  ArrowRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anfahrt | Deutsche Meisterschaft der Formationen 2026",
  description:
    "Informationen zur Anfahrt zur Deutschen Meisterschaft der Formationen 2026",
};

export default function AnfahrtPage() {
  return (
    <main className="container !max-w-xl prose sm:prose-lg space-y-8 prose-invert prose-neutral mx-auto py-8">
      <h1 className="text-center">Anfahrt</h1>
      <section className="not-prose bg-base-800 rounded-3xl px-4 sm:px-6 py-3 sm:py-5">
        <h2 className="mb-2 text-2xl font-semibold text-base-100">
          KIA Metropol Arena
        </h2>
        <div>Dr.-Ingeborg-Bausenwein-Straße 1</div>
        <div>90431 Nürnberg</div>
        <Link
          className="flex p-2 -m-2 ml-auto mt-0 w-fit items-center hover:text-primary-200 transition-colors text-primary-300 gap-2"
          href="https://kia-metropol-arena.de"
          target="_blank"
        >
          <div>Zur Webseite der Arena</div>
          <ArrowRightIcon className="size-4 stroke-2" />
        </Link>
      </section>
      <section className="not-prose bg-base-800 rounded-3xl px-4 sm:px-6 py-3 sm:py-5">
        <h2 className="mb-2 text-2xl font-semibold text-base-100">
          Anfahrt mit dem Auto
        </h2>
        <h3 className="font-semibold text-xl text-base-100 mb-1">
          Aus Richtung Würzburg
        </h3>
        <p className="text-base mb-6">
          Über die A3 bis Kreuz Fürth-Erlangen, dann A73 Richtung Nürnberg/Fürth
          (Frankenschnellweg) – Ausfahrt „Nürnberg-West“, rechts in die
          Von-der-Tann-Straße (B4R), nach ca. 2,2 km rechts in „Am Tillypark“.
          Die Arena liegt auf der linken Seite.
        </p>
        <h3 className="font-semibold text-xl text-base-100 mb-1">
          Aus Richtung München
        </h3>
        <p className="text-base mb-6">
          Über die A9 bis Dreieck Nürnberg-Feucht, weiter auf A73 Richtung
          Nürnberg/Fürth, dann an der Ausfahrt Schweinau Richtung Fernmeldeturm.
          Danach links in die Hansastraße, etwas weiter links in die
          Gustav-AdolfStraße (B4R), und dann links in „Am Tillypark“.
        </p>
        <div className="not-prose border border-secondary-300 flex gap-2 rounded-3xl text-sm p-3 text-secondary-300">
          <InformationCircleIcon className="size-5 shrink-0" />
          <p>
            Die Arena empfiehlt aufgrund zahlreicher Straßenbauarbeiten auf den
            Zufahrtsstraßen die Anreise mit dem ÖPNV oder eine sehr frühzeitige
            Anfahrt mit dem PKW.
          </p>
        </div>
      </section>
      <section className="not-prose bg-base-800 rounded-3xl px-4 sm:px-6 py-3 sm:py-5">
        <h2 className="mb-2 text-2xl font-semibold text-base-100">Parken</h2>
        <p className="text-base">
          Es gibt direkt auf dem Gelände etwa 237 PKW-Parkplätze (davon 20
          ausgewiesene Behindertenparkplätze).
        </p>
        <p className="text-base">
          Zudem stehen bei Großveranstaltungen Ausweichparkplätze z. B. beim
          Gelände von BoschGmbH (Tillystraße 38, 90431 Nürnberg) zur Verfügung.
        </p>
      </section>
      <section className="not-prose bg-base-800 rounded-3xl px-4 sm:px-6 py-3 sm:py-5">
        <h2 className="mb-2 text-2xl font-semibold text-base-100">
          Öffentliche Verkehrsmittel
        </h2>
        <p className="text-base">
          Die Arena ist sehr gut angebunden mit ÖPNV: U-Bahn, S-Bahn und
          Buslinien liegen in Laufnähe.
        </p>
        <p className="text-base">
          Beispiel: U-Bahn-Haltestelle „Gustav-Adolf-Straße“ etwa 500 m
          entfernt.
        </p>
        <p className="text-base">
          Auch Buslinien wie 35 und 68 halten in unmittelbarer Nähe
          („Geisseestraße“) zur Arena.
        </p>
      </section>
    </main>
  );
}
