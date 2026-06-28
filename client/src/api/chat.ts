import axios from 'axios';
import type { ParsedDataset } from '../types/dashboard';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface ChatResponse {
  answer: string;
}

export async function postChat(question: string, dataset: ParsedDataset): Promise<ChatResponse> {
  const { data } = await axios.post<ChatResponse>(`${BASE_URL}/chat`, {
    question,
    columns: dataset.columns,
    rows: dataset.rows,
  });
  return data;
}
