import { Handle, Position, NodeProps } from 'reactflow';
import { FaTable } from 'react-icons/fa';

type TableData = {
  headers: string[];
  rows: string[][];
};

type TableNodeData = {
  tableData: TableData;
};

const TableNode = ({ data }: NodeProps<TableNodeData>) => {
  const { tableData } = data;

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

  return (
    <div className="table-node" style={{ background: 'white', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
      <Handle type="source" position={Position.Right} />
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <FaTable size={20} color="#666" />
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {tableData.headers.map((header, index) => (
                <th key={index} style={{ border: '1px solid #ccc', padding: '4px' }}>
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => updateHeader(index, e.target.value)}
                    style={{ width: '100%', border: 'none', padding: '2px', fontWeight: 'bold' }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} style={{ border: '1px solid #ccc', padding: '4px' }}>
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      style={{ width: '100%', border: 'none', padding: '2px' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={addRow} style={{ marginRight: '5px' }}>Add Row</button>
        <button onClick={addColumn}>Add Column</button>
      </div>
    </div>
  );
};

export default TableNode;