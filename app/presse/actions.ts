"use server";

import nodemailer from "nodemailer";
import {
  CONTACT_EMAIL,
  REPORTING_TYPES,
  parseAccreditationFormData,
  readUploadFile,
  summaryMessage,
  validateTotalUploadSize,
  type AccreditationData,
  type AccreditationState,
} from "@/lib/accreditation";

const REQUIRED_ENV_VARS = [
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "SMTP_TO",
] as const;

/** Kurze Referenz, die dem Nutzer angezeigt und zusätzlich geloggt wird. */
function createErrorCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function errorState(
  message: string,
  extra?: Omit<NonNullable<AccreditationState>, "status" | "message">,
): AccreditationState {
  return { status: "error", message, ...extra };
}

/** Entfernt Zeichen, die E-Mail-Header manipulieren könnten. */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Entfernt Pfadanteile und problematische Zeichen aus Dateinamen. */
function sanitizeFileName(parts: string[], fallback: string): string {
  const cleaned = parts
    .map((part) => (part.split(/[\\/]/).pop() ?? "").trim())
    .filter(Boolean)
    .join("-")
    .replace(/[\r\n\t"]+/g, "")
    .replace(/[^\p{L}\p{N}.\-_ ]+/gu, "_")
    .replace(/_{2,}/g, "_")
    .trim();
  return cleaned.length > 0 ? cleaned.slice(0, 120) : fallback;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type MailError = { code?: string; responseCode?: number; message?: string };

function describeMailError(error: unknown): string {
  const mailError = (error ?? {}) as MailError;
  const code = typeof mailError.code === "string" ? mailError.code : "";
  const responseCode = mailError.responseCode;

  if (code === "EAUTH" || responseCode === 535) {
    return "Der E-Mail-Versand ist an der Anmeldung am Mailserver gescheitert. Das liegt an uns, nicht an Ihren Angaben.";
  }
  if (code === "ECONNECTION" || code === "ESOCKET" || code === "EDNS") {
    return "Der Mailserver war nicht erreichbar. Bitte versuchen Sie es in einigen Minuten erneut.";
  }
  if (code === "ETIMEDOUT" || code === "ETIME") {
    return "Der Versand hat zu lange gedauert und wurde abgebrochen. Möglicherweise sind Ihre Anhänge sehr groß – bitte verkleinern Sie diese und versuchen Sie es erneut.";
  }
  if (code === "EENVELOPE" || responseCode === 550 || responseCode === 553) {
    return "Die E-Mail konnte nicht zugestellt werden. Bitte prüfen Sie Ihre E-Mail-Adresse auf Tippfehler.";
  }
  if (code === "EMESSAGE" || responseCode === 552 || responseCode === 523) {
    return "Die Anfrage wurde vom Mailserver abgelehnt, weil die Anhänge zu groß sind. Bitte verkleinern Sie Ihre Dateien und versuchen Sie es erneut.";
  }
  return "Beim Versenden Ihrer Anfrage ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es in einigen Minuten erneut.";
}

function withContactHint(message: string, errorCode: string): string {
  return `${message} Falls das Problem bestehen bleibt, senden Sie uns Ihre Unterlagen bitte direkt per E-Mail an ${CONTACT_EMAIL} (Fehler-Referenz: ${errorCode}).`;
}

function buildTextContent(
  data: AccreditationData,
  hasPressPass: boolean,
): string {
  const reportingLabels = data.reportingTypes
    .map((type) => REPORTING_TYPES[type])
    .join(", ");

  return `
NEUE AKKREDITIERUNGSANFRAGE
========================================

ALLGEMEINE ANGABEN
----------------------------------------
Vorname:              ${data.firstName}
Nachname:             ${data.lastName}
Medium:               ${data.medium}
Position / Funktion:  ${data.position}
Berichterstattung:    ${reportingLabels}
Freelancer:           ${data.freelancer ? "Ja" : "Nein"}
E-Mail:               ${data.email}
Presseausweis:        ${hasPressPass ? "Im Anhang" : "Nicht beigefügt"}
Medienlizenz:         ${data.medienlizenz ? "Ja – Zahlung zugesagt" : "Nein"}

PERSÖNLICHE ANGABEN
----------------------------------------
Straße, Hausnummer:   ${data.street}
Postleitzahl:         ${data.zip}
Wohnort:              ${data.city}
Land:                 ${data.country}
Telefonnummer:        ${data.phone}

DATENSCHUTZ
----------------------------------------
Datenschutzerklärung: Zugestimmt
Medienrichtlinien:    Akzeptiert

JUGENDSCHUTZ & ETHIK (DTV)
----------------------------------------
Ehrenkodex (unterschr.): Im Anhang
DTV-Ethik-Code:          Gelesen und anerkannt
Kinder-/Jugendschutz:    Gelesen und anerkannt

========================================
Diese Anfrage wurde über das Online-Formular auf der Webseite der
Deutschen Meisterschaft der Formationen 2026 gesendet.
`.trim();
}

function buildHtmlContent(
  data: AccreditationData,
  hasPressPass: boolean,
): string {
  const reportingLabels = data.reportingTypes
    .map((type) => REPORTING_TYPES[type])
    .join(", ");
  const cell =
    'style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;"';

  return `
<div style="font-family: monospace, monospace; font-size: 14px; color: #222;">
  <h2 style="margin-bottom: 4px;">Neue Akkreditierungsanfrage</h2>
  <hr/>
  <h3>Allgemeine Angaben</h3>
  <table style="border-collapse: collapse;">
    <tr><td ${cell}>Vorname</td><td>${escapeHtml(data.firstName)}</td></tr>
    <tr><td ${cell}>Nachname</td><td>${escapeHtml(data.lastName)}</td></tr>
    <tr><td ${cell}>Medium</td><td>${escapeHtml(data.medium)}</td></tr>
    <tr><td ${cell}>Position / Funktion</td><td>${escapeHtml(data.position)}</td></tr>
    <tr><td ${cell}>Berichterstattung</td><td>${escapeHtml(reportingLabels)}</td></tr>
    <tr><td ${cell}>Freelancer</td><td>${data.freelancer ? "Ja" : "Nein"}</td></tr>
    <tr><td ${cell}>E-Mail</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
    <tr><td ${cell}>Presseausweis</td><td>${hasPressPass ? "Im Anhang" : "Nicht beigefügt"}</td></tr>
    <tr><td ${cell}>Medienlizenz</td><td>${data.medienlizenz ? "✅ Ja – Zahlung zugesagt" : "Nein"}</td></tr>
  </table>

  <h3>Persönliche Angaben</h3>
  <table style="border-collapse: collapse;">
    <tr><td ${cell}>Straße, Hausnummer</td><td>${escapeHtml(data.street)}</td></tr>
    <tr><td ${cell}>Postleitzahl</td><td>${escapeHtml(data.zip)}</td></tr>
    <tr><td ${cell}>Wohnort</td><td>${escapeHtml(data.city)}</td></tr>
    <tr><td ${cell}>Land</td><td>${escapeHtml(data.country)}</td></tr>
    <tr><td ${cell}>Telefonnummer</td><td>${escapeHtml(data.phone)}</td></tr>
  </table>

  <h3>Datenschutz</h3>
  <p>Datenschutzerklärung: ✅ Zugestimmt</p>
  <p>Medienrichtlinien: ✅ Akzeptiert</p>

  <h3>Jugendschutz &amp; Ethik (DTV)</h3>
  <p>Ehrenkodex (unterschrieben): 📎 Im Anhang</p>
  <p>DTV-Ethik-Code: ✅ Gelesen und anerkannt</p>
  <p>Erklärung zum Schutz von Kindern und Jugendlichen: ✅ Gelesen und anerkannt</p>
  <hr/>
  <p style="color: #999; font-size: 12px;">Diese Anfrage wurde über das Online-Formular auf der Webseite der Deutschen Meisterschaft der Formationen 2026 gesendet.</p>
</div>
`.trim();
}

export async function submitAccreditation(
  _prevState: AccreditationState,
  formData: FormData,
): Promise<AccreditationState> {
  const errorCode = createErrorCode();

  try {
    if (!(formData instanceof FormData)) {
      return errorState(
        withContactHint(
          "Die Formulardaten konnten nicht gelesen werden. Bitte laden Sie die Seite neu und füllen Sie das Formular erneut aus.",
          errorCode,
        ),
        { errorCode },
      );
    }

    const pressPassFile = readUploadFile(formData, "pressPass");
    const ehrenkodexFile = readUploadFile(formData, "signedEhrenkodex");

    const parsed = parseAccreditationFormData(formData);

    if (!parsed.success) {
      return errorState(summaryMessage(parsed.fieldErrors), {
        fieldErrors: parsed.fieldErrors,
      });
    }

    const data = parsed.data;

    const tooLarge = validateTotalUploadSize(formData);
    if (tooLarge) {
      return errorState(tooLarge, {
        fieldErrors: { signedEhrenkodex: tooLarge },
      });
    }

    const missingEnv = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
    if (missingEnv.length > 0) {
      console.error(
        `[Akkreditierung ${errorCode}] Fehlende SMTP-Konfiguration: ${missingEnv.join(", ")}`,
      );
      return errorState(
        withContactHint(
          "Der E-Mail-Versand ist auf unserer Seite derzeit nicht konfiguriert. Ihre Anfrage konnte deshalb nicht übermittelt werden.",
          errorCode,
        ),
        { errorCode },
      );
    }

    // Anhänge einlesen – Lesefehler dürfen nicht bis zum Client durchschlagen.
    const attachments: {
      filename: string;
      content: Buffer;
      contentType?: string;
    }[] = [];

    const files: {
      file: File | null;
      filename: string;
      label: string;
      field: "pressPass" | "signedEhrenkodex";
    }[] = [
      {
        file: pressPassFile,
        filename: sanitizeFileName(
          [
            "Presseausweis",
            data.lastName,
            data.firstName,
            pressPassFile?.name ?? "",
          ],
          "Presseausweis",
        ),
        label: "Presseausweis",
        field: "pressPass",
      },
      {
        file: ehrenkodexFile,
        filename: sanitizeFileName(
          [
            "Ehrenkodex",
            data.lastName,
            data.firstName,
            ehrenkodexFile?.name ?? "",
          ],
          "Ehrenkodex",
        ),
        label: "Unterschriebener Ehrenkodex",
        field: "signedEhrenkodex",
      },
    ];

    for (const { file, filename, label, field } of files) {
      if (!file || file.size === 0) continue;
      try {
        attachments.push({
          filename,
          content: Buffer.from(await file.arrayBuffer()),
          contentType: file.type || undefined,
        });
      } catch (error) {
        console.error(
          `[Akkreditierung ${errorCode}] Datei konnte nicht gelesen werden (${label}):`,
          error,
        );
        return errorState(
          `${label}: Die Datei konnte nicht gelesen werden. Bitte wählen Sie sie erneut aus und senden Sie das Formular noch einmal.`,
          {
            fieldErrors: {
              [field]:
                "Die Datei konnte nicht gelesen werden. Bitte wählen Sie sie erneut aus.",
            },
          },
        );
      }
    }

    const hasPressPass = Boolean(pressPassFile && pressPassFile.size > 0);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Ohne Timeouts kann ein hängender Mailserver bis zum Function-Timeout
      // blockieren – der Nutzer sähe dann nur eine generische Fehlerseite.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_TO,
        replyTo: sanitizeHeaderValue(data.email),
        subject: sanitizeHeaderValue(
          `Akkreditierungsanfrage: ${data.firstName} ${data.lastName} – ${data.medium}`,
        ),
        text: buildTextContent(data, hasPressPass),
        html: buildHtmlContent(data, hasPressPass),
        attachments,
      });
    } catch (error) {
      console.error(
        `[Akkreditierung ${errorCode}] E-Mail-Versand fehlgeschlagen:`,
        error,
      );
      return errorState(withContactHint(describeMailError(error), errorCode), {
        errorCode,
      });
    } finally {
      transporter.close();
    }

    return {
      status: "success",
      message:
        "Ihre Akkreditierungsanfrage wurde erfolgreich gesendet. Sie erhalten eine Rückmeldung per E-Mail.",
    };
  } catch (error) {
    console.error(
      `[Akkreditierung ${errorCode}] Unerwarteter Fehler in der Server Action:`,
      error,
    );
    return errorState(
      withContactHint(
        "Bei der Verarbeitung Ihrer Anfrage ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        errorCode,
      ),
      { errorCode },
    );
  }
}
