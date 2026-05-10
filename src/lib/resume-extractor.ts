import * as pdfjsLib from "pdfjs-dist";
// Use the bundled worker via Vite ?url import — no CDN dependency
// @ts-ignore - vite handles this with the ?url suffix
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc as string;

/**
 * Extract plain text from a resume file (PDF, TXT, DOC fallback).
 * For PDFs we use pdfjs in the browser to avoid sending raw bytes to edge functions.
 */
export async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    return await extractPdfText(file);
  }

  if (name.endsWith(".txt") || file.type.startsWith("text/")) {
    return await file.text();
  }

  // For DOCX or unknown types we still try .text() — the AI is robust to noise,
  // and the worst case is a degraded but still usable analysis.
  try {
    return await file.text();
  } catch {
    return `Resume file: ${file.name}`;
  }
}

async function extractPdfText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  const pages: string[] = [];
  const max = Math.min(pdf.numPages, 10); // cap to first 10 pages
  for (let i = 1; i <= max; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((it: any) => ("str" in it ? it.str : "")).filter(Boolean);
    pages.push(strings.join(" "));
  }
  const text = pages.join("\n\n").trim();
  if (text.length < 30) {
    // Likely image-based PDF; fall back to filename so the user gets a soft error
    throw new Error("Could not extract text from this PDF. Try a text-based PDF or paste the content.");
  }
  return text;
}
