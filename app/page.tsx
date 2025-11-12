import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  HomeIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Countdown } from "@/components/Countdown";
import { EventDateChip } from "@/components/EventDateChip";

export default function Home() {
  return (
    <main className="mb-8">
      <EventDateChip className="container my-6" />
      <h1 className="container text-4xl mb-4 sm:text-5xl font-serif text-base-100 font-bold text-center">
        Deutsche Meisterschaft <br /> der Formationen 2026
      </h1>
      <p className="mb-4 sm:text-lg container text-base-200">
        Der TSC Rot-Gold-Casino Nürnberg lädt herzlich zur Deutschen
        Meisterschaft der Formationen Standard und Latein in die KIA Metropol
        Arena ein. Erleben Sie Tanzsport der Spitzenklasse und die Top-Teams
        Deutschlands live im Wettstreit um den deutschen Meistertitel.
      </p>
      <Link
        href="/"
        className="container mb-8 block w-fit not-prose bg-secondary-700 text-lg hover:bg-secondary-600 px-6 py-3 rounded-full transition-colors font-bold cursor-pointer !text-white"
      >
        Jetzt Tickets sichern!
      </Link>
      <Countdown />
      <div className="container grid mt-8 gap-4 not-prose sm:grid-cols-2">
        <section className="bg-base-800 flex flex-col justify-between rounded-3xl p-8 pb-6">
          <div>
            <div className="flex justify-between gap-2 mb-2 text-base-50">
              <h2 className="text-3xl font-bold">Wann?</h2>
              <CalendarDaysIcon className="size-8 shrink-0" />
            </div>
            <div className="text-base-100 text-xl font-semibold mb-4">
              7. November 2026
            </div>
            <div className="flex items-center gap-4 mb-4">
              <ClockIcon className="size-8 shrink-0" />
              <div>
                <div className="text-sm tracking-wide font-semibold">
                  NACHMITTAG
                </div>
                <div className="text-2xl font-bold text-base-50">13:30 Uhr</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ClockIcon className="size-8 shrink-0" />
              <div>
                <div className="text-sm tracking-wide font-semibold">ABEND</div>
                <div className="text-2xl font-bold text-base-50">18:30 Uhr</div>
              </div>
            </div>
          </div>
          <Link
            href="/zeitplan"
            className="flex p-2 -m-2 ml-auto mt-0 w-fit items-center hover:text-primary-200 transition-colors text-primary-300 gap-2"
          >
            <div>zum Zeitplan</div>
            <ArrowRightIcon className="size-4 stroke-2" />
          </Link>
        </section>
        <section className="bg-base-800 flex flex-col justify-between rounded-3xl p-8 pb-6">
          <div>
            <div className="flex justify-between gap-2 mb-2 text-base-50">
              <h2 className="text-3xl font-bold">Wo?</h2>
              <MapPinIcon className="size-8 shrink-0" />
            </div>
            <div className="text-base-100 text-xl font-semibold mb-4">
              Kia Metropol Arena
            </div>
            <div className="text-base">Dr.-Ingeborg-Bausenwein-Straße 1</div>
            <div className="text-base">90431 Nürnberg</div>
          </div>
          <Link
            // href="/anfahrt"
            href="https://maps.app.goo.gl/CCD4LEHkXWQBdnfdA"
            target="_blank"
            className="flex p-2 -m-2 ml-auto mt-0 w-fit items-center hover:text-primary-200 transition-colors text-primary-300 gap-2"
          >
            <div>Anfahrt planen</div>
            <ArrowRightIcon className="size-4 stroke-2" />
          </Link>
        </section>
        <section className="bg-base-800 flex flex-col justify-between rounded-3xl p-8 pb-6">
          <div>
            <div className="flex justify-between gap-2 mb-2 text-base-50">
              <h2 className="text-3xl font-bold">Teams</h2>
              <UserGroupIcon className="size-8 shrink-0" />
            </div>
            <p>
              Die jeweils 8 besten Mannschaften Deutschlands aus der Standard-
              und Lateinsektion
            </p>
          </div>
          <Link
            href="/teams"
            className="flex p-2 -m-2 ml-auto mt-0 w-fit items-center hover:text-primary-200 transition-colors text-primary-300 gap-2"
          >
            <div>zu den Teams</div>
            <ArrowRightIcon className="size-4 stroke-2" />
          </Link>
        </section>
        <section className="bg-base-800 flex flex-col justify-between rounded-3xl p-8 pb-6">
          <div>
            <div className="flex justify-between gap-2 mb-2 text-base-50">
              <h2 className="text-3xl font-bold">Hotels</h2>
              <HomeIcon className="size-8 shrink-0" />
            </div>
            <p>
              Wir haben für unsere Gäste eine Auswahl an Hotels in verschiedenen
              Preiskategorien zusammengestellt
            </p>
          </div>
          <Link
            href="/hotels"
            className="flex p-2 -m-2 ml-auto mt-0 w-fit items-center hover:text-primary-200 transition-colors text-primary-300 gap-2"
          >
            <div>zu den Hotels</div>
            <ArrowRightIcon className="size-4 stroke-2" />
          </Link>
        </section>
      </div>
    </main>
  );
}
