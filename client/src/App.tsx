import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import { postAnalyze } from './api/analyze';
import type { NavPage, ParsedDataset, SummaryState, AIChartSpec } from './types/dashboard';

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  const [summaryState, setSummaryState] = useState<SummaryState>({ status: 'idle' });
  const [charts, setCharts] = useState<AIChartSpec[]>([]);

  async function handleDataParsed(ds: ParsedDataset) {
    setDataset(ds);
    setCharts([]);
    setActivePage('upload');
    setSummaryState({ status: 'loading' });
    try {
      const { summary, charts: aiCharts } = await postAnalyze(ds);
      setSummaryState({ status: 'success', text: summary });
      setCharts(aiCharts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setSummaryState({ status: 'error', message });
    }
  }

  function handleClearDataset() {
    setDataset(null);
    setSummaryState({ status: 'idle' });
    setCharts([]);
  }

  return (
    <div className="flex w-full min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar activePage={activePage} dataset={dataset} />
        <main className="flex-1 overflow-auto" style={{ backgroundColor: '#0a0e1a' }}>
          {activePage === 'dashboard' && (
            <DashboardPage dataset={dataset} summaryState={summaryState} charts={charts} />
          )}
          {activePage === 'upload' && (
            <UploadPage
              dataset={dataset}
              onDataParsed={handleDataParsed}
              onClearDataset={handleClearDataset}
            />
          )}
        </main>
      </div>
    </div>
  );
}
