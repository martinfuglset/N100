import { BsInputCursorText } from 'react-icons/bs';
import { FaTable, FaGoogleDrive } from 'react-icons/fa';
import { TableData } from '../types';

type DataSourceSelectProps = {
  selectedSource: string;
  onSourceChange: (source: string) => void;
  onDataUpdate?: (data: TableData) => void;
};

export const DataSourceSelect = ({ selectedSource, onSourceChange, onDataUpdate }: DataSourceSelectProps) => {
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const dataRows = rows.slice(1);
        onDataUpdate?.({ headers, rows: dataRows });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <select 
        value={selectedSource}
        style={{ 
          padding: '4px 8px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          background: 'transparent',
          color: '#4b5563',
          fontFamily: 'inherit',
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          backgroundSize: '16px',
          paddingRight: '32px'
        }}
        onChange={(e) => onSourceChange(e.target.value)}
      >
        <option value="manual">Manual Entry</option>
        <option value="csv">CSV</option>
        <option value="sheets">Google Sheets</option>
      </select>
      
      {selectedSource === 'csv' && (
        <div
          style={{
            marginTop: '8px',
            padding: '16px',
            border: '2px dashed #e5e7eb',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#6b7280',
            cursor: 'pointer',
            background: 'transparent'
          }}
          onClick={() => document.getElementById('csvInput')?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const text = e.target?.result as string;
                const rows = text.split('\n').map(row => row.split(','));
                const headers = rows[0];
                const dataRows = rows.slice(1);
                onDataUpdate?.({ headers, rows: dataRows });
              };
              reader.readAsText(file);
            }
          }}
        >
          <input
            id="csvInput"
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleCSVUpload}
          />
          <FaTable size={24} style={{ margin: '0 auto 8px' }} />
          <div>Upload CSV by drag and drop or click to upload</div>
        </div>
      )}
      {selectedSource === 'sheets' && (
        <div style={{ marginTop: '8px' }}>
          <input
            type="text"
            placeholder="Paste Google Sheets URL"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              color: '#4b5563',
              background: 'transparent'
            }}
          />
        </div>
      )}
    </div>
  );
};