interface ChartPlaceholderProps {
  title?: string;
  height?: number;
}

export default function ChartPlaceholder({ title = 'Chart', height = 320 }: ChartPlaceholderProps) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '3px', height: '16px', borderRadius: '2px', backgroundColor: 'var(--accent)' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
        </div>
        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: 'var(--surface-alt)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          Awaiting data
        </span>
      </div>

      <div style={{ height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', position: 'relative', overflow: 'hidden' }}>
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06 }} preserveAspectRatio="none">
          {[0.25, 0.5, 0.75].map((y) => (
            <line key={y} x1="0" y1={`${y * 100}%`} x2="100%" y2={`${y * 100}%`} stroke="var(--border-bright)" strokeWidth="1" strokeDasharray="4 4" />
          ))}
          {[0.25, 0.5, 0.75].map((x) => (
            <line key={x} x1={`${x * 100}%`} y1="0" x2={`${x * 100}%`} y2="100%" stroke="var(--border-bright)" strokeWidth="1" strokeDasharray="4 4" />
          ))}
        </svg>

        <div style={{ position: 'relative', width: '44px', height: '44px', borderRadius: '50%', background: 'var(--surface-alt)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
          📊
        </div>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', margin: 0 }}>No dataset loaded</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Upload a CSV or JSON file to generate charts</p>
        </div>
      </div>
    </div>
  );
}
