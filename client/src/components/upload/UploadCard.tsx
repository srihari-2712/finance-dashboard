import { useState, useRef } from 'react';
import { parseFile } from '../../utils/parseFile';
import type { ParsedDataset } from '../../types/dashboard';

interface UploadCardProps {
  onDataParsed: (dataset: ParsedDataset) => void;
}

type UploadState = 'idle' | 'parsing' | 'error';

export default function UploadCard({ onDataParsed }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    setUploadState('parsing');
    setErrorMessage(null);
    try {
      const dataset = await parseFile(file);
      setUploadState('idle');
      onDataParsed(dataset);
    } catch (err) {
      setUploadState('error');
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only fire when leaving the drop zone itself, not a child
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      // Reset so re-selecting the same file still fires onChange
      e.target.value = '';
    }
  };

  const isParsing = uploadState === 'parsing';

  return (
    <div
      className="rounded-xl flex flex-col"
      style={{ backgroundColor: '#131c2e', border: '1px solid #1e2d47' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: '1px solid #1e2d47' }}
      >
        <div>
          <h2 className="text-base font-semibold" style={{ color: '#e8edf5' }}>
            Import Dataset
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#4a6080' }}>
            Supported formats: CSV, JSON · Max 10 MB
          </p>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-5">
        {/* Drop zone */}
        <div
          onClick={() => !isParsing && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="rounded-xl flex flex-col items-center justify-center gap-4 transition-all duration-200"
          style={{
            minHeight: '200px',
            cursor: isParsing ? 'default' : 'pointer',
            border: `2px dashed ${isDragging ? '#2d7dd2' : uploadState === 'error' ? '#ff4d6a' : '#1e2d47'}`,
            backgroundColor: isDragging ? '#0d1f38' : uploadState === 'error' ? '#1a0d14' : '#0f1629',
          }}
        >
          {isParsing ? (
            <>
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '56px',
                  height: '56px',
                  border: '2px solid #2d7dd2',
                  borderTopColor: 'transparent',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p className="text-sm font-medium" style={{ color: '#8fa3bf' }}>
                Parsing file…
              </p>
            </>
          ) : (
            <>
              <div
                className="flex items-center justify-center rounded-full text-2xl"
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: isDragging ? '#1a2f52' : '#131c2e',
                  border: `1px solid ${isDragging ? '#2d7dd2' : '#1e2d47'}`,
                  transition: 'all 0.2s',
                }}
              >
                {isDragging ? '📂' : '📁'}
              </div>
              <div className="text-center">
                <p
                  className="text-sm font-medium"
                  style={{ color: isDragging ? '#4a9eff' : '#8fa3bf' }}
                >
                  {isDragging ? 'Drop your file here' : 'Drag & drop your file here'}
                </p>
                <p className="text-xs mt-1" style={{ color: '#4a6080' }}>
                  or{' '}
                  <span style={{ color: '#4a9eff' }}>click to browse</span> from your computer
                </p>
              </div>
            </>
          )}
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,.json"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Error banner */}
        {uploadState === 'error' && errorMessage && (
          <div
            className="rounded-lg px-4 py-3 flex items-start gap-3"
            style={{ backgroundColor: '#1a0d14', border: '1px solid #4a1525' }}
          >
            <span style={{ color: '#ff4d6a', flexShrink: 0 }}>⚠</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#ff4d6a' }}>
                Failed to parse file
              </p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#bf6070' }}>
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => { setUploadState('idle'); setErrorMessage(null); }}
              className="shrink-0 text-xs cursor-pointer"
              style={{ color: '#4a6080' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Format hints */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { fmt: 'CSV', desc: 'Column headers in the first row. Delimiter auto-detected.' },
            { fmt: 'JSON', desc: 'Array of objects where each key maps to a column name.' },
          ].map(({ fmt, desc }) => (
            <div
              key={fmt}
              className="rounded-lg p-4"
              style={{ backgroundColor: '#0f1629', border: '1px solid #1e2d47' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#1a2540', color: '#4a9eff', border: '1px solid #2a3f5f' }}
                >
                  {fmt}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: '#4a6080' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => !isParsing && inputRef.current?.click()}
          disabled={isParsing}
          className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity duration-150 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #2d7dd2 0%, #1a5fa8 100%)',
            color: '#fff',
            border: 'none',
            opacity: isParsing ? 0.5 : 1,
          }}
        >
          {isParsing ? 'Parsing…' : 'Select File'}
        </button>
      </div>
    </div>
  );
}
