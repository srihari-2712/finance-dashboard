import Papa from 'papaparse';
import type { ParsedDataset } from '../types/dashboard';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_EXTENSIONS = ['.csv', '.json'];

function getExtension(fileName: string): string {
  return fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
}

function validateFile(file: File): string | null {
  const ext = getExtension(file.name);
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return `Unsupported file type "${ext}". Please upload a .csv or .json file.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 10 MB.`;
  }
  if (file.size === 0) {
    return 'File is empty.';
  }
  return null;
}

function parseJson(text: string, fileName: string): ParsedDataset {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON: could not parse file. Make sure it contains valid JSON.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Invalid JSON format: expected an array of objects (e.g. [{…}, {…}]).');
  }
  if (parsed.length === 0) {
    throw new Error('JSON array is empty — no data to display.');
  }

  const first = parsed[0];
  if (typeof first !== 'object' || first === null || Array.isArray(first)) {
    throw new Error('Invalid JSON format: each array element must be an object with key-value pairs.');
  }

  const columns = Object.keys(first as Record<string, unknown>);
  if (columns.length === 0) {
    throw new Error('JSON objects have no keys — cannot detect columns.');
  }

  const rows = parsed as Record<string, unknown>[];

  return {
    fileName,
    fileType: 'json',
    columns,
    rows,
    rowCount: rows.length,
    uploadedAt: new Date(),
  };
}

function parseCsv(text: string, fileName: string): ParsedDataset {
  const result = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (result.errors.length > 0) {
    const critical = result.errors.find((e) => e.type === 'Delimiter' || e.type === 'Quotes');
    if (critical) {
      throw new Error(`CSV parse error: ${critical.message}`);
    }
  }

  if (!result.data || result.data.length === 0) {
    throw new Error('CSV file is empty or contains only a header row with no data.');
  }

  const columns = result.meta.fields ?? [];
  if (columns.length === 0) {
    throw new Error('Could not detect column headers. Ensure the first row contains column names.');
  }

  return {
    fileName,
    fileType: 'csv',
    columns,
    rows: result.data,
    rowCount: result.data.length,
    uploadedAt: new Date(),
  };
}

export async function parseFile(file: File): Promise<ParsedDataset> {
  const validationError = validateFile(file);
  if (validationError) throw new Error(validationError);

  const text = await file.text();
  const ext = getExtension(file.name);

  if (ext === '.json') return parseJson(text, file.name);
  return parseCsv(text, file.name);
}
