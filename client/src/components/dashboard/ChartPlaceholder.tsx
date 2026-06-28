interface ChartPlaceholderProps {
  title?: string;
  height?: number;
}

export default function ChartPlaceholder({
  title = 'Chart',
  height = 320,
}: ChartPlaceholderProps) {
  return (
    <div
      className="rounded-xl flex flex-col"
      style={{
        backgroundColor: '#131c2e',
        border: '1px solid #1e2d47',
      }}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid #1e2d47' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="rounded"
            style={{ width: '3px', height: '16px', backgroundColor: '#2d7dd2' }}
          />
          <span className="text-sm font-semibold" style={{ color: '#e8edf5' }}>
            {title}
          </span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ backgroundColor: '#1a2540', color: '#4a6080', border: '1px solid #1e2d47' }}
        >
          Awaiting data
        </span>
      </div>

      {/* Placeholder body */}
      <div
        className="flex flex-col items-center justify-center gap-4 relative overflow-hidden"
        style={{ height }}
      >
        {/* Decorative grid lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          preserveAspectRatio="none"
        >
          {[0.2, 0.4, 0.6, 0.8].map((y) => (
            <line
              key={y}
              x1="0"
              y1={`${y * 100}%`}
              x2="100%"
              y2={`${y * 100}%`}
              stroke="#2a3f5f"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
          {[0.2, 0.4, 0.6, 0.8].map((x) => (
            <line
              key={x}
              x1={`${x * 100}%`}
              y1="0"
              x2={`${x * 100}%`}
              y2="100%"
              stroke="#2a3f5f"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
        </svg>

        {/* Decorative fake chart silhouette */}
        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <polyline
            points="0,80% 15%,65% 30%,70% 45%,40% 60%,50% 75%,30% 90%,35% 100%,20%"
            fill="none"
            stroke="#4a9eff"
            strokeWidth="2"
          />
        </svg>

        {/* Content */}
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: '52px',
            height: '52px',
            backgroundColor: '#0f1629',
            border: '1px solid #1e2d47',
            fontSize: '22px',
          }}
        >
          📊
        </div>
        <div className="relative text-center">
          <p className="text-sm font-medium" style={{ color: '#8fa3bf' }}>
            No dataset loaded
          </p>
          <p className="text-xs mt-1" style={{ color: '#4a6080' }}>
            Upload a CSV or JSON file to generate charts
          </p>
        </div>
      </div>
    </div>
  );
}
