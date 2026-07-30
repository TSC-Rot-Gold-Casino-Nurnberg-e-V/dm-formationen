"use client";

/**
 * Letztes Sicherheitsnetz: greift, wenn selbst das Root-Layout fehlschlägt.
 * Ersetzt die englische Standardmeldung „Application error: a client-side
 * exception has occurred" durch einen verständlichen deutschen Hinweis.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#e5e5e5",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "36rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
            Es ist ein Fehler aufgetreten
          </h1>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
            Die Seite konnte nicht geladen werden. Bitte versuchen Sie es
            erneut. Falls Sie gerade das Akkreditierungsformular abgeschickt
            haben, wurden Ihre Daten möglicherweise nicht übermittelt.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.25rem",
              padding: "0.65rem 1.25rem",
              borderRadius: "0.75rem",
              border: "none",
              backgroundColor: "#c2410c",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Erneut versuchen
          </button>
          <p style={{ fontSize: "0.8rem", marginTop: "1.5rem", color: "#a3a3a3" }}>
            Besteht das Problem weiterhin? Schreiben Sie uns an{" "}
            <a
              href="mailto:pressewart@rot-gold-casino.de"
              style={{ color: "#a3a3a3" }}
            >
              pressewart@rot-gold-casino.de
            </a>
            {error.digest ? ` (Fehler-Referenz: ${error.digest})` : ""}.
          </p>
        </div>
      </body>
    </html>
  );
}
