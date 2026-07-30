"use client";

import { MAX_FILE_BYTES } from "@/lib/accreditation";

const MAX_EDGE_LENGTH = 2200;
const QUALITY_STEPS = [0.82, 0.7, 0.6, 0.5, 0.4];

function isCompressibleImage(file: File): boolean {
  if (!file.type.startsWith("image/")) return false;
  // Animierte/vektorbasierte Formate werden nicht neu kodiert.
  return file.type !== "image/gif" && file.type !== "image/svg+xml";
}

async function decode(file: File): Promise<ImageBitmap | null> {
  if (typeof createImageBitmap !== "function") return null;
  try {
    return await createImageBitmap(file);
  } catch {
    // z. B. HEIC in Browsern ohne Decoder – Originaldatei wird beibehalten.
    return null;
  }
}

function drawToCanvas(
  bitmap: ImageBitmap,
  width: number,
  height: number,
): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

function replaceExtension(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  return `${base || "bild"}.jpg`;
}

/**
 * Verkleinert und komprimiert Bilder im Browser, damit der Upload das
 * Größenlimit der Server Action nicht sprengt.
 *
 * Schlägt irgendein Schritt fehl (fehlender Decoder, kein Canvas-Kontext,
 * größeres Ergebnis als das Original), wird die Originaldatei zurückgegeben –
 * die Größenprüfung liefert dann eine verständliche Meldung.
 */
export async function compressImageFile(file: File): Promise<File> {
  if (!isCompressibleImage(file)) return file;
  if (file.size <= 400 * 1024) return file;

  const bitmap = await decode(file);
  if (!bitmap) return file;

  try {
    const scale = Math.min(
      1,
      MAX_EDGE_LENGTH / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = drawToCanvas(bitmap, width, height);
    if (!canvas) return file;

    let best: Blob | null = null;
    for (const quality of QUALITY_STEPS) {
      const blob = await toBlob(canvas, quality);
      if (!blob) break;
      best = blob;
      if (blob.size <= MAX_FILE_BYTES) break;
    }

    if (!best || best.size >= file.size) return file;

    return new File([best], replaceExtension(file.name), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    bitmap.close();
  }
}

/**
 * Ersetzt ein Datei-Feld der FormData durch die komprimierte Variante.
 * Gibt zurück, ob eine Ersetzung stattgefunden hat.
 */
export async function compressFormDataFile(
  formData: FormData,
  field: string,
): Promise<boolean> {
  const value = formData.get(field);
  if (!(value instanceof File) || value.size === 0) return false;

  const compressed = await compressImageFile(value);
  if (compressed === value) return false;

  formData.set(field, compressed, compressed.name);
  return true;
}
