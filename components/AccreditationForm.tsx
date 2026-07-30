"use client";

import {
  ComponentProps,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { twMerge } from "tailwind-merge";
import { submitAccreditation } from "@/app/presse/actions";
import {
  CONTACT_EMAIL,
  FIELD_LABELS,
  MAX_FILE_BYTES,
  REPORTING_TYPES,
  UPLOAD_ACCEPT_ATTRIBUTE,
  UPLOAD_FORMAT_HINT,
  UPLOAD_TOO_LARGE_MESSAGE,
  formatBytes,
  parseAccreditationFormData,
  sortedFieldErrors,
  summaryMessage,
  validateTotalUploadSize,
  validateUploadFile,
  type AccreditationFieldErrors,
  type AccreditationFieldName,
  type AccreditationState,
} from "@/lib/accreditation";
import { compressFormDataFile } from "@/lib/compress-image";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

type FileFieldName = "pressPass" | "signedEhrenkodex";

type FileNote = { error?: string; info?: string };

/**
 * Übersetzt Fehler, die beim Übertragen der Server Action geworfen werden
 * (Netzwerkabbruch, 413 wegen zu großer Anhänge, 5xx, Deploy während des
 * Absendens) in verständliche deutsche Meldungen. Ohne diese Behandlung würde
 * React den Fehler an die Error-Boundary weiterreichen und der Nutzer sähe nur
 * „Application error: a client-side exception has occurred".
 */
function describeTransportError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  const message = raw.toLowerCase();

  if (
    message.includes("body exceeded") ||
    message.includes("413") ||
    message.includes("entity too large") ||
    message.includes("payload too large") ||
    message.includes("request too large")
  ) {
    return UPLOAD_TOO_LARGE_MESSAGE;
  }

  if (
    message.includes("failed to fetch") ||
    message.includes("load failed") ||
    message.includes("networkerror") ||
    message.includes("network request failed") ||
    message.includes("aborted")
  ) {
    return `Die Verbindung zum Server ist abgebrochen. Die häufigste Ursache sind zu große Dateianhänge (maximal ${formatBytes(
      MAX_FILE_BYTES,
    )} pro Datei) oder eine instabile Internetverbindung. Bitte verkleinern Sie Ihre Dateien und versuchen Sie es erneut.`;
  }

  return `Beim Absenden ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut oder senden Sie uns Ihre Unterlagen direkt per E-Mail an ${CONTACT_EMAIL}.`;
}

const FormInput = ({
  hasError,
  ...props
}: ComponentProps<"input"> & { hasError?: boolean }) => (
  <input
    {...props}
    aria-invalid={hasError || undefined}
    className={twMerge(
      "w-full rounded-xl border border-base-700 bg-base-800/50 px-4 py-2.5 text-base-100 placeholder:text-base-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors",
      hasError && "border-red-600 focus:border-red-500 focus:ring-red-500",
      props.className,
    )}
  />
);

const FormLabel = ({ children, ...props }: ComponentProps<"label">) => (
  <label
    {...props}
    className={twMerge(
      "block text-sm font-medium text-base-300 mb-1",
      props.className,
    )}
  >
    {children}
  </label>
);

const FormSection = ({ ...props }: ComponentProps<"div">) => (
  <section {...props} className={twMerge("space-y-4", props.className)} />
);

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} className="text-red-400 text-xs mt-1.5" role="alert">
      {message}
    </p>
  ) : null;

