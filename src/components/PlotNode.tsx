import { Handle, Position, NodeProps } from 'reactflow';
import { VscGraphLine, VscGraphScatter } from 'react-icons/vsc';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { useMemo } from 'react';
import { NodeWrapper } from './NodeWrapper';

type TableData = {
  headers: string[];
  rows: string[][];
};

type PlotNodeData = {
  tableData: TableData;
  plotType: 'line' | 'scatter';
  onUpdate: (data: Partial<PlotNodeData>) => void;
};

const PlotNode = ({ data }: NodeProps<PlotNodeData>) => {
  const { tableData, plotType = 'line', onUpdate } = data;

  const chartData = useMemo(() => {
    if (!tableData?.rows || tableData.rows.length === 0) return [];
    return tableData.rows
      .map(row => ({
        name: row[0] || '',
        value: parseFloat(row[1] || '0')
      }))
      .filter(item => !isNaN(item.value));
  }, [tableData?.rows]);

  return (
    <NodeWrapper icon={<VscGraphLine size={20} color="#666" />}>
      <Handle type="target" position={Position.Left} style={{ background: '#DDDDDD', border: '1px solid #DDDDDD' }} />
      <div style={{ display: 'flex', gap: '5px', marginBottom: '16px' }}>
        <button
          onClick={() => onUpdate({ plotType: 'line' })}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: plotType === 'line' ? '2px solid #8884d8' : '1px solid #ccc',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <VscGraphLine size={16} />
        </button>
        <button
          onClick={() => onUpdate({ plotType: 'scatter' })}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: plotType === 'scatter' ? '2px solid #8884d8' : '1px solid #ccc',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <VscGraphScatter size={16} />
        </button>
      </div>
      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer>
          {plotType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                dot={false} 
              />
            </LineChart>
          ) : (
            <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" type="category" />
              <YAxis dataKey="value" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter 
                data={chartData} 
                fill="#8884d8"
                line={false}
              />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>
    </NodeWrapper>
  );
};

export default PlotNode;