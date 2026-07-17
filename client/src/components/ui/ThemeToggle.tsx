import { useTheme } from '../../context/ThemeContext';

const OPTIONS = [
  { value: 'light' as const, label: 'Light', icon: '☀' },
  { value: 'dark'  as const, label: 'Dark',  icon: '☾' },
];

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'var(--surface-alt)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '3px', gap: '2px',
    }}>
      {OPTIONS.map((opt) => {
        const active = mode === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setMode(opt.value)}
            title={opt.label}
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', borderRadius: '7px', border: 'none',
              cursor: 'pointer', fontSize: '11px',
              fontWeight: active ? 600 : 400,
              transition: 'all 0.15s',
              background: active ? 'var(--surface-raised)' : 'transparent',
              color: active ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: active ? '0 1px 3px var(--shadow)' : 'none',
            }}
          >
            <span style={{ fontSize: '12px' }}>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
