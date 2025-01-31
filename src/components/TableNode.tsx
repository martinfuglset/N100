import { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { GoDatabase } from 'react-icons/go';
import { FaTable, FaGoogleDrive } from 'react-icons/fa';
import { BsInputCursorText } from 'react-icons/bs';
import { NodeWrapper } from './NodeWrapper';
import { DataSourceSelect } from './DataSourceSelect';

type TableData = {
  headers: string[];
  rows: string[][];
};

type TableNodeData = {
  tableData: TableData;
  onUpdate?: (data: TableData) => void;
};

const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>, onUpdate: ((data: TableData) => void) | undefined) => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0];
      const dataRows = rows.slice(1);
      onUpdate?.({ headers, rows: dataRows });
    };
    reader.readAsText(file);
  }
};

const TableNode = ({ data }: NodeProps<TableNodeData>) => {
  const { tableData } = data;
  const [selectedSource, setSelectedSource] = useState('manual');

  const addColumn = () => {
    const newHeader = `Column ${tableData.headers.length + 1}`;
    const newData = {
      headers: [...tableData.headers, newHeader],
      rows: tableData.rows.map(row => [...row, '']),
    };
    data.onUpdate?.(newData);
  };

  const addRow = () => {
    const newRow = new Array(tableData.headers.length).fill('');
    const newData = {
      ...tableData,
      rows: [...tableData.rows, newRow],
    };
    data.onUpdate?.(newData);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...tableData.rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = value;
    data.onUpdate?.({ ...tableData, rows: newRows });
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = tableData.headers.map((header, i) => i === index ? value : header);
    data.onUpdate?.({ ...tableData, headers: newHeaders });
  };

  const dataSourceSelect = (
    <DataSourceSelect
      selectedSource={selectedSource}
      onSourceChange={setSelectedSource}
      onDataUpdate={data.onUpdate}
    />
  );

  return (
    <NodeWrapper 
      icon={<GoDatabase size={20} color="#4b5563" />} 
      nodeType="Data"
      dataSourceSelect={dataSourceSelect}
    >
      <Handle type="source" position={Position.Right} style={{ background: '#DDDDDD', border: '1px solid #DDDDDD' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ overflowX: 'auto', marginBottom: '8px' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}>
            <thead>
              <tr>
                {tableData.headers.map((header, index) => (
                  <th key={index} style={{ 
                    borderBottom: '2px solid #e5e7eb',
                    padding: '8px',
                    background: '#f9fafb'
                  }}>
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => updateHeader(index, e.target.value)}
                      style={{ 
                        width: '100%', 
                        border: 'none', 
                        background: 'transparent',
                        padding: '4px', 
                        color: '#4b5563',
                        fontWeight: 500,
                        width: '100%'
                      }}
                    />
                  </th>
                ))}
                <th style={{ width: '40px', padding: 0, background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <button 
                    onClick={addColumn}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      padding: '8px 0',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} style={{ 
                      borderBottom: '1px solid #e5e7eb',
                      padding: '8px',
                      background: 'white'
                    }}>
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                        style={{ 
                          width: '100%', 
                          border: 'none', 
                          padding: '4px',
                          color: '#4b5563'
                        }}
                      />
                    </td>
                  ))}
                  {rowIndex === tableData.rows.length - 1 && (
                    <td style={{ 
                      width: '40px', 
                      padding: 0,
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <button 
                        onClick={addRow}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          padding: '8px 0',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        +
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </NodeWrapper>
  );
};

export default TableNode;