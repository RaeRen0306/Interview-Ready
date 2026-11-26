// Reads the text out of a Word (.docx) file in the browser, with no extra software.
// A .docx file is a zip archive; the text lives in word/document.xml.

async function inflate(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function readZipEntry(buffer: ArrayBuffer, wanted: string): Promise<Uint8Array | null> {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);

  // Find the "end of central directory" record near the end of the file.
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 66000); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) return null;

  const entries = view.getUint16(eocd + 10, true);
  let pos = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder();

  for (let n = 0; n < entries; n++) {
    if (view.getUint32(pos, true) !== 0x02014b50) return null;
    const method = view.getUint16(pos + 10, true);
    const compressedSize = view.getUint32(pos + 20, true);
    const nameLength = view.getUint16(pos + 28, true);
    const extraLength = view.getUint16(pos + 30, true);
    const commentLength = view.getUint16(pos + 32, true);
    const localOffset = view.getUint32(pos + 42, true);
    const name = decoder.decode(bytes.subarray(pos + 46, pos + 46 + nameLength));

    if (name === wanted) {
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const data = bytes.subarray(start, start + compressedSize);
      if (method === 0) return data;
      if (method === 8) return inflate(data);
      return null;
    }
    pos += 46 + nameLength + extraLength + commentLength;
  }
  return null;
}

function decodeEntities(text: string) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&");
}

export async function readDocxText(file: File): Promise<string> {
  const xmlBytes = await readZipEntry(await file.arrayBuffer(), "word/document.xml");
  if (!xmlBytes) throw new Error("This doesn't look like a Word (.docx) file.");
  const xml = new TextDecoder().decode(xmlBytes);

  const text = xml
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<w:br[^>]*\/>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "");

  return decodeEntities(text)
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line, i, all) => line || (all[i - 1] ?? "").trim())
    .join("\n")
    .trim();
}

// Reads a resume file chosen with the "Choose File" button.
export async function readResumeFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx")) return readDocxText(file);
  if (name.endsWith(".txt")) return (await file.text()).trim();
  if (name.endsWith(".doc")) {
    throw new Error(
      "This is an older Word format (.doc). Open it in Word, choose File > Save As, and save it as a .docx file, or copy and paste the text instead.",
    );
  }
  if (name.endsWith(".pdf")) {
    throw new Error("PDF files can't be read here. Open the PDF, press Ctrl+A then Ctrl+C, and paste the text into the box.");
  }
  throw new Error("Please choose a Word (.docx) or text (.txt) file.");
}