export function AccreditationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const fieldId = useId();

  // Eigener Fortschritts-State: Auf `isPending` von useActionState ist kein
  // Verlass, sobald die Action aus einer eigenen Transition heraus gestartet
  // wird – der Button wäre dann schon nach wenigen Millisekunden wieder aktiv
  // und Nutzer könnten das Formular mehrfach abschicken.
  const [phase, setPhase] = useState<"idle" | "optimizing" | "sending">("idle");
  const [fileNotes, setFileNotes] = useState<Record<string, FileNote>>({});
  const [resolvedFields, setResolvedFields] = useState<string[]>([]);
  const [, startTransition] = useTransition();

  const [state, formAction, isPending] = useActionState<
    AccreditationState,
    FormData
  >(async (previousState, formData) => {
    try {
      // Bilder werden vor dem Upload verkleinert, damit das Größenlimit der
      // Server Action (4 MB) nicht gesprengt wird.
      try {
        await compressFormDataFile(formData, "pressPass");
        await compressFormDataFile(formData, "signedEhrenkodex");
      } catch {
        // Komprimierung ist optional – die Prüfungen unten greifen weiterhin.
      }

      const parsed = parseAccreditationFormData(formData);
      if (!parsed.success) {
        return {
          status: "error",
          message: summaryMessage(parsed.fieldErrors),
          fieldErrors: parsed.fieldErrors,
        };
      }

      const tooLarge = validateTotalUploadSize(formData);
      if (tooLarge) {
        return {
          status: "error",
          message: tooLarge,
          fieldErrors: { signedEhrenkodex: tooLarge },
        };
      }

      setPhase("sending");
      return await submitAccreditation(previousState, formData);
    } catch (error) {
      console.error("Akkreditierung: Übertragung fehlgeschlagen", error);
      return { status: "error", message: describeTransportError(error) };
    } finally {
      setPhase("idle");
    }
  }, null);

  const serverFieldErrors: AccreditationFieldErrors = state?.fieldErrors ?? {};

  const visibleFieldErrors: AccreditationFieldErrors = Object.fromEntries(
    Object.entries(serverFieldErrors).filter(
      ([field, message]) => Boolean(message) && !resolvedFields.includes(field),
    ),
  ) as AccreditationFieldErrors;

  for (const [field, note] of Object.entries(fileNotes)) {
    if (note.error) {
      visibleFieldErrors[field as AccreditationFieldName] = note.error;
    }
  }

  const errorList = sortedFieldErrors(visibleFieldErrors);
  const showSummary = state?.status === "error";

  // Nach einem fehlgeschlagenen Absenden zur Fehlerübersicht springen.
  useEffect(() => {
    if (state?.status === "error") {
      errorSummaryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [state]);

  useEffect(() => {
    setResolvedFields([]);
  }, [state]);

  const focusField = (field: AccreditationFieldName) => {
    const form = formRef.current;
    if (!form) return;
    const element = form.querySelector<HTMLElement>(`[name="${field}"]`);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.focus({ preventScroll: true });
  };

  const clearFieldError = (field: AccreditationFieldName) => {
    setResolvedFields((current) =>
      current.includes(field) ? current : [...current, field],
    );
  };

  const errorFor = (field: AccreditationFieldName) =>
    visibleFieldErrors[field];

  const describedBy = (field: AccreditationFieldName) =>
    errorFor(field) ? `${fieldId}-${field}-error` : undefined;

  const handleFileChange = (
    field: FileFieldName,
    label: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    clearFieldError(field);
    const file = event.target.files?.[0];

    if (!file || file.size === 0) {
      setFileNotes((current) => ({ ...current, [field]: {} }));
      return;
    }

    const isImage = file.type.startsWith("image/");
    // Bilder werden vor dem Upload automatisch verkleinert – daher wird die
    // Größe hier bewusst nicht bemängelt, sondern nur Format und Inhalt geprüft.
    const error = validateUploadFile(
      {
        name: file.name,
        size: isImage ? Math.min(file.size, 1) : file.size,
        type: file.type,
      },
      label,
    );

    setFileNotes((current) => ({
      ...current,
      [field]: {
        error: error ?? undefined,
        info: error
          ? undefined
          : isImage && file.size > MAX_FILE_BYTES
            ? `${file.name} · ${formatBytes(file.size)} – das Bild wird vor dem Upload automatisch verkleinert.`
            : `${file.name} · ${formatBytes(file.size)}`,
      },
    }));
  };

  if (state?.status === "success") {
    return (
      <div className="rounded-2xl border border-green-800 bg-green-950/40 p-6 text-center space-y-3">
        <CheckCircleIcon className="size-12 text-green-400 mx-auto" />
        <p className="text-green-300 font-medium text-lg">Anfrage gesendet</p>
        <p className="text-base-400 text-sm">{state.message}</p>
      </div>
    );
  }

  const busy = phase !== "idle" || isPending;

  const submitLabel =
    phase === "optimizing"
      ? "Dateien werden optimiert…"
      : busy
        ? "Wird gesendet…"
        : "Akkreditierung beantragen";

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(event) => {
        // Bewusst kein `action`-Prop: React würde das Formular nach jedem
        // Absenden zurücksetzen und alle Eingaben (inkl. Dateien) verwerfen.
        event.preventDefault();
        if (busy) return;
        const data = new FormData(event.currentTarget);
        setPhase("optimizing");
        startTransition(() => {
          formAction(data);
        });
      }}
      className="space-y-8"
    >
      {/* Fehlerübersicht */}
      <div ref={errorSummaryRef}>
        {showSummary && (
          <div
            className="rounded-xl border border-red-800 bg-red-950/40 p-4 flex gap-3 items-start"
            role="alert"
            aria-live="assertive"
          >
            <ExclamationTriangleIcon className="size-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="text-red-300">{state.message}</p>
              {errorList.length > 1 && (
                <ul className="list-disc pl-4 space-y-1 text-red-300/90">
                  {errorList.map(({ field, message }) => (
                    <li key={field}>
                      <button
                        type="button"
                        onClick={() => focusField(field)}
                        className="text-left underline decoration-red-500/60 underline-offset-2 hover:text-red-200 cursor-pointer"
                      >
                        <span className="font-medium">
                          {FIELD_LABELS[field]}:
                        </span>{" "}
                        {message}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {state.errorCode && (
                <p className="text-red-300/70 text-xs">
                  Fehler-Referenz: {state.errorCode}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 1) Allgemeine Angaben */}
      <fieldset>
        <FormSection>
          <legend className="text-lg font-semibold text-base-100 mb-2">
            Allgemeine Angaben
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="firstName">Vorname *</FormLabel>
              <FormInput
                type="text"
                id="firstName"
                name="firstName"
                required
                autoComplete="given-name"
                hasError={Boolean(errorFor("firstName"))}
                aria-describedby={describedBy("firstName")}
                onChange={() => clearFieldError("firstName")}
              />
              <FieldError
                id={`${fieldId}-firstName-error`}
                message={errorFor("firstName")}
              />
            </div>
            <div>
              <FormLabel htmlFor="lastName">Nachname *</FormLabel>
              <FormInput
                type="text"
                id="lastName"
                name="lastName"
                required
                autoComplete="family-name"
                hasError={Boolean(errorFor("lastName"))}
                aria-describedby={describedBy("lastName")}
                onChange={() => clearFieldError("lastName")}
              />
              <FieldError
                id={`${fieldId}-lastName-error`}
                message={errorFor("lastName")}
              />
            </div>
          </div>

          <div>
            <FormLabel htmlFor="medium">Medium *</FormLabel>
            <FormInput
              type="text"
              id="medium"
              name="medium"
              required
              placeholder="z.B. Nürnberger Nachrichten"
              hasError={Boolean(errorFor("medium"))}
              aria-describedby={describedBy("medium")}
              onChange={() => clearFieldError("medium")}
            />
            <FieldError
              id={`${fieldId}-medium-error`}
              message={errorFor("medium")}
            />
          </div>

          <div>
            <FormLabel htmlFor="position">
              Position, Ressort, Funktion *
            </FormLabel>
            <FormInput
              type="text"
              id="position"
              name="position"
              required
              placeholder="z.B. Sportredakteur"
              hasError={Boolean(errorFor("position"))}
              aria-describedby={describedBy("position")}
              onChange={() => clearFieldError("position")}
            />
            <FieldError
              id={`${fieldId}-position-error`}
              message={errorFor("position")}
            />
          </div>

          <div>
            <FormLabel>Art der Berichterstattung *</FormLabel>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {(
                Object.entries(REPORTING_TYPES) as [string, string][]
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer rounded-lg border border-base-700 px-3 py-2 text-sm text-base-300 has-checked:border-primary-500 has-checked:text-primary-300 transition-colors"
                >
                  <input
                    type="checkbox"
                    name="reportingType"
                    value={value}
                    className="accent-primary-500"
                    aria-describedby={describedBy("reportingType")}
                    onChange={() => clearFieldError("reportingType")}
                  />
                  {label}
                </label>
              ))}
            </div>
            <FieldError
              id={`${fieldId}-reportingType-error`}
              message={errorFor("reportingType")}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-base-300">
            <input
              type="checkbox"
              name="freelancer"
              className="accent-primary-500"
            />
            Freelancer
          </label>

          <div>
            <FormLabel htmlFor="email">E-Mail *</FormLabel>
            <FormInput
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              hasError={Boolean(errorFor("email"))}
              aria-describedby={describedBy("email")}
              onChange={() => clearFieldError("email")}
            />
            <FieldError
              id={`${fieldId}-email-error`}
              message={errorFor("email")}
            />
          </div>

          <div>
            <FormLabel htmlFor="pressPass">Presseausweis</FormLabel>
            <p className="text-xs text-base-400 mb-2">
              Bitte fügen Sie Ihren Presseausweis oder Akkreditierungsauftrag
              zu. Erlaubt sind {UPLOAD_FORMAT_HINT} (max.{" "}
              {formatBytes(MAX_FILE_BYTES)}). Fotos werden automatisch
              verkleinert.
            </p>
            <input
              type="file"
              id="pressPass"
              name="pressPass"
              accept={UPLOAD_ACCEPT_ATTRIBUTE}
              aria-invalid={Boolean(errorFor("pressPass")) || undefined}
              aria-describedby={describedBy("pressPass")}
              onChange={(event) =>
                handleFileChange("pressPass", "Presseausweis", event)
              }
              className="w-full text-sm text-base-400 file:mr-3 file:rounded-lg file:border-0 file:bg-base-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-base-200 file:cursor-pointer hover:file:bg-base-600 transition-colors"
            />
            {fileNotes.pressPass?.info && (
              <p className="text-xs text-base-400 mt-1.5">
                {fileNotes.pressPass.info}
              </p>
            )}
            <FieldError
              id={`${fieldId}-pressPass-error`}
              message={errorFor("pressPass")}
            />
          </div>
        </FormSection>
      </fieldset>

      {/* 2) Medienlizenz */}
      <fieldset>
        <FormSection>
          <legend className="text-lg font-semibold text-base-100 mb-2">
            Medienlizenz
          </legend>

          <div className="rounded-xl border border-base-700 bg-base-800/30 p-4 text-sm text-base-400 leading-relaxed">
            Sofern Sie über keinen Presseausweis verfügen oder keinen
            Redaktionsauftrag vorlegen können, können Sie eine kostenpflichtige
            Medienlizenz (70,00&nbsp;€ zzgl. 7&nbsp;% MwSt, gesamt:
            74,90&nbsp;€) beantragen. Die Überweisung auf das auf der Seite
            angegebene Konto mit dem Verwendungszweck{" "}
            <span className="font-mono text-base-300">
              &quot;Medienlizenz: Ihr Name&quot;
            </span>{" "}
            muss spätestens bis zum{" "}
            <strong className="text-base-300">20. Oktober 2026</strong>{" "}
            eingegangen sein. Die Akkreditierung wird erst nach vollständigem
            Zahlungseingang wirksam.
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-sm text-base-300">
            <input
              type="checkbox"
              name="medienlizenz"
              className="accent-primary-500 mt-0.5"
            />
            <span>
              Ich beantrage eine Medienlizenz und werde den Betrag bis zum
              Stichtag auf das angegebene Konto überweisen.
            </span>
          </label>
        </FormSection>
      </fieldset>

      {/* 3) Persönliche Angaben */}
      <fieldset>
        <FormSection>
          <legend className="text-lg font-semibold text-base-100 mb-2">
            Persönliche Angaben
          </legend>

          <div>
            <FormLabel htmlFor="street">Straße, Hausnummer *</FormLabel>
            <FormInput
              type="text"
              id="street"
              name="street"
              required
              autoComplete="street-address"
              hasError={Boolean(errorFor("street"))}
              aria-describedby={describedBy("street")}
              onChange={() => clearFieldError("street")}
            />
            <FieldError
              id={`${fieldId}-street-error`}
              message={errorFor("street")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="zip">Postleitzahl *</FormLabel>
              <FormInput
                type="text"
                id="zip"
                name="zip"
                required
                autoComplete="postal-code"
                hasError={Boolean(errorFor("zip"))}
                aria-describedby={describedBy("zip")}
                onChange={() => clearFieldError("zip")}
              />
              <FieldError
                id={`${fieldId}-zip-error`}
                message={errorFor("zip")}
              />
            </div>
            <div>
              <FormLabel htmlFor="city">Wohnort *</FormLabel>
              <FormInput
                type="text"
                id="city"
                name="city"
                required
                autoComplete="address-level2"
                hasError={Boolean(errorFor("city"))}
                aria-describedby={describedBy("city")}
                onChange={() => clearFieldError("city")}
              />
              <FieldError
                id={`${fieldId}-city-error`}
                message={errorFor("city")}
              />
            </div>
          </div>

          <div>
            <FormLabel htmlFor="country">Land *</FormLabel>
            <FormInput
              type="text"
              id="country"
              name="country"
              required
              autoComplete="country-name"
              defaultValue="Deutschland"
              hasError={Boolean(errorFor("country"))}
              aria-describedby={describedBy("country")}
              onChange={() => clearFieldError("country")}
            />
            <FieldError
              id={`${fieldId}-country-error`}
              message={errorFor("country")}
            />
          </div>

          <div>
            <FormLabel htmlFor="phone">Telefonnummer *</FormLabel>
            <FormInput
              type="tel"
              id="phone"
              name="phone"
              required
              autoComplete="tel"
              hasError={Boolean(errorFor("phone"))}
              aria-describedby={describedBy("phone")}
              onChange={() => clearFieldError("phone")}
            />
            <FieldError
              id={`${fieldId}-phone-error`}
              message={errorFor("phone")}
            />
          </div>
        </FormSection>
      </fieldset>

      {/* 4) Datenschutzerklärung */}
      <fieldset>
        <FormSection>
          <legend className="text-lg font-semibold text-base-100 mb-2">
            Datenschutzerklärung
          </legend>

          <p className="text-sm text-base-400 leading-relaxed">
            Mit dem Absenden willige ich zur Datenerhebung, -verarbeitung und
            -nutzung gemäß der{" "}
            <a
              href="https://www.rot-gold-casino.de/datenschutzerklaerung"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 underline hover:text-primary-300 transition-colors"
            >
              Datenschutzerklärung
            </a>{" "}
            des TSC Rot-Gold-Casino Nürnberg e.V. ein. Die
            Einwilligungserklärung ist freiwillig. Ich kann sie jederzeit
            widerrufen. Mir ist bekannt, dass im Falle eines Widerrufes die
            Akkreditierungsanfrage nicht bestätigt wird oder aber eine
            bestätigte Akkreditierung widerrufen wird.
          </p>

          <div>
            <label className="flex items-start gap-2 cursor-pointer text-sm text-base-300">
              <input
                type="checkbox"
                name="privacy"
                className="accent-primary-500 mt-0.5"
                aria-invalid={Boolean(errorFor("privacy")) || undefined}
                aria-describedby={describedBy("privacy")}
                onChange={() => clearFieldError("privacy")}
              />
              <span>
                Ich stimme der{" "}
                <a
                  href="https://www.rot-gold-casino.de/datenschutzerklaerung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 underline hover:text-primary-300 transition-colors"
                >
                  Datenschutzerklärung
                </a>{" "}
                zu. *
              </span>
            </label>
            <FieldError
              id={`${fieldId}-privacy-error`}
              message={errorFor("privacy")}
            />
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer text-sm text-base-300">
              <input
                type="checkbox"
                name="medienrichtlinien"
                className="accent-primary-500 mt-0.5"
                aria-invalid={
                  Boolean(errorFor("medienrichtlinien")) || undefined
                }
                aria-describedby={describedBy("medienrichtlinien")}
                onChange={() => clearFieldError("medienrichtlinien")}
              />
              <span>
                Ich habe die{" "}
                <a
                  href="/medienrichtlinien.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 underline hover:text-primary-300 transition-colors"
                >
                  Medienrichtlinien
                </a>{" "}
                gelesen und erkenne sie als verbindlich an. *
              </span>
            </label>
            <FieldError
              id={`${fieldId}-medienrichtlinien-error`}
              message={errorFor("medienrichtlinien")}
            />
          </div>
        </FormSection>
      </fieldset>

      {/* 5) Jugendschutz & Ethik (DTV) */}
      <fieldset>
        <FormSection>
          <legend className="text-lg font-semibold text-base-100 mb-2">
            Jugendschutz &amp; Ethik (DTV)
          </legend>

          <p className="text-sm text-base-400 leading-relaxed">
            Der Deutsche Tanzsportverband (DTV) setzt für die Akkreditierung die
            Anerkennung seiner Jugendschutz- und Ethikgrundsätze voraus. Bitte
            laden Sie den{" "}
            <a
              href="/ehrenkodex-dtv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 underline hover:text-primary-300 transition-colors"
            >
              Ehrenkodex des DTV
            </a>{" "}
            herunter, unterschreiben Sie ihn und fügen Sie die unterschriebene
            Datei unten bei. Zusätzlich bestätigen Sie bitte, dass Sie den{" "}
            <a
              href="/dtv-ethik-code.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 underline hover:text-primary-300 transition-colors"
            >
              DTV-Ethik-Code
            </a>{" "}
            sowie die{" "}
            <a
              href="/erklaerung-schutz-kinder-jugendliche.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 underline hover:text-primary-300 transition-colors"
            >
              Erklärung zum Schutz von Kindern und Jugendlichen
            </a>{" "}
            gelesen haben.
          </p>

          <div>
            <FormLabel htmlFor="signedEhrenkodex">
              Unterschriebener Ehrenkodex *
            </FormLabel>
            <p className="text-xs text-base-400 mb-2">
              Bitte laden Sie den unterschriebenen Ehrenkodex des DTV hoch.
              Erlaubt sind {UPLOAD_FORMAT_HINT} (max.{" "}
              {formatBytes(MAX_FILE_BYTES)}). Ist Ihr PDF größer, speichern Sie
              den Scan bitte mit geringerer Auflösung (z. B. 150 dpi,
              Graustufen).
            </p>
            <input
              type="file"
              id="signedEhrenkodex"
              name="signedEhrenkodex"
              accept={UPLOAD_ACCEPT_ATTRIBUTE}
              required
              aria-invalid={Boolean(errorFor("signedEhrenkodex")) || undefined}
              aria-describedby={describedBy("signedEhrenkodex")}
              onChange={(event) =>
                handleFileChange(
                  "signedEhrenkodex",
                  "Unterschriebener Ehrenkodex",
                  event,
                )
              }
              className="w-full text-sm text-base-400 file:mr-3 file:rounded-lg file:border-0 file:bg-base-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-base-200 file:cursor-pointer hover:file:bg-base-600 transition-colors"
            />
            {fileNotes.signedEhrenkodex?.info && (
              <p className="text-xs text-base-400 mt-1.5">
                {fileNotes.signedEhrenkodex.info}
              </p>
            )}
            <FieldError
              id={`${fieldId}-signedEhrenkodex-error`}
              message={errorFor("signedEhrenkodex")}
            />
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer text-sm text-base-300">
              <input
                type="checkbox"
                name="ethikCodeConfirmed"
                className="accent-primary-500 mt-0.5"
                aria-invalid={
                  Boolean(errorFor("ethikCodeConfirmed")) || undefined
                }
                aria-describedby={describedBy("ethikCodeConfirmed")}
                onChange={() => clearFieldError("ethikCodeConfirmed")}
              />
              <span>
                Ich habe den{" "}
                <a
                  href="/dtv-ethik-code.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 underline hover:text-primary-300 transition-colors"
                >
                  DTV-Ethik-Code
                </a>{" "}
                gelesen und erkenne ihn an. *
              </span>
            </label>
            <FieldError
              id={`${fieldId}-ethikCodeConfirmed-error`}
              message={errorFor("ethikCodeConfirmed")}
            />
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer text-sm text-base-300">
              <input
                type="checkbox"
                name="kinderJugendschutzConfirmed"
                className="accent-primary-500 mt-0.5"
                aria-invalid={
                  Boolean(errorFor("kinderJugendschutzConfirmed")) || undefined
                }
                aria-describedby={describedBy("kinderJugendschutzConfirmed")}
                onChange={() => clearFieldError("kinderJugendschutzConfirmed")}
              />
              <span>
                Ich habe die{" "}
                <a
                  href="/erklaerung-schutz-kinder-jugendliche.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 underline hover:text-primary-300 transition-colors"
                >
                  Erklärung zum Schutz von Kindern und Jugendlichen
                </a>{" "}
                gelesen und erkenne sie an. *
              </span>
            </label>
            <FieldError
              id={`${fieldId}-kinderJugendschutzConfirmed-error`}
              message={errorFor("kinderJugendschutzConfirmed")}
            />
          </div>
        </FormSection>
      </fieldset>

      {/* Submit */}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-base-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {submitLabel}
      </button>

      <p className="text-xs text-base-500 text-center">
        Probleme beim Absenden? Schreiben Sie uns an{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="underline hover:text-base-300 transition-colors"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
