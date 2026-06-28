import type { NavPage, ParsedDataset } from '../../types/dashboard';

interface NavbarProps {
  activePage: NavPage;
  dataset: ParsedDataset | null;
}

const pageTitles: Record<NavPage, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'AI-powered financial analytics' },
  upload: { title: 'Upload Data', subtitle: 'Import your financial dataset' },
};

export default function Navbar({ activePage, dataset }: NavbarProps) {
  const { title, subtitle } = pageTitles[activePage];

  const statusLoaded = dataset !== null;

  return (
    <header
      className="flex items-center justify-between px-6"
      style={{
        height: '64px',
        backgroundColor: '#0f1629',
        borderBottom: '1px solid #1e2d47',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Page title */}
      <div>
        <h1 className="text-base font-semibold leading-tight" style={{ color: '#e8edf5' }}>
          {title}
        </h1>
        <p className="text-xs mt-0.5" style={{ color: '#4a6080' }}>
          {subtitle}
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Status pill */}
        {statusLoaded ? (
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: '#0d1f38', border: '1px solid #1a3d5f', color: '#4a9eff' }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: '6px', height: '6px', backgroundColor: '#4a9eff' }}
            />
            {dataset.fileName}
          </div>
        ) : (
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: '#0d1f12', border: '1px solid #1a3d20', color: '#00c896' }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: '6px', height: '6px', backgroundColor: '#00c896' }}
            />
            No data loaded
          </div>
        )}

        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full text-xs font-semibold shrink-0"
          style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #2d7dd2 0%, #8b5cf6 100%)',
            color: '#fff',
          }}
        >
          AI
        </div>
      </div>
    </header>
  );
}
