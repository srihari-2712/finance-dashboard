import axios from 'axios';
import type { ParsedDataset, AIChartSpec } from '../types/dashboard';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface AnalyzeResponse {
  summary: string;
  charts: AIChartSpec[];
}

export async function postAnalyze(dataset: ParsedDataset): Promise<AnalyzeResponse> {
  const payload = { columns: dataset.columns, rows: dataset.rows };
  console.log('[analyze] sending payload:', payload);
  const { data } = await axios.post<AnalyzeResponse>(`${BASE_URL}/analyze`, payload);
  console.log('[analyze] response:', data);
  return data;
}
