import type { KPICardData } from '../../types/dashboard';

interface KPICardProps {
  data: KPICardData;
}

const trendStyles = {
  up: { color: '#00c896', symbol: '▲' },
  down: { color: '#ff4d6a', symbol: '▼' },
  neutral: { color: '#8fa3bf', symbol: '—' },
};

export default function KPICard({ data }: KPICardProps) {
  const { label, value, change, trend, subLabel } = data;
  const { color, symbol } = trendStyles[trend];

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 transition-colors duration-200"
      style={{
        backgroundColor: '#131c2e',
        border: '1px solid #1e2d47',
      }}
    >
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: '#4a6080' }}>
        {label}
      </p>

      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold leading-none" style={{ color: '#e8edf5', fontFamily: "'JetBrains Mono', monospace" }}>
          {value}
        </span>
        <span
          className="flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5 mb-0.5"
          style={{
            color,
            backgroundColor: `${color}18`,
            border: `1px solid ${color}30`,
          }}
        >
          <span className="text-[10px]">{symbol}</span>
          {change}
        </span>
      </div>

      {subLabel && (
        <p className="text-xs" style={{ color: '#4a6080' }}>
          {subLabel}
        </p>
      )}
    </div>
  );
}
