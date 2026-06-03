"use server";

import nodemailer from "nodemailer";

export type AccreditationState = {
  success: boolean;
  message: string;
} | null;

const REPORTING_TYPES: Record<string, string> = {
  print: "Zeitung / Druckerzeugnis",
  online: "Onlinebericht",
  photo: "Foto",
  video: "Video",
};

export async function submitAccreditation(
  _prevState: AccreditationState,
  formData: FormData,
): Promise<AccreditationState> {
  // Extract fields
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const medium = formData.get("medium") as string;
  const position = formData.get("position") as string;
  const reportingTypes = formData.getAll("reportingType") as string[];
  const freelancer = formData.get("freelancer") === "on";
  const email = formData.get("email") as string;

  const street = formData.get("street") as string;
  const zip = formData.get("zip") as string;
  const city = formData.get("city") as string;
  const country = formData.get("country") as string;
  const phone = formData.get("phone") as string;

  const privacy = formData.get("privacy") === "on";
  const medienlizenz = formData.get("medienlizenz") === "on";

  const pressPass = formData.get("pressPass") as File | null;

  // Validation
  if (
    !firstName ||
    !lastName ||
    !medium ||
    !position ||
    reportingTypes.length === 0 ||
    !email ||
    !street ||
    !zip ||
    !city ||
    !country ||
    !phone
  ) {
    return {
      success: false,
      message: "Bitte füllen Sie alle Pflichtfelder aus.",
    };
  }

  if (!privacy) {
    return {
      success: false,
      message: "Bitte stimmen Sie der Datenschutzerklärung zu.",
    };
  }

  // Build email
  const reportingLabels = reportingTypes
    .map((t) => REPORTING_TYPES[t] || t)
    .join(", ");

  const textContent = `
NEUE AKKREDITIERUNGSANFRAGE
========================================

ALLGEMEINE ANGABEN
----------------------------------------
Vorname:              ${firstName}
Nachname:             ${lastName}
Medium:               ${medium}
Position / Funktion:  ${position}
Berichterstattung:    ${reportingLabels}
Freelancer:           ${freelancer ? "Ja" : "Nein"}
E-Mail:               ${email}
Presseausweis:        ${pressPass && pressPass.size > 0 ? "Im Anhang" : "Nicht beigefügt"}
Medienlizenz:         ${medienlizenz ? "Ja – Zahlung zugesagt" : "Nein"}

PERSÖNLICHE ANGABEN
----------------------------------------
Straße, Hausnummer:   ${street}
Postleitzahl:         ${zip}
Wohnort:              ${city}
Land:                 ${country}
Telefonnummer:        ${phone}

DATENSCHUTZ
----------------------------------------
Datenschutzerklärung: Zugestimmt

========================================
Diese Anfrage wurde über das Online-Formular auf der Webseite der
Deutschen Meisterschaft der Formationen 2026 gesendet.
`.trim();

  const htmlContent = `
<div style="font-family: monospace, monospace; font-size: 14px; color: #222;">
  <h2 style="margin-bottom: 4px;">Neue Akkreditierungsanfrage</h2>
  <hr/>
  <h3>Allgemeine Angaben</h3>
  <table style="border-collapse: collapse;">
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Vorname</td><td>${escape(firstName)}</td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Nachname</td><td>${escape(lastName)}</td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Medium</td><td>${escape(medium)}</td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Position / Funktion</td><td>${escape(position)}</td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Berichterstattung</td><td>${escape(reportingLabels)}</td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Freelancer</td><td>${freelancer ? "Ja" : "Nein"}</td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">E-Mail</td><td><a href="mailto:${escape(email)}">${escape(email)}</a></td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Presseausweis</td><td>${pressPass && pressPass.size > 0 ? "Im Anhang" : "Nicht beigefügt"}</td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Medienlizenz</td><td>${medienlizenz ? "✅ Ja – Zahlung zugesagt" : "Nein"}</td></tr>
  </table>

  <h3>Persönliche Angaben</h3>
  <table style="border-collapse: collapse;">
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Straße, Hausnummer</td><td>${escape(street)}</td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Postleitzahl</td><td>${escape(zip)}</td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Wohnort</td><td>${escape(city)}</td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Land</td><td>${escape(country)}</td></tr>
    <tr><td style="padding: 2px 16px 2px 0; white-space: nowrap; color: #666;">Telefonnummer</td><td>${escape(phone)}</td></tr>
  </table>

  <h3>Datenschutz</h3>
  <p>Datenschutzerklärung: ✅ Zugestimmt</p>
  <hr/>
  <p style="color: #999; font-size: 12px;">Diese Anfrage wurde über das Online-Formular auf der Webseite der Deutschen Meisterschaft der Formationen 2026 gesendet.</p>
</div>
`.trim();

  // Prepare attachments
  const attachments: { filename: string; content: Buffer }[] = [];
  if (pressPass && pressPass.size > 0) {
    const buffer = Buffer.from(await pressPass.arrayBuffer());
    attachments.push({
      filename: pressPass.name,
      content: buffer,
    });
  }

  // Send email
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
      replyTo: email,
      subject: `Akkreditierungsanfrage: ${firstName} ${lastName} – ${medium}`,
      text: textContent,
      html: htmlContent,
      attachments,
    });

    return {
      success: true,
      message:
        "Ihre Akkreditierungsanfrage wurde erfolgreich gesendet. Sie erhalten eine Rückmeldung per E-Mail.",
    };
  } catch (error) {
    console.error("Failed to send accreditation email:", error);
    return {
      success: false,
      message:
        "Beim Versenden ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.",
    };
  }
}

function escape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

