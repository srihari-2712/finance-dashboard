import type { NavPage } from '../../types/dashboard';

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: { id: NavPage; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'upload', label: 'Upload Data', icon: '⬆' },
];

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className="flex flex-col shrink-0 transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? '64px' : '220px',
        backgroundColor: '#0f1629',
        borderRight: '1px solid #1e2d47',
        minHeight: '100svh',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: '1px solid #1e2d47', height: '64px' }}
      >
        <div
          className="shrink-0 flex items-center justify-center rounded"
          style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #2d7dd2 0%, #8b5cf6 100%)',
            fontSize: '14px',
          }}
        >
          ◈
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm truncate" style={{ color: '#e8edf5' }}>
            FinanceAI
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 p-2 pt-4">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 w-full text-left cursor-pointer"
              style={{
                backgroundColor: isActive ? '#1a2f52' : 'transparent',
                color: isActive ? '#4a9eff' : '#8fa3bf',
                border: isActive ? '1px solid #2a3f5f' : '1px solid transparent',
              }}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0 text-base leading-none">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2" style={{ borderTop: '1px solid #1e2d47' }}>
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full rounded-md py-2 text-sm transition-colors duration-150 cursor-pointer"
          style={{ color: '#4a6080' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>
    </aside>
  );
}
