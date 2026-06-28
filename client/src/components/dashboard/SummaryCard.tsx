import type { SummaryState } from '../../types/dashboard';
import { Skeleton } from '../ui/Skeleton';
import { exportSummaryPdf } from '../../utils/exportPdf';

interface SummaryCardProps {
  title?: string;
  summaryState: SummaryState;
  fileName?: string;
}

export default function SummaryCard({ title = 'AI Analysis Summary', summaryState, fileName = 'summary' }: SummaryCardProps) {
  const statusLabel =
    summaryState.status === 'loading' ? 'Analyzing…' :
    summaryState.status === 'success' ? 'Done' :
    summaryState.status === 'error'   ? 'Error' : 'Idle';

  const statusColor =
    summaryState.status === 'loading' ? '#f5a623' :
    summaryState.status === 'success' ? '#00c896' :
    summaryState.status === 'error'   ? '#ff4d6a' : '#4a6080';

  const statusBg =
    summaryState.status === 'loading' ? '#1f1a0d' :
    summaryState.status === 'success' ? '#0d1f12' :
    summaryState.status === 'error'   ? '#1a0d14' : '#1a2540';

  const statusBorder =
    summaryState.status === 'loading' ? '#3d3010' :
    summaryState.status === 'success' ? '#1a3d20' :
    summaryState.status === 'error'   ? '#4a1525' : '#1e2d47';

  return (
    <div
      className="card-hover"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          width: '32px', height: '32px', flexShrink: 0,
          background: 'linear-gradient(135deg, #2d7dd2 0%, #8b5cf6 100%)',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
        }}>✦</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Powered by Gemini 2.5 Flash</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {summaryState.status === 'success' && (
            <button
              onClick={() => exportSummaryPdf(summaryState.text, fileName)}
              title="Download PDF"
              style={{
                fontSize: '11px', padding: '3px 9px', borderRadius: '6px',
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#00c89644'; (e.currentTarget as HTMLButtonElement).style.color = '#00c896'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
            >
              ↓ PDF
            </button>
          )}
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', backgroundColor: statusBg, color: statusColor, border: `1px solid ${statusBorder}` }}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {summaryState.status === 'idle' && (
          <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', display: 'flex', gap: '10px' }}>
            <span style={{ color: 'var(--text-muted)', flexShrink: 0, fontSize: '13px' }}>ℹ</span>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              Upload a dataset to generate an AI-powered executive summary with key insights and trends.
            </p>
          </div>
        )}

        {summaryState.status === 'loading' && (
          <>
            <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="spin" style={{ width: '14px', height: '14px', border: '2px solid #f5a623', borderTopColor: 'transparent', borderRadius: '50%', flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Gemini is analyzing your dataset…</p>
            </div>
            <Skeleton height="0.75rem" />
            <Skeleton height="0.75rem" width="92%" />
            <Skeleton height="0.75rem" width="85%" />
            <Skeleton height="0.75rem" width="60%" />
          </>
        )}

        {summaryState.status === 'success' && (
          <>
            <p style={{ fontSize: '13px', color: '#c8d8e8', lineHeight: '1.75', margin: 0 }}>{summaryState.text}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Generated by Gemini 2.5 Flash · Based on up to 100 rows</p>
          </>
        )}

        {summaryState.status === 'error' && (
          <div style={{ background: '#1a0d14', border: '1px solid #4a1525', borderRadius: '8px', padding: '12px', display: 'flex', gap: '10px' }}>
            <span style={{ color: '#ff4d6a', flexShrink: 0 }}>⚠</span>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#ff4d6a', margin: 0 }}>Summary failed</p>
              <p style={{ fontSize: '12px', color: '#bf6070', marginTop: '4px', lineHeight: '1.5' }}>{summaryState.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
