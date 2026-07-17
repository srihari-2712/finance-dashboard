import { useRef, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  ScatterChart, Scatter,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import type { ParsedDataset, AIChartSpec } from '../../types/dashboard';
import { exportChartPng } from '../../utils/exportChart';
import { useTheme } from '../../context/ThemeContext';

interface DynamicChartProps {
  dataset: ParsedDataset;
  spec: AIChartSpec;
  height?: number;
  colorIndex?: number;
}

const COLORS = ['#4a9eff', '#00c896', '#f5a623', '#ff4d6a', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];

function toNumber(v: unknown): number {
  const cleaned = String(v).replace(/[$,€£¥%]/g, '').trim();
  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
}

function truncateLabel(label: string, max = 14): string {
  return label.length > max ? label.slice(0, max) + '…' : label;
}

export default function DynamicChart({ dataset, spec, height = 300, colorIndex = 0 }: DynamicChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const { resolved: theme } = useTheme();
  const { rows } = dataset;
  const { type, x, y } = spec;
  const color = COLORS[colorIndex % COLORS.length];

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#4a6080' : '#94a3b8';
  const gridColor = isDark ? '#1e2d47' : '#e2e8f0';
  const tooltipBg = isDark ? '#0f1624' : '#ffffff';
  const tooltipBorder = isDark ? '#2a3f5f' : '#dce4f0';
  const tooltipText = isDark ? '#eef1f8' : '#0d1526';
  const legendColor = isDark ? '#8fa3bf' : '#3d5070';

  const AXIS_STYLE = { fill: axisColor, fontSize: 11 };
  const GRID_STYLE = { stroke: gridColor, strokeDasharray: '3 3' };
  const TOOLTIP_STYLE = { backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: '8px', color: tooltipText, fontSize: 12 };

  const chartData = useMemo(
    () => rows.map((row) => ({ ...row, [y]: toNumber(row[y]) })),
    [rows, y],
  );

  const scatterData = useMemo(
    () => rows.map((r) => ({ [x]: toNumber(r[x]), [y]: toNumber(r[y]) })),
    [rows, x, y],
  );

  const pieData = useMemo(() => {
    const agg: Record<string, number> = {};
    for (const row of rows) {
      const key = String(row[x] ?? '');
      agg[key] = (agg[key] ?? 0) + toNumber(row[y]);
    }
    return Object.entries(agg).map(([name, value]) => ({ name, value }));
  }, [rows, x, y]);

  async function handleExport() {
    if (!ref.current || exporting) return;
    setExporting(true);
    try { await exportChartPng(ref.current, spec.title); }
    finally { setExporting(false); }
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis dataKey={x} tick={AXIS_STYLE} tickFormatter={truncateLabel} />
            <YAxis tick={AXIS_STYLE} width={60} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: legendColor }} />
            <Line type="monotone" dataKey={y} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis dataKey={x} tick={AXIS_STYLE} tickFormatter={truncateLabel} />
            <YAxis tick={AXIS_STYLE} width={60} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: isDark ? '#1e2d47' : '#f0f4fa' }} />
            <Legend wrapperStyle={{ fontSize: 11, color: legendColor }} />
            <Bar dataKey={y} fill={color} radius={[3, 3, 0, 0]} maxBarSize={40} isAnimationActive={false} />
          </BarChart>
        );
      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis dataKey={x} type="number" name={x} tick={AXIS_STYLE} width={60} />
            <YAxis dataKey={y} type="number" name={y} tick={AXIS_STYLE} width={60} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name={`${x} vs ${y}`} data={scatterData} fill={color} opacity={0.8} isAnimationActive={false} />
          </ScatterChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%"
              label={({ name, percent }) => `${truncateLabel(String(name))} ${((percent ?? 0) * 100).toFixed(1)}%`}
              labelLine={{ stroke: gridColor }} isAnimationActive={false}
            >
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: legendColor }} />
          </PieChart>
        );
    }
  };

  return (
    <div ref={ref} className="card-hover fade-slide-up"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div style={{ width: '3px', height: '16px', backgroundColor: color, borderRadius: '2px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {spec.title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: 'var(--accent-subtle)', border: '1px solid color-mix(in srgb, var(--accent-purple) 30%, transparent)', color: 'var(--accent-purple)' }}>
            ✦ AI
          </span>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', textTransform: 'capitalize', background: 'var(--accent-subtle)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', color: 'var(--accent)' }}>
            {type}
          </span>
          <button onClick={handleExport} title="Export as PNG"
            style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s', opacity: exporting ? 0.5 : 1 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
          >
            {exporting ? '…' : '↓ PNG'}
          </button>
        </div>
      </div>
      <div style={{ height, padding: '16px 8px 8px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
