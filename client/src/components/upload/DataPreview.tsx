import type { ParsedDataset } from '../../types/dashboard';

interface DataPreviewProps {
  dataset: ParsedDataset;
  onClear: () => void;
}

const PREVIEW_ROWS = 10;

export default function DataPreview({ dataset, onClear }: DataPreviewProps) {
  const { fileName, fileType, columns, rows, rowCount } = dataset;
  const previewRows = rows.slice(0, PREVIEW_ROWS);

  return (
    <div
      className="rounded-xl flex flex-col"
      style={{ backgroundColor: '#131c2e', border: '1px solid #1e2d47' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 gap-4"
        style={{ borderBottom: '1px solid #1e2d47' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center justify-center rounded-lg shrink-0 text-sm"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#0d1f38',
              border: '1px solid #2a3f5f',
              color: '#4a9eff',
            }}
          >
            {fileType === 'csv' ? '⊞' : '{ }'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#e8edf5' }}>
              {fileName}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#4a6080' }}>
              Loaded successfully
            </p>
          </div>
        </div>

        <button
          onClick={onClear}
          className="shrink-0 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors duration-150"
          style={{
            backgroundColor: '#1a1a2e',
            border: '1px solid #2a3f5f',
            color: '#8fa3bf',
          }}
        >
          Clear
        </button>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-3 divide-x px-0"
        style={{ borderBottom: '1px solid #1e2d47', borderColor: '#1e2d47' }}
      >
        {[
          { label: 'Rows', value: rowCount.toLocaleString() },
          { label: 'Columns', value: columns.length.toString() },
          { label: 'Format', value: fileType.toUpperCase() },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-4 gap-1">
            <span
              className="text-lg font-semibold"
              style={{ color: '#4a9eff', fontFamily: "'JetBrains Mono', monospace" }}
            >
              {value}
            </span>
            <span className="text-xs" style={{ color: '#4a6080' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Detected columns */}
      <div className="px-5 py-4 flex flex-col gap-3" style={{ borderBottom: '1px solid #1e2d47' }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#4a6080' }}>
          Detected Columns
        </p>
        <div className="flex flex-wrap gap-2">
          {columns.map((col) => (
            <span
              key={col}
              className="text-xs px-2.5 py-1 rounded-md font-mono"
              style={{
                backgroundColor: '#0f1629',
                border: '1px solid #2a3f5f',
                color: '#8fa3bf',
              }}
            >
              {col}
            </span>
          ))}
        </div>
      </div>

      {/* Preview table */}
      <div className="flex flex-col gap-3 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#4a6080' }}>
          Data Preview{' '}
          <span style={{ color: '#4a6080', fontWeight: 400 }}>
            (first {Math.min(PREVIEW_ROWS, rowCount)} of {rowCount.toLocaleString()} rows)
          </span>
        </p>

        <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid #1e2d47' }}>
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f1629' }}>
                <th
                  className="text-left px-3 py-2.5 font-medium shrink-0"
                  style={{
                    color: '#4a6080',
                    borderBottom: '1px solid #1e2d47',
                    borderRight: '1px solid #1e2d47',
                    minWidth: '40px',
                  }}
                >
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="text-left px-3 py-2.5 font-medium whitespace-nowrap"
                    style={{
                      color: '#8fa3bf',
                      borderBottom: '1px solid #1e2d47',
                      borderRight: '1px solid #1e2d47',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={{
                    backgroundColor: rowIdx % 2 === 0 ? 'transparent' : '#0d1422',
                  }}
                >
                  <td
                    className="px-3 py-2 tabular-nums"
                    style={{
                      color: '#4a6080',
                      borderRight: '1px solid #1e2d47',
                      borderBottom: rowIdx < previewRows.length - 1 ? '1px solid #1a2030' : 'none',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {rowIdx + 1}
                  </td>
                  {columns.map((col) => {
                    const val = row[col];
                    const display =
                      val === null || val === undefined ? '' : String(val);
                    return (
                      <td
                        key={col}
                        className="px-3 py-2 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis"
                        title={display}
                        style={{
                          color: '#e8edf5',
                          borderRight: '1px solid #1e2d47',
                          borderBottom:
                            rowIdx < previewRows.length - 1 ? '1px solid #1a2030' : 'none',
                          fontFamily: typeof val === 'number' ? "'JetBrains Mono', monospace" : undefined,
                        }}
                      >
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rowCount > PREVIEW_ROWS && (
          <p className="text-xs text-center" style={{ color: '#4a6080' }}>
            Showing {PREVIEW_ROWS} of {rowCount.toLocaleString()} rows
          </p>
        )}
      </div>
    </div>
  );
}
