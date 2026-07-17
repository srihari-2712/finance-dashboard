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

interface DynamicChartProps {
  dataset: ParsedDataset;
  spec: AIChartSpec;
  height?: number;
  colorIndex?: number;
}

const COLORS = ['#4a9eff', '#00c896', '#f5a623', '#ff4d6a', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];
const AXIS_STYLE = { fill: '#4a6080', fontSize: 11 };
const GRID_STYLE = { stroke: '#1e2d47', strokeDasharray: '3 3' };
const TOOLTIP_STYLE = {
  backgroundColor: '#0f1629',
  border: '1px solid #2a3f5f',
  borderRadius: '8px',
  color: '#e8edf5',
  fontSize: 12,
};

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
  const { rows } = dataset;
  const { type, x, y } = spec;
  const color = COLORS[colorIndex % COLORS.length];

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
    try {
      await exportChartPng(ref.current, spec.title);
    } finally {
      setExporting(false);
    }
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
            <Legend wrapperStyle={{ fontSize: 11, color: '#8fa3bf' }} />
            <Line type="monotone" dataKey={y} stroke={color} strokeWidth={2}
              dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis dataKey={x} tick={AXIS_STYLE} tickFormatter={truncateLabel} />
            <YAxis tick={AXIS_STYLE} width={60} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#1e2d47' }} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#8fa3bf' }} />
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
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
              outerRadius="70%"
              label={({ name, percent }) => `${truncateLabel(String(name))} ${((percent ?? 0) * 100).toFixed(1)}%`}
              labelLine={{ stroke: '#2a3f5f' }}
              isAnimationActive={false}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#8fa3bf' }} />
          </PieChart>
        );
    }
  };

  return (
    <div
      ref={ref}
      className="card-hover fade-slide-up"
      style={{ backgroundColor: '#131c2e', border: '1px solid #1e2d47', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: '1px solid #1e2d47',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div style={{ width: '3px', height: '16px', backgroundColor: color, borderRadius: '2px', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#e8edf5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {spec.title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', backgroundColor: '#1a0f38', border: '1px solid #3d2a6f', color: '#8b5cf6' }}>
            ✦ AI
          </span>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', textTransform: 'capitalize', backgroundColor: '#0d1f38', border: '1px solid #2a3f5f', color: '#4a9eff' }}>
            {type}
          </span>
          <button
            onClick={handleExport}
            title="Export as PNG"
            style={{
              fontSize: '11px', padding: '3px 9px', borderRadius: '6px',
              background: 'transparent', border: '1px solid #1e2d47',
              color: '#4a6080', cursor: 'pointer', transition: 'all 0.15s',
              opacity: exporting ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#4a9eff44'; (e.currentTarget as HTMLButtonElement).style.color = '#4a9eff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1e2d47'; (e.currentTarget as HTMLButtonElement).style.color = '#4a6080'; }}
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
