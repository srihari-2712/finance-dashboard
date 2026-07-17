import type { KPICardData, ParsedDataset } from '../types/dashboard';

function toNum(v: unknown): number | null {
  const n = Number(String(v).replace(/[$,€£¥%]/g, '').trim());
  return isNaN(n) || v === null || v === '' ? null : n;
}

function numericValues(rows: ParsedDataset['rows'], col: string): number[] {
  return rows.map((r) => toNum(r[col])).filter((n): n is number => n !== null);
}

function mean(vals: number[]): number {
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

function median(vals: number[]): number {
  const sorted = [...vals].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function stddev(vals: number[]): number {
  const avg = mean(vals);
  return Math.sqrt(vals.reduce((s, v) => s + (v - avg) ** 2, 0) / vals.length);
}

function growthPercent(vals: number[]): number | null {
  if (vals.length < 2) return null;
  const first = vals[0];
  const last = vals[vals.length - 1];
  if (first === 0) return null;
  return ((last - first) / Math.abs(first)) * 100;
}

function fmt(n: number, decimals = 2): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(2) + 'K';
  return n.toFixed(decimals);
}

/** Pick the best numeric column to compute KPIs on (prefer "close", "price", "value", "revenue", etc.) */
function pickPrimaryColumn(dataset: ParsedDataset): string | null {
  const preferred = ['close', 'price', 'value', 'revenue', 'amount', 'total', 'sales', 'return'];
  const lower = dataset.columns.map((c) => c.toLowerCase());
  const match = preferred.find((k) => lower.some((c) => c.includes(k)));
  if (match) {
    const idx = lower.findIndex((c) => c.includes(match));
    return dataset.columns[idx];
  }
  // Fall back to first column with >50% numeric values
  for (const col of dataset.columns) {
    const vals = numericValues(dataset.rows, col);
    if (vals.length > dataset.rows.length * 0.5) return col;
  }
  return null;
}

export function computeKPIs(dataset: ParsedDataset): KPICardData[] {
  const col = pickPrimaryColumn(dataset);

  if (!col) {
    return [
      { id: 'kpi-1', label: 'Rows', value: String(dataset.rowCount), change: '—', trend: 'neutral' },
      { id: 'kpi-2', label: 'Columns', value: String(dataset.columns.length), change: '—', trend: 'neutral' },
      { id: 'kpi-3', label: 'Format', value: dataset.fileType.toUpperCase(), change: '—', trend: 'neutral' },
      { id: 'kpi-4', label: 'Status', value: 'Loaded', change: '—', trend: 'neutral' },
    ];
  }

  const vals = numericValues(dataset.rows, col);
  if (vals.length === 0) return [];

  const avg = mean(vals);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const med = median(vals);
  const sd = stddev(vals);
  const growth = growthPercent(vals);

  return [
    {
      id: 'kpi-avg',
      label: `Avg ${col}`,
      value: fmt(avg),
      change: `σ ${fmt(sd, 2)}`,
      trend: 'neutral',
      subLabel: `Median: ${fmt(med)}`,
    },
    {
      id: 'kpi-range',
      label: `${col} Range`,
      value: `${fmt(min)} – ${fmt(max)}`,
      change: `Δ ${fmt(max - min)}`,
      trend: 'neutral',
      subLabel: `Min / Max`,
    },
    {
      id: 'kpi-stddev',
      label: 'Std Deviation',
      value: fmt(sd),
      change: `CV ${((sd / Math.abs(avg)) * 100).toFixed(1)}%`,
      trend: sd / Math.abs(avg) > 0.3 ? 'down' : 'neutral',
      subLabel: 'Volatility proxy',
    },
    {
      id: 'kpi-growth',
      label: 'Growth',
      value: growth !== null ? `${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%` : '—',
      change: growth !== null ? `${fmt(vals[0])} → ${fmt(vals[vals.length - 1])}` : 'Insufficient data',
      trend: growth === null ? 'neutral' : growth > 0 ? 'up' : 'down',
      subLabel: `First → Last (${col})`,
    },
  ];
}
