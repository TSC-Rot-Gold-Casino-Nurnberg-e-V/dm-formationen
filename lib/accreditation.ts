import { z } from "zod";

/**
 * Gemeinsame Validierung für das Presse-Akkreditierungsformular.
 * Wird sowohl im Browser (sofortiges Feedback) als auch in der Server Action
 * (verbindliche Prüfung) verwendet.
 */

export const CONTACT_EMAIL = "pressewart@rot-gold-casino.de";

/** Maximale Größe einer einzelnen Datei (nach der Optimierung im Browser). */
export const MAX_FILE_BYTES = 3 * 1024 * 1024;

/**
 * Maximale Gesamtgröße aller Uploads. Vercel begrenzt den Request hart auf 4,5 MB,
 * Next.js zusätzlich auf den in `next.config.ts` gesetzten Wert (4 MB). Der Puffer
 * deckt Formularfelder, Header und den Multipart-Overhead ab.
 */
export const MAX_TOTAL_UPLOAD_BYTES = Math.round(3.5 * 1024 * 1024);

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/avif",
];

const ACCEPTED_UPLOAD_TYPES = ["application/pdf", ...ACCEPTED_IMAGE_TYPES];

const ACCEPTED_UPLOAD_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
  ".avif",
];

/** Wert für das `accept`-Attribut der Datei-Inputs. */
export const UPLOAD_ACCEPT_ATTRIBUTE = [
  ...ACCEPTED_UPLOAD_TYPES,
  ...ACCEPTED_UPLOAD_EXTENSIONS,
].join(",");

export const UPLOAD_FORMAT_HINT = "PDF, JPG, PNG, WEBP, AVIF oder HEIC";

export const REPORTING_TYPES = {
  print: "Zeitung / Druckerzeugnis",
  online: "Onlinebericht",
  photo: "Foto",
  video: "Video",
} as const;

export type ReportingType = keyof typeof REPORTING_TYPES;

