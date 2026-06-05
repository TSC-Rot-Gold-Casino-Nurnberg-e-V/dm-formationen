"use client";

import { ComponentProps, useActionState, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  submitAccreditation,
  type AccreditationState,
} from "@/app/presse/actions";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const FormInput = ({ ...props }: ComponentProps<"input">) => (
  <input
    {...props}
    className={twMerge(
      "w-full rounded-xl border border-base-700 bg-base-800/50 px-4 py-2.5 text-base-100 placeholder:text-base-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none transition-colors",
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

export function AccreditationForm() {
  const [state, formAction, isPending] = useActionState<
    AccreditationState,
    FormData
  >(submitAccreditation, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [reportingSelected, setReportingSelected] = useState(false);
  const [reportingTouched, setReportingTouched] = useState(false);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-green-800 bg-green-950/40 p-6 text-center space-y-3">
        <CheckCircleIcon className="size-12 text-green-400 mx-auto" />
        <p className="text-green-300 font-medium text-lg">Anfrage gesendet</p>
        <p className="text-base-400 text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(e) => {
        if (!reportingSelected) {
          e.preventDefault();
          setReportingTouched(true);
        }
      }}
      className="space-y-8"
    >
      {/* 1) Allgemeine Angaben */}
      <fieldset>
        <FormSection>
          <legend className="text-lg font-semibold text-base-100 mb-2">
            Allgemeine Angaben
          </legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="firstName">Vorname *</FormLabel>
              <FormInput type="text" id="firstName" name="firstName" required />
            </div>
            <div>
              <FormLabel htmlFor="lastName">Nachname *</FormLabel>
              <FormInput type="text" id="lastName" name="lastName" required />
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
            />
          </div>

          <div>
            <FormLabel>Art der Berichterstattung *</FormLabel>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {[
                { value: "print", label: "Zeitung / Druckerzeugnis" },
                { value: "online", label: "Onlinebericht" },
                { value: "photo", label: "Foto" },
                { value: "video", label: "Video" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer rounded-lg border border-base-700 px-3 py-2 text-sm text-base-300 has-checked:border-primary-500 has-checked:text-primary-300 transition-colors"
                >
                  <input
                    type="checkbox"
                    name="reportingType"
                    value={opt.value}
                    className="accent-primary-500"
                    onChange={(e) => {
                      const form = formRef.current;
                      if (form) {
                        const checked = form.querySelectorAll(
                          'input[name="reportingType"]:checked',
                        );
                        setReportingSelected(checked.length > 0);
                      }
                      if (e.target.checked) setReportingTouched(true);
                    }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {reportingTouched && !reportingSelected && (
              <p className="text-red-400 text-xs mt-1.5">
                Bitte wählen Sie mindestens eine Art der Berichterstattung aus.
              </p>
            )}
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
            <FormInput type="email" id="email" name="email" required />
          </div>

          <div>
            <FormLabel htmlFor="pressPass">Presseausweis</FormLabel>
            <p className="text-xs text-base-400 mb-2">
              Bitte fügen Sie Ihren Presseausweis oder Akkreditierungsauftrag
              zu.
            </p>
            <input
              type="file"
              id="pressPass"
              name="pressPass"
              accept="image/*,.pdf"
              className="w-full text-sm text-base-400 file:mr-3 file:rounded-lg file:border-0 file:bg-base-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-base-200 file:cursor-pointer hover:file:bg-base-600 transition-colors"
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
            <FormInput type="text" id="street" name="street" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="zip">Postleitzahl *</FormLabel>
              <FormInput type="text" id="zip" name="zip" required />
            </div>
            <div>
              <FormLabel htmlFor="city">Wohnort *</FormLabel>
              <FormInput type="text" id="city" name="city" required />
            </div>
          </div>

          <div>
            <FormLabel htmlFor="country">Land *</FormLabel>
            <FormInput
              type="text"
              id="country"
              name="country"
              required
              defaultValue="Deutschland"
            />
          </div>

          <div>
            <FormLabel htmlFor="phone">Telefonnummer *</FormLabel>
            <FormInput type="tel" id="phone" name="phone" required />
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

          <label className="flex items-start gap-2 cursor-pointer text-sm text-base-300">
            <input
              type="checkbox"
              name="privacy"
              required
              className="accent-primary-500 mt-0.5"
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

          <label className="flex items-start gap-2 cursor-pointer text-sm text-base-300">
            <input
              type="checkbox"
              name="medienrichtlinien"
              required
              className="accent-primary-500 mt-0.5"
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
        </FormSection>
      </fieldset>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-base-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {isPending ? "Wird gesendet…" : "Akkreditierung beantragen"}
      </button>

      {/* Server error */}
      {state && !state.success && (
        <div className="rounded-xl border border-red-800 bg-red-950/40 p-4 flex gap-3 items-start">
          <ExclamationTriangleIcon className="size-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{state.message}</p>
        </div>
      )}
    </form>
  );
}
