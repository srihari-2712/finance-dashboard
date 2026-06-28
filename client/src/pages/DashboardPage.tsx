import { useMemo } from 'react';
import KPICard from '../components/dashboard/KPICard';
import ChartPlaceholder from '../components/dashboard/ChartPlaceholder';
import DynamicChart from '../components/dashboard/DynamicChart';
import SummaryCard from '../components/dashboard/SummaryCard';
import ChatPanel from '../components/chat/ChatPanel';
import { SkeletonKPICard, SkeletonChart } from '../components/ui/Skeleton';
import { computeKPIs } from '../utils/kpi';
import type { ParsedDataset, SummaryState, AIChartSpec } from '../types/dashboard';

const EMPTY_KPIS = [
  { id: 'k1', label: 'Average',       value: '—', change: '—', trend: 'neutral' as const, subLabel: 'Upload data' },
  { id: 'k2', label: 'Range',         value: '—', change: '—', trend: 'neutral' as const, subLabel: 'Upload data' },
  { id: 'k3', label: 'Std Deviation', value: '—', change: '—', trend: 'neutral' as const, subLabel: 'Upload data' },
  { id: 'k4', label: 'Growth',        value: '—', change: '—', trend: 'neutral' as const, subLabel: 'Upload data' },
];

interface DashboardPageProps {
  dataset: ParsedDataset | null;
  summaryState: SummaryState;
  charts: AIChartSpec[];
}

export default function DashboardPage({ dataset, summaryState, charts }: DashboardPageProps) {
  const kpis = useMemo(
    () => (dataset ? computeKPIs(dataset) : EMPTY_KPIS),
    [dataset],
  );

  const isAnalyzing = summaryState.status === 'loading';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}
        className="lg:grid-cols-4"
      >
        {isAnalyzing && !dataset
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPICard key={i} />)
          : kpis.map((kpi) => <KPICard key={kpi.id} data={kpi} />)
        }
      </div>

      {/* First chart + Summary side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}
        className="xl:grid-cols-3"
      >
        <div className="xl:col-span-2">
          {isAnalyzing ? (
            <SkeletonChart height={340} />
          ) : dataset && charts.length > 0 ? (
            <DynamicChart dataset={dataset} spec={charts[0]} height={340} colorIndex={0} />
          ) : (
            <ChartPlaceholder title="Price / Performance Chart" height={340} />
          )}
        </div>
        <div className="xl:col-span-1">
          <SummaryCard
            summaryState={summaryState}
            fileName={dataset?.fileName ?? 'summary'}
          />
        </div>
      </div>

      {/* Remaining AI charts */}
      {isAnalyzing && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px' }}
          className="lg:grid-cols-2"
        >
          <SkeletonChart height={260} />
          <SkeletonChart height={260} />
        </div>
      )}

      {!isAnalyzing && charts.length > 1 && dataset && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px' }}
          className="lg:grid-cols-2"
        >
          {charts.slice(1).map((spec, i) => (
            <DynamicChart
              key={`${spec.title}-${i}`}
              dataset={dataset}
              spec={spec}
              height={280}
              colorIndex={i + 1}
            />
          ))}
        </div>
      )}

      {!isAnalyzing && charts.length === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '24px' }}
          className="lg:grid-cols-2"
        >
          <ChartPlaceholder title="Volume Analysis" height={260} />
          <ChartPlaceholder title="Distribution Breakdown" height={260} />
        </div>
      )}

      {/* Chat Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}
        className="lg:grid-cols-2"
      >
        <div style={{ gridColumn: '1 / -1' }}>
          <ChatPanel dataset={dataset} />
        </div>
      </div>

    </div>
  );
}