export const REPORTING_TYPE_VALUES = Object.keys(
  REPORTING_TYPES,
) as [ReportingType, ...ReportingType[]];

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} Bytes`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

export type UploadFileInfo = { name: string; size: number; type: string };

function hasAcceptedExtension(name: string): boolean {
  const lower = name.toLowerCase();
  return ACCEPTED_UPLOAD_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/**
 * Prüft eine hochgeladene Datei und liefert bei einem Problem eine
 * deutschsprachige Meldung, andernfalls `null`.
 */
export function validateUploadFile(
  file: UploadFileInfo,
  label: string,
): string | null {
  if (!file.name) {
    return `${label}: Die Datei konnte nicht gelesen werden. Bitte wählen Sie sie erneut aus.`;
  }

  if (file.size === 0) {
    return `${label}: Die ausgewählte Datei ist leer (0 Bytes). Bitte wählen Sie die Datei erneut aus.`;
  }

  const typeAccepted =
    (file.type && ACCEPTED_UPLOAD_TYPES.includes(file.type)) ||
    hasAcceptedExtension(file.name);

  if (!typeAccepted) {
    return `${label}: Das Dateiformat wird nicht unterstützt. Erlaubt sind ${UPLOAD_FORMAT_HINT}.`;
  }

  if (file.size > MAX_FILE_BYTES) {
    return `${label}: Die Datei ist ${formatBytes(
      file.size,
    )} groß, erlaubt sind maximal ${formatBytes(
      MAX_FILE_BYTES,
    )}. Bitte speichern Sie den Scan mit geringerer Auflösung (z. B. 150 dpi, Graustufen) oder verkleinern Sie das Bild.`;
  }

  return null;
}

const requiredText = (prompt: string, label: string, max: number) =>
  z
    .string({ error: `${label} ist ein Pflichtfeld.` })
    .trim()
    .min(1, { error: `Bitte geben Sie ${prompt} an.` })
    .max(max, {
      error: `${label}: Bitte verwenden Sie höchstens ${max} Zeichen.`,
    });

const confirmed = (error: string) =>
  z.boolean().refine((value) => value === true, { error });

const fileInfo = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
});

const optionalUpload = (label: string) =>
  fileInfo.nullable().superRefine((file, ctx) => {
    if (!file) return;
    const error = validateUploadFile(file, label);
    if (error) ctx.addIssue({ code: "custom", message: error });
  });

const requiredUpload = (label: string, missingError: string) =>
  fileInfo.nullable().superRefine((file, ctx) => {
    if (!file) {
      ctx.addIssue({ code: "custom", message: missingError });
      return;
    }
    const error = validateUploadFile(file, label);
    if (error) ctx.addIssue({ code: "custom", message: error });
  });

export const accreditationSchema = z.object({
  firstName: requiredText("Ihren Vornamen", "Vorname", 100),
  lastName: requiredText("Ihren Nachnamen", "Nachname", 100),
  medium: requiredText("Ihr Medium", "Medium", 200),
  position: requiredText(
    "Ihre Position, Ihr Ressort oder Ihre Funktion",
    "Position, Ressort, Funktion",
    200,
  ),
  reportingTypes: z
    .array(
      z.enum(REPORTING_TYPE_VALUES, {
        error: "Bitte wählen Sie nur die angebotenen Arten der Berichterstattung aus.",
      }),
    )
    .min(1, {
      error: "Bitte wählen Sie mindestens eine Art der Berichterstattung aus.",
    }),
  freelancer: z.boolean(),
  email: z
    .string({ error: "E-Mail ist ein Pflichtfeld." })
    .trim()
    .min(1, { error: "Bitte geben Sie Ihre E-Mail-Adresse an." })
    .max(254, { error: "Die E-Mail-Adresse ist zu lang." })
    .pipe(
      z.email({
        error:
          "Bitte geben Sie eine gültige E-Mail-Adresse an (z. B. name@zeitung.de).",
      }),
    ),
  street: requiredText(
    "Ihre Straße und Hausnummer",
    "Straße, Hausnummer",
    200,
  ),
  zip: requiredText("Ihre Postleitzahl", "Postleitzahl", 20),
  city: requiredText("Ihren Wohnort", "Wohnort", 100),
  country: requiredText("Ihr Land", "Land", 100),
  phone: requiredText("Ihre Telefonnummer", "Telefonnummer", 50).regex(
    /\d/,
    {
      error:
        "Bitte geben Sie eine gültige Telefonnummer an (mindestens eine Ziffer).",
    },
  ),
  medienlizenz: z.boolean(),
  privacy: confirmed(
    "Bitte stimmen Sie der Datenschutzerklärung zu, um das Formular abzusenden.",
  ),
  medienrichtlinien: confirmed(
    "Bitte bestätigen Sie, dass Sie die Medienrichtlinien gelesen und als verbindlich anerkannt haben.",
  ),
  ethikCodeConfirmed: confirmed(
    "Bitte bestätigen Sie, dass Sie den DTV-Ethik-Code gelesen und anerkannt haben.",
  ),
  kinderJugendschutzConfirmed: confirmed(
    "Bitte bestätigen Sie, dass Sie die Erklärung zum Schutz von Kindern und Jugendlichen gelesen und anerkannt haben.",
  ),
  pressPass: optionalUpload("Presseausweis"),
  signedEhrenkodex: requiredUpload(
    "Unterschriebener Ehrenkodex",
    "Bitte laden Sie den unterschriebenen Ehrenkodex des DTV hoch (PDF oder Foto).",
  ),
});

export type AccreditationInput = z.input<typeof accreditationSchema>;
export type AccreditationData = z.output<typeof accreditationSchema>;

export type AccreditationFieldName =
  | keyof AccreditationInput
  | "reportingType";

export type AccreditationFieldErrors = Partial<
  Record<AccreditationFieldName, string>
>;

export type AccreditationState = {
  status: "success" | "error";
  message: string;
  /** Feldgenaue Meldungen, gemappt auf die `name`-Attribute des Formulars. */
  fieldErrors?: AccreditationFieldErrors;
  /** Referenz für den Support, wenn ein unerwarteter Fehler aufgetreten ist. */
  errorCode?: string;
} | null;

/** Reihenfolge der Felder im Formular – für den Sprung zum ersten Fehler. */
export const FIELD_ORDER: AccreditationFieldName[] = [
  "firstName",
  "lastName",
  "medium",
  "position",
  "reportingType",
  "email",
  "pressPass",
  "medienlizenz",
  "street",
  "zip",
  "city",
  "country",
  "phone",
  "privacy",
  "medienrichtlinien",
  "signedEhrenkodex",
  "ethikCodeConfirmed",
  "kinderJugendschutzConfirmed",
];

export const FIELD_LABELS: Record<AccreditationFieldName, string> = {
  firstName: "Vorname",
  lastName: "Nachname",
  medium: "Medium",
  position: "Position, Ressort, Funktion",
  reportingType: "Art der Berichterstattung",
  reportingTypes: "Art der Berichterstattung",
  freelancer: "Freelancer",
  email: "E-Mail",
  pressPass: "Presseausweis",
  medienlizenz: "Medienlizenz",
  street: "Straße, Hausnummer",
  zip: "Postleitzahl",
  city: "Wohnort",
  country: "Land",
  phone: "Telefonnummer",
  privacy: "Datenschutzerklärung",
  medienrichtlinien: "Medienrichtlinien",
  signedEhrenkodex: "Unterschriebener Ehrenkodex",
  ethikCodeConfirmed: "DTV-Ethik-Code",
  kinderJugendschutzConfirmed: "Schutz von Kindern und Jugendlichen",
};

/**
 * Ordnet die Zod-Fehler den Formularfeldern zu. `reportingTypes` wird auf den
 * im Markup verwendeten Feldnamen `reportingType` gemappt.
 */
export function toFieldErrors(error: z.ZodError): AccreditationFieldErrors {
  const fieldErrors: AccreditationFieldErrors = {};
  for (const issue of error.issues) {
    const [path] = issue.path;
    if (typeof path !== "string") continue;
    const key = (
      path === "reportingTypes" ? "reportingType" : path
    ) as AccreditationFieldName;
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/** Sortiert Feldfehler in der Reihenfolge des Formulars. */
export function sortedFieldErrors(
  fieldErrors: AccreditationFieldErrors,
): { field: AccreditationFieldName; message: string }[] {
  return (Object.entries(fieldErrors) as [AccreditationFieldName, string][])
    .filter(([, message]) => Boolean(message))
    .sort(([a], [b]) => {
      const indexA = FIELD_ORDER.indexOf(a);
      const indexB = FIELD_ORDER.indexOf(b);
      return (
        (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) -
        (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB)
      );
    })
    .map(([field, message]) => ({ field, message }));
}

export const VALIDATION_SUMMARY_MESSAGE =
  "Bitte prüfen Sie die markierten Felder – einige Angaben fehlen oder sind nicht gültig.";

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function readStringList(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string");
}

function readCheckbox(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  if (typeof value !== "string") return false;
  return value === "on" || value === "true" || value === "1";
}

/**
 * Liest ein Datei-Feld, ohne auf Type Assertions zu vertrauen. Leere Datei-Inputs
 * liefern in manchen Browsern eine File-Instanz mit Größe 0 und leerem Namen –
 * diese wird wie „keine Datei" behandelt.
 */
export function readUploadFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (!value || typeof value === "string") return null;
  if (typeof value.arrayBuffer !== "function") return null;
  // Nicht ausgefüllte Datei-Felder liefern eine leere File-Instanz (Name "" im
  // Browser, "blob" nach der Server-Action-Serialisierung) – diese wird wie
  // „keine Datei" behandelt. Tatsächlich leere Dateien fängt die sofortige
  // Prüfung im Browser mit einer eigenen Meldung ab.
  if (value.size === 0) return null;
  return value;
}

function toFileInfo(file: File | null): UploadFileInfo | null {
  return file ? { name: file.name, size: file.size, type: file.type } : null;
}

export type ParseResult =
  | { success: true; data: AccreditationData }
  | { success: false; fieldErrors: AccreditationFieldErrors };

/**
 * Liest und validiert die Formulardaten. Wird identisch im Browser (sofortiges
 * Feedback) und in der Server Action (verbindliche Prüfung) verwendet.
 */
export function parseAccreditationFormData(formData: FormData): ParseResult {
  const parsed = accreditationSchema.safeParse({
    firstName: readString(formData, "firstName"),
    lastName: readString(formData, "lastName"),
    medium: readString(formData, "medium"),
    position: readString(formData, "position"),
    reportingTypes: readStringList(formData, "reportingType"),
    freelancer: readCheckbox(formData, "freelancer"),
    email: readString(formData, "email"),
    street: readString(formData, "street"),
    zip: readString(formData, "zip"),
    city: readString(formData, "city"),
    country: readString(formData, "country"),
    phone: readString(formData, "phone"),
    medienlizenz: readCheckbox(formData, "medienlizenz"),
    privacy: readCheckbox(formData, "privacy"),
    medienrichtlinien: readCheckbox(formData, "medienrichtlinien"),
    ethikCodeConfirmed: readCheckbox(formData, "ethikCodeConfirmed"),
    kinderJugendschutzConfirmed: readCheckbox(
      formData,
      "kinderJugendschutzConfirmed",
    ),
    pressPass: toFileInfo(readUploadFile(formData, "pressPass")),
    signedEhrenkodex: toFileInfo(readUploadFile(formData, "signedEhrenkodex")),
  });

  if (parsed.success) {
    return { success: true, data: parsed.data };
  }
  return { success: false, fieldErrors: toFieldErrors(parsed.error) };
}

/**
 * Prüft die Gesamtgröße aller Anhänge und liefert bei Überschreitung eine
 * deutschsprachige Meldung.
 */
export function validateTotalUploadSize(formData: FormData): string | null {
  const total = ["pressPass", "signedEhrenkodex"].reduce((sum, key) => {
    return sum + (readUploadFile(formData, key)?.size ?? 0);
  }, 0);

  if (total > MAX_TOTAL_UPLOAD_BYTES) {
    return `Ihre Anhänge sind zusammen ${formatBytes(total)} groß. ${UPLOAD_TOO_LARGE_MESSAGE}`;
  }
  return null;
}

/** Baut aus Feldfehlern die Meldung für das Banner über dem Formular. */
export function summaryMessage(fieldErrors: AccreditationFieldErrors): string {
  const messages = Object.values(fieldErrors).filter(Boolean);
  return messages.length === 1 ? messages[0] : VALIDATION_SUMMARY_MESSAGE;
}

/**
 * Meldung für den Fall, dass der Request die Größenbegrenzung sprengt
 * (Next.js-Body-Limit oder das 4,5-MB-Limit der Hosting-Plattform).
 */
export const UPLOAD_TOO_LARGE_MESSAGE = `Die hochgeladenen Dateien sind zusammen zu groß (maximal ${formatBytes(
  MAX_TOTAL_UPLOAD_BYTES,
)}). Bitte speichern Sie Scans mit geringerer Auflösung (z. B. 150 dpi, Graustufen) oder verkleinern Sie Ihre Bilder und versuchen Sie es erneut.`;
