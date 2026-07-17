import type { NavPage, ParsedDataset } from '../../types/dashboard';
import ThemeToggle from '../ui/ThemeToggle';

interface NavbarProps {
  activePage: NavPage;
  dataset: ParsedDataset | null;
}

const pageTitles: Record<NavPage, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Vantage · AI financial analytics' },
  upload:    { title: 'Upload Data', subtitle: 'Import your financial dataset' },
};

export default function Navbar({ activePage, dataset }: NavbarProps) {
  const { title, subtitle } = pageTitles[activePage];

  return (
    <header style={{
      height: '60px',
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      transition: 'background-color 0.2s ease',
    }}>
      <div>
        <h1 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
          {title}
        </h1>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ThemeToggle />

        {dataset ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '20px',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--accent)',
            fontSize: '11px', fontWeight: 500, color: 'var(--accent)',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            {dataset.fileName}
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '20px',
            background: '#00c89618', border: '1px solid #00c89630',
            fontSize: '11px', fontWeight: 500, color: 'var(--accent-green)',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }} />
            No data loaded
          </div>
        )}
      </div>
    </header>
  );
}
