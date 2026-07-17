import { useState, useRef, useEffect } from 'react';

interface ColumnSelectorProps {
  columns: string[];
  selected: string | null;
  onChange: (col: string | null) => void;
}

export default function ColumnSelector({ columns, selected, onChange }: ColumnSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const displayLabel = selected ?? 'Auto';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 12px',
          background: 'var(--surface-alt)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--text-secondary)',
          fontSize: '12px', cursor: 'pointer',
          transition: 'all 0.15s', whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>KPI column</span>
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{displayLabel}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          minWidth: '180px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '10px', boxShadow: '0 8px 32px var(--shadow)',
          zIndex: 50, overflow: 'hidden',
          animation: 'fadeSlideUp 0.15s ease',
        }}>
          <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {/* Auto option */}
            {[{ col: null, label: 'Auto detect' }, ...columns.map((c) => ({ col: c, label: c }))].map(({ col, label }) => {
              const active = col === selected;
              return (
                <button
                  key={label}
                  onClick={() => { onChange(col); setOpen(false); }}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '8px 12px', borderRadius: '7px', border: 'none',
                    cursor: 'pointer', fontSize: '12px',
                    fontWeight: active ? 600 : 400,
                    background: active ? 'var(--accent-subtle)' : 'transparent',
                    color: active ? 'var(--accent)' : col === null ? 'var(--text-muted)' : 'var(--text-secondary)',
                    transition: 'background 0.1s',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-alt)'; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  {label}
                  {active && <span style={{ fontSize: '10px' }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
