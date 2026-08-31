import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowTopRightOnSquareIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { CopyButton } from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "Hotels | Deutsche Meisterschaft der Formationen 2026",
  description:
    "Partnerhotels und Übernachtungsangebote zur Deutschen Meisterschaft der Formationen 2026 in Nürnberg",
};

const hotels = [
  {
    name: "NOVINA-HOTEL Südwestpark Nürnberg",
    address: ["Südwestpark 5", "90449 Nürnberg"],
    singleRoomPrice: "87,00 €",
    doubleRoomPrice: "97,00 €",
    bookingLabel: "Stichwort",
    bookingCode: "DM Formationen 2026",
    phone: {
      label: "0911 6706 500",
      href: "tel:+499116706500",
    },
    email: "reservation@novina-suedwestpark.de",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&origin=S%C3%BCdwestpark+5%2C+90449+N%C3%BCrnberg&destination=Dr.-Ingeborg-Bausenwein-Stra%C3%9Fe+1%2C+90431+N%C3%BCrnberg",
  },
  {
    name: "NOVINA-HOTEL Tillypark Nürnberg",
    address: ["Wallensteinstraße 71", "90431 Nürnberg"],
    singleRoomPrice: "89,00 €",
    doubleRoomPrice: "99,00 €",
    bookingLabel: "Stichwort",
    bookingCode: "DM Formationen 2026",
    phone: {
      label: "0911 6706 540",
      href: "tel:+499116706540",
    },
    email: "reservation@novina-tillypark.de",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&origin=Wallensteinstra%C3%9Fe+71%2C+90431+N%C3%BCrnberg&destination=Dr.-Ingeborg-Bausenwein-Stra%C3%9Fe+1%2C+90431+N%C3%BCrnberg",
  },
] as const;

export default function HotelsPage() {
  return (
    <main className="container prose sm:prose-lg prose-invert prose-neutral mx-auto py-8">
      <h1 className="text-center">Partnerhotels</h1>
      <p>
        Für die Deutsche Meisterschaft der Formationen 2026 stehen bei unseren
        Partnerhotels in Nürnberg und Fürth Übernachtungsangebote inklusive
        Buffetfrühstück zur Verfügung.
      </p>

      <div className="not-prose mt-8 space-y-6">
        {hotels.map((hotel) => (
          <section
            key={hotel.name}
            className="rounded-4xl bg-base-800 p-6 sm:p-8"
          >
            <h2 className="mb-4 text-2xl font-bold text-primary-300 sm:text-3xl">
              {hotel.name}
            </h2>
            <address className="mb-6 not-italic">
              {hotel.address.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </address>

            <RoomRates
              singleRoomPrice={hotel.singleRoomPrice}
              doubleRoomPrice={hotel.doubleRoomPrice}
            />

            <div className="mt-6 rounded-3xl border border-base-700 px-4 py-3">
              <div className="text-sm text-base-400">{hotel.bookingLabel}</div>
              <div className="flex items-center font-bold text-base-100">
                {hotel.bookingCode}
                <CopyButton text={hotel.bookingCode} />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={hotel.phone.href}
                className="flex items-center justify-center gap-2 rounded-full bg-secondary-700 px-5 py-3 font-bold text-white transition-colors hover:bg-secondary-600"
              >
                <PhoneIcon className="size-5" />
                {hotel.phone.label}
              </Link>
              <Link
                href={`mailto:${hotel.email}`}
                className="flex items-center justify-center gap-2 rounded-full border border-primary-300 px-5 py-3 font-bold text-primary-300 transition-colors hover:bg-base-700 hover:text-primary-200"
              >
                <EnvelopeIcon className="size-5" />
                E-Mail schreiben
              </Link>
              <DirectionsLink href={hotel.directionsUrl} />
            </div>
          </section>
        ))}

        <section className="rounded-4xl bg-base-800 p-6 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-primary-300 sm:text-3xl">
            Excelsior Hotel Nürnberg Fürth
          </h2>
          <address className="mb-6 not-italic">
            <div>Europaallee 1</div>
            <div>90763 Fürth</div>
          </address>

          <RoomRates singleRoomPrice="99,00 €" doubleRoomPrice="114,00 €" />

          <div className="mt-6 rounded-3xl border border-base-700 px-4 py-3">
            <div className="text-sm text-base-400">Aktionscode</div>
            <div className="flex items-center font-bold text-base-100">
              DM2026
              <CopyButton text="DM2026" />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="https://www.gchhotelgroup.com/de/hotel/excelsior-nuernberg-fuerth"
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-full bg-secondary-700 px-5 py-3 font-bold text-white transition-colors hover:bg-secondary-600"
            >
              Zimmer buchen
              <ArrowTopRightOnSquareIcon className="size-5" />
            </Link>
            <DirectionsLink href="https://www.google.com/maps/dir/?api=1&origin=Europaallee+1%2C+90763+F%C3%BCrth&destination=Dr.-Ingeborg-Bausenwein-Stra%C3%9Fe+1%2C+90431+N%C3%BCrnberg" />
          </div>
        </section>
      </div>
    </main>
  );
}

function DirectionsLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="flex items-center justify-center gap-2 rounded-full border border-primary-300 px-5 py-3 font-bold text-primary-300 transition-colors hover:bg-base-700 hover:text-primary-200"
    >
      <MapPinIcon className="size-5" />
      Route zur Arena
    </Link>
  );
}

function RoomRates({
  singleRoomPrice,
  doubleRoomPrice,
}: {
  singleRoomPrice: string;
  doubleRoomPrice: string;
}) {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-base-900/60 p-4">
          <div className="text-sm text-base-400">Einzelzimmer</div>
          <div className="text-2xl font-black text-base-100">
            {singleRoomPrice}
          </div>
        </div>
        <div className="rounded-3xl bg-base-900/60 p-4">
          <div className="text-sm text-base-400">Doppelzimmer</div>
          <div className="text-2xl font-black text-base-100">
            {doubleRoomPrice}
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-base-300">
        Pro Nacht und Zimmer, inklusive Buffetfrühstück
      </p>
    </div>
  );
}
