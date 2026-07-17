import type { NavPage } from '../../types/dashboard';

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { id: NavPage; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard',   icon: '▦' },
  { id: 'upload',    label: 'Upload Data', icon: '⬆' },
];

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside style={{
      width: collapsed ? '60px' : '210px',
      flexShrink: 0,
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease, background-color 0.2s ease',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: collapsed ? '0 14px' : '0 16px',
        height: '60px',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, borderRadius: '7px' }}>
          <defs>
            <linearGradient id="sbg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a3a6a"/>
              <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="8" fill="url(#sbg)"/>
          <rect x="5" y="20" width="4" height="7" rx="1" fill="white" opacity="0.5"/>
          <rect x="11" y="15" width="4" height="12" rx="1" fill="white" opacity="0.7"/>
          <rect x="17" y="10" width="4" height="17" rx="1" fill="white" opacity="0.9"/>
          <rect x="23" y="6" width="4" height="21" rx="1" fill="white"/>
          <polyline points="7,20 13,15 19,10 25,6" fill="none" stroke="#4a9eff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="25" cy="6" r="2" fill="#4a9eff"/>
        </svg>
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            Vantage
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: collapsed ? '9px 0' : '9px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '8px',
                border: 'none',
                width: '100%',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-alt)'; }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '14px', flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onToggle}
          title={collapsed ? 'Expand' : 'Collapse'}
          style={{
            width: '100%', padding: '8px', borderRadius: '8px',
            border: 'none', background: 'transparent',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-alt)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>
    </aside>
  );
}
