import { UsersIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams | Deutsche Meisterschaft der Formationen 2026",
  description:
    "Die qualifizierten Teams für die Deutsche Meisterschaft der Formationen 2026",
};

type Team = {
  name: string;
  trainers: string[];
};

type Section = {
  title: string;
  teams: Team[];
};

const sections: Section[] = [
  {
    title: "Standard",
    teams: [
      {
        name: "Braunschweiger TSC A",
        trainers: ["Sven Traut", "Felix Teufert"],
      },
      {
        name: "TSA d. TV Jahn Delmenhorst von 1909 A",
        trainers: ["Christian Stejzel", "Josephine Goerling"],
      },
      {
        name: "TD Tanzsportclub Düsseldorf Rot-Weiß A",
        trainers: ["Uwe Schieren", "Melanie Schieren"],
      },
      {
        name: "Tanzsportteam im ASC Göttingen v. 1846 A",
        trainers: ["Anton Shukow", "Mieke Zimmermann"],
      },
      {
        name: "TSC Blau-Gold Nienburg B",
        trainers: ["Marlene Wiegmann", "Nihan Türk"],
      },
      {
        name: "TSC Rot-Gold-Casino Nürnberg A",
        trainers: ["Andrea Grabner"],
      },
      {
        name: "TSC Rot-Gold-Casino Nürnberg B",
        trainers: ["Sophia Schnobrich", "Krisztian Schnobrich"],
      },
      {
        name: "TC Royal Oberhausen A",
        trainers: ["Jason Hurrelbrink", "Andreas Lippok", "Andrea Hellmann"],
      },
    ],
  },
  {
    title: "Latein",
    teams: [
      {
        name: "Tanzsportgemeinschaft Bietigheim A",
        trainers: [
          "Stefan Cramer",
          "Markus Oenning",
          "Joanna Schymik",
          "Nadine Chifari",
          "Denis Atamann",
        ],
      },
      {
        name: "Grün-Gold-Club Bremen A",
        trainers: ["Roberto Albanese", "Uta Albanese", "Sven Emmrich"],
      },
      {
        name: "Grün-Gold-Club Bremen B",
        trainers: ["Angelo Adler", "Lars Tielitz von Totth"],
      },
      {
        name: "Blau-Weiss Buchholz, TSA A",
        trainers: [
          "Franziska Becker",
          "Christopher Voigt",
          "Florian Hissnauer",
          "Steffen Sieber",
        ],
      },
      {
        name: "TSC Residenz Ludwigsburg A",
        trainers: ["Klaus Pätzold", "Jürgen Neidlinger"],
      },
      {
        name: "TSC Blau-Gold Nienburg A",
        trainers: ["Tim Weinholz", "Hannes Witte"],
      },
      {
        name: "TSC Walsrode A",
        trainers: ["Michael Maas"],
      },
      {
        name: "Tanzsportzentrum Weissacher Tal A",
        trainers: ["Dirk Gutöhrlein", "Fabio Rothmund", "Andrzej Cibis"],
      },
    ],
  },
];

export default function TeamsPage() {
  return (
    <main className="container prose sm:prose-lg prose-invert prose-neutral mx-auto py-8">
      <h1 className="text-center">Teams</h1>
      <p>
        Die jeweils 8 besten Mannschaften Deutschlands aus der Standard- und
        Lateinsektion dürfen bei der Deutschen Meisterschaft an den Start gehen.
      </p>

      {sections.map((section) => (
        <section key={section.title} className="not-prose mt-10">
          <div className="flex items-baseline gap-3">
            <h2 className="text-primary-300 text-2xl font-bold">
              {section.title}
            </h2>
            <span className="text-sm font-semibold text-base-500">
              {section.teams.length} Teams
            </span>
          </div>

          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {section.teams.map((team, index) => (
              <li
                key={team.name}
                className="group flex gap-3 rounded-2xl border border-base-700 bg-base-900/40 p-4 transition-colors hover:border-primary-300/60 hover:bg-base-800/40"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-300 text-sm font-black text-primary-900">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-base-100 leading-snug">
                    {team.name}
                  </div>
                  <div className="mt-1 flex items-start gap-1.5 text-sm text-base-400">
                    <UsersIcon className="mt-0.5 size-4 shrink-0" />
                    <span>{team.trainers.join(" · ")}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
