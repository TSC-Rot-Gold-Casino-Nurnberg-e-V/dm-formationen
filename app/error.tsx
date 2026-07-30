"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const CONTACT_EMAIL = "pressewart@rot-gold-casino.de";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unbehandelter Fehler:", error);
  }, [error]);

  return (
    <main className="container max-w-xl! mx-auto py-16 px-4">
      <div className="rounded-2xl border border-red-800 bg-red-950/30 p-6 space-y-4 text-center">
        <ExclamationTriangleIcon className="size-12 text-red-400 mx-auto" />
        <h1 className="text-xl font-semibold text-base-100">
          Es ist ein Fehler aufgetreten
        </h1>
        <p className="text-sm text-base-300">
          Die Seite konnte nicht vollständig geladen werden. Bitte versuchen Sie
          es erneut. Falls Sie gerade ein Formular abgeschickt haben, wurden
          Ihre Daten möglicherweise nicht übermittelt.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors cursor-pointer"
          >
            Erneut versuchen
          </button>
          <Link
            href="/"
            className="rounded-xl border border-base-700 px-5 py-2.5 text-sm font-semibold text-base-200 hover:bg-base-800 transition-colors"
          >
            Zur Startseite
          </Link>
        </div>
        <p className="text-xs text-base-400">
          Besteht das Problem weiterhin? Schreiben Sie uns an{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline hover:text-base-200 transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
          {error.digest ? ` (Fehler-Referenz: ${error.digest})` : ""}.
        </p>
      </div>
    </main>
  );
}
