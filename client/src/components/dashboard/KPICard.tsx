import type { KPICardData } from '../../types/dashboard';

interface KPICardProps { data: KPICardData; }

const trendStyles = {
  up:      { color: 'var(--accent-green)',  symbol: '▲' },
  down:    { color: 'var(--accent-red)',    symbol: '▼' },
  neutral: { color: 'var(--text-muted)',    symbol: '—' },
};

export default function KPICard({ data }: KPICardProps) {
  const { label, value, change, trend, subLabel } = data;
  const { color, symbol } = trendStyles[trend];

  return (
    <div
      className="card-hover"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>
        {label}
      </p>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{ fontSize: '22px', fontWeight: 600, lineHeight: 1, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
          {value}
        </span>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '3px',
          fontSize: '11px', fontWeight: 500,
          padding: '3px 8px', borderRadius: '20px',
          color, background: `color-mix(in srgb, ${color} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: '9px' }}>{symbol}</span>
          {change}
        </span>
      </div>

      {subLabel && (
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{subLabel}</p>
      )}
    </div>
  );
}
