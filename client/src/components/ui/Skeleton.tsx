interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({ className = '', width = '100%', height = '1rem', rounded = false }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: rounded ? '9999px' : '4px' }}
    />
  );
}

export function SkeletonKPICard() {
  return (
    <div style={{ padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
      <Skeleton width="60%" height="0.7rem" />
      <div style={{ marginTop: '14px' }}>
        <Skeleton width="50%" height="1.8rem" />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Skeleton width="40%" height="0.7rem" />
      </div>
      <div style={{ marginTop: '8px' }}>
        <Skeleton width="70%" height="0.6rem" />
      </div>
    </div>
  );
}

export function SkeletonChart({ height = 260 }: { height?: number }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px', height,
    }}>
      <Skeleton width="40%" height="0.9rem" />
      <div style={{ marginTop: '6px' }}>
        <Skeleton width="25%" height="0.6rem" />
      </div>
      <div style={{
        marginTop: '20px', height: height - 80,
        display: 'flex', alignItems: 'flex-end', gap: '6px',
      }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              flex: 1,
              height: `${30 + Math.sin(i * 0.8) * 25 + Math.random() * 20}%`,
              borderRadius: '3px 3px 0 0',
              animationDelay: `${i * 0.07}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
