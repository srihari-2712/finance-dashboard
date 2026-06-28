export type TrendDirection = 'up' | 'down' | 'neutral';

export interface KPICardData {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  subLabel?: string;
}

export type NavPage = 'dashboard' | 'upload';

export type ChartType = 'line' | 'bar' | 'scatter' | 'pie';

export interface ChartConfig {
  chartType: ChartType;
  xAxis: string;
  yAxis: string;
  title?: string;
  reason?: string;
}

export interface AIChartSpec {
  type: ChartType;
  title: string;
  x: string;
  y: string;
}

export type SummaryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; text: string }
  | { status: 'error'; message: string };

export interface ParsedDataset {
  fileName: string;
  fileType: 'csv' | 'json';
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  uploadedAt: Date;
}
