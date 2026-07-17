const { GoogleGenAI } = require('@google/genai');

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables.');
}

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
const VALID_TYPES = ['line', 'bar', 'scatter', 'pie'];

function is429(err) {
  const msg = err?.message ?? '';
  return (
    err?.status === 429 ||
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('quota')
  );
}

async function callWithFallback(promptFn) {
  let lastErr;
  for (const model of MODELS) {
    try {
      console.log(`[gemini] trying ${model}`);
      const response = await genai.models.generateContent({
        model,
        contents: promptFn(),
      });
      console.log(`[gemini] success with ${model}`);
      return response.text.trim();
    } catch (err) {
      if (is429(err)) {
        console.warn(`[gemini] ${model} quota exhausted, trying next model…`);
        lastErr = err;
        continue;
      }
      throw err;
    }
  }
  throw new Error(`All Gemini models exhausted. Last error: ${lastErr?.message}`);
}

async function analyzeDataset(columns, rows) {
  const sample = rows.slice(0, 5);

  const text = await callWithFallback(() => `You are a financial data analyst.

Dataset columns: ${JSON.stringify(columns)}
Sample rows (first 5): ${JSON.stringify(sample, null, 2)}

Tasks:
1. Write a financial summary of this dataset in under 150 words.
2. Recommend 2–4 charts to best visualize the data. Rules:
   - Date/time column on X → type: "line"
   - Categorical column on X → type: "bar"
   - Data represents proportions or percentages → type: "pie"
   - Both axes are numeric (no date) → type: "scatter"
   - Use only column names that exist in the dataset for x and y.

Return ONLY valid JSON — no markdown, no code fences, no explanation:
{
  "summary": "<under 150 words>",
  "charts": [
    { "type": "line"|"bar"|"scatter"|"pie", "title": "<short title>", "x": "<column>", "y": "<column>" }
  ]
}`);

  return parseAnalysis(text, columns);
}

async function generateChatAnswer(question, columns, rows) {
  const sample = rows.slice(0, 20);

  return callWithFallback(() => `You are a financial analyst assistant. Answer questions about the dataset below.

Dataset columns: ${JSON.stringify(columns)}
Data (first 20 rows): ${JSON.stringify(sample, null, 2)}

Question: ${question}

Answer in 2–4 concise sentences. Be specific — reference actual column names and values where relevant. If the question cannot be answered from the data, say so clearly.`);
}

function parseAnalysis(raw, columns) {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${cleaned.slice(0, 300)}`);
  }

  const { summary, charts } = parsed;
  if (typeof summary !== 'string' || !summary.trim()) throw new Error('Missing "summary".');
  if (!Array.isArray(charts) || charts.length === 0) throw new Error('Missing "charts" array.');

  const validatedCharts = charts.map((chart, i) => {
    const { type, title, x, y } = chart;
    if (!VALID_TYPES.includes(type)) throw new Error(`Chart[${i}]: invalid type "${type}".`);
    if (!columns.includes(x)) throw new Error(`Chart[${i}]: x "${x}" not in dataset.`);
    if (!columns.includes(y)) throw new Error(`Chart[${i}]: y "${y}" not in dataset.`);
    if (typeof title !== 'string' || !title.trim()) throw new Error(`Chart[${i}]: missing title.`);
    return { type, title: title.trim(), x, y };
  });

  return { summary: summary.trim(), charts: validatedCharts };
}

module.exports = { analyzeDataset, generateChatAnswer };
