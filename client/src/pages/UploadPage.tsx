import UploadCard from '../components/upload/UploadCard';
import DataPreview from '../components/upload/DataPreview';
import type { ParsedDataset } from '../types/dashboard';

interface UploadPageProps {
  dataset: ParsedDataset | null;
  onDataParsed: (dataset: ParsedDataset) => void;
  onClearDataset: () => void;
}

export default function UploadPage({ dataset, onDataParsed, onClearDataset }: UploadPageProps) {
  return (
    <div className="p-6 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {!dataset ? (
        <div className="max-w-2xl w-full mx-auto">
          <UploadCard onDataParsed={onDataParsed} />
        </div>
      ) : (
        <>
          <DataPreview dataset={dataset} onClear={onClearDataset} />
          <div className="max-w-2xl w-full mx-auto">
            <UploadCard onDataParsed={onDataParsed} />
          </div>
        </>
      )}
    </div>
  );
}
