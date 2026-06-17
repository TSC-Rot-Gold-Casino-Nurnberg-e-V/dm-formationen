import { InformationCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";
import Link from "next/link";
import { AccreditationForm } from "@/components/AccreditationForm";
import { CopyButton } from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "Presse-Akkreditierung | Deutsche Meisterschaft der Formationen 2026",
  description:
    "Akkreditierungsformular für Medienvertreter zur Deutschen Meisterschaft der Formationen 2026",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccreditationPage() {
  return (
    <main className="container max-w-xl! prose sm:prose-lg prose-invert prose-neutral mx-auto py-8">
      <h1 className="text-center">Presse-Akkreditierung</h1>

      <p>
        Für die Deutsche Meisterschaft der Formationen am{" "}
        <strong>07. November 2026</strong> in der{" "}
        <strong>KIA Metropol Arena Nürnberg</strong> können sich
        Medienvertreterinnen und -vertreter hier akkreditieren.
      </p>
      <p>
        Die Akkreditierung richtet sich grundsätzlich an journalistisch tätige
        Personen (Print, Online, TV, Radio sowie Fotografen und Videografen).
      </p>

      {/* Akkreditierungsfrist */}
      <div className="not-prose border border-primary-700/50 bg-primary-950/20 flex gap-3 rounded-3xl text-sm p-4 text-base-300">
        <ClockIcon className="size-5 shrink-0 text-primary-400 mt-0.5" />
        <div>
          <div className="font-semibold text-primary-300">
            Akkreditierungsfrist: 20. Oktober 2026
          </div>
          <div className="text-base-400 mt-1">
            Später eingehende Anträge können unter Umständen nicht mehr
            berücksichtigt werden.
          </div>
        </div>
      </div>

      {/* Voraussetzungen */}
      <h2>Voraussetzungen für die kostenfreie Presse-Akkreditierung</h2>
      <ul>
        <li>Konkreter redaktioneller Auftrag</li>
        <li>Tätigkeit für ein Medium (Redaktion, Agentur)</li>
        <li>
          Nachweis journalistischer Arbeit (Presseausweis, Veröffentlichungen)
        </li>
      </ul>

      {/* Medienlizenz */}
      <h2>Medienlizenz für freie Foto- und Videografen</h2>
      <p>
        Sofern Sie über keinen Presseausweis verfügen oder keinen
        Redaktionsauftrag vorlegen können, besteht die Möglichkeit, eine
        kostenpflichtige Medienlizenz zu erwerben. Pressevertreter dürfen
        erstellte Inhalte für redaktionelle Berichterstattung nutzen. Inhaber
        einer kostenpflichtigen Medienlizenz dürfen Inhalte für redaktionelle
        Zwecke, Eigenwerbung und Portfolio verwenden sowie Foto- und
        Videoaufnahmen an Dritte verkaufen, insbesondere an teilnehmende
        Tänzerinnen und Tänzer sowie Vereine. Der Verkauf erfolgt
        eigenverantwortlich durch den Lizenznehmer. Der Veranstalter stellt
        keine Plattform für den Vertrieb. Eine Nutzung zu Werbe- oder
        Sponsoringzwecken ist nur mit gesonderter Genehmigung zulässig.
      </p>
      <p>
        Überweisen Sie dazu bitte den Betrag von{" "}
        <strong>70,00&nbsp;€ zzgl. 7&nbsp;% MwSt (gesamt: 74,90&nbsp;€)</strong>{" "}
        auf folgendes Konto:
      </p>
      <div className="not-prose border border-base-700 mb-4 text-base-100 rounded-3xl text-sm p-4 space-y-1 font-mono">
        <div>
          <span className="text-base-400">Kontoinhaber</span>
          <br />
          <span className="flex items-center">
            Tanzsportclub Rot-Gold-Casino Nürnberg e.V.
            <CopyButton text="Tanzsportclub Rot-Gold-Casino Nürnberg e.V." />
          </span>
        </div>
        <div className="pt-1">
          <span className="text-base-400">IBAN</span>
          <br />
          <span className="flex items-center">
            <span className="tracking-wider">DE03 7605 0101 0010 7094 59</span>
            <CopyButton text="DE03760501010010709459" />
          </span>
        </div>
        <div>
          <span className="text-base-400">BIC</span>
          <br />
          <span className="flex items-center">
            SSKNDE77XXX
            <CopyButton text="SSKNDE77XXX" />
          </span>
        </div>
        <div>
          <span className="text-base-400">Bank</span>
          <br />
          <span className="flex items-center">
            Sparkasse Nürnberg
            <CopyButton text="Sparkasse Nürnberg" />
          </span>
        </div>
        <div className="pt-1">
          <span className="text-base-400">Verwendungszweck</span>
          <br />
          Medienlizenz: <em>Ihr Name</em>
        </div>
      </div>
      <div className="not-prose border border-base-700 flex gap-3 rounded-3xl text-sm p-4 text-base-400">
        <InformationCircleIcon className="size-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div>
            Zahlungseingang spätestens bis zum{" "}
            <strong className="text-base-300">20. Oktober 2026</strong>. Die
            Akkreditierung wird erst nach vollständigem Zahlungseingang wirksam.
          </div>
          <div>
            Nach Zahlungseingang erhalten Sie für Ihre Unterlagen eine Rechnung.
            Begrenzte Anzahl an Lizenzen —{" "}
            <a
              href="/medienrichtlinien.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-base-300 transition-colors"
            >
              Medienrichtlinien
            </a>{" "}
            sind verbindlich.
          </div>
        </div>
      </div>

      {/* Allgemeine Hinweise */}
      <h2>Allgemeine Hinweise</h2>
      <p>
        Die Anzahl der Akkreditierungen ist begrenzt. Akkreditierte Personen
        erhalten Zugang zu definierten Arbeitsbereichen und sind verpflichtet,
        den Anweisungen des Veranstalters sowie den geltenden{" "}
        <a
          href="/medienrichtlinien.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 underline hover:text-primary-300 transition-colors"
        >
          Medienrichtlinien
        </a>{" "}
        Folge zu leisten.
      </p>

      {/* Formular */}
      <div className="not-prose mt-12" id="formular">
        <h2 className="text-2xl font-bold text-base-100 mb-6 text-center">
          Akkreditierung beantragen
        </h2>
        <AccreditationForm />
      </div>

      {/* Kontakt */}
      <div className="not-prose border border-base-700 flex gap-2 rounded-3xl text-sm p-3 text-base-400 mt-12">
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
