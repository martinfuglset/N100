import { Handle, Position, NodeProps } from 'reactflow';
import { VscGraphLine, VscGraphScatter } from 'react-icons/vsc';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { useMemo } from 'react';
import { NodeWrapper } from './NodeWrapper';
import { chartConfig } from '../config/chartConfig';
import { PlotNodeData } from '../types';

type CurveType = 'linear' | 'basis' | 'monotone';

interface ChartDataPoint {
  name: string;
  value: number;
}

interface LineStyleProps {
  type: CurveType;
  stroke: string;
  activeDot: { r: number };
  dot: boolean;
}

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

  const lineStyle: LineStyleProps = chartConfig.line.lineStyle as LineStyleProps;

  return (
    <NodeWrapper icon={<VscGraphLine size={20} color="#666" />} nodeType="Plot">
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
      <div style={chartConfig.container}>
        <ResponsiveContainer>
          {plotType === 'line' ? (
            <LineChart data={chartData} margin={chartConfig.line.margin}>
              <CartesianGrid strokeDasharray={chartConfig.line.gridDash} />
              <XAxis dataKey="name" tick={{ fontSize: 'inherit' }} />
              <YAxis tick={{ fontSize: 'inherit' }} />
              <Tooltip contentStyle={{ fontSize: 'inherit' }} />
              <Line {...lineStyle} dataKey="value" />
            </LineChart>
          ) : (
            <ScatterChart margin={chartConfig.scatter.margin}>
              <CartesianGrid strokeDasharray={chartConfig.scatter.gridDash} />
              <XAxis dataKey="name" type="category" tick={{ fontSize: 'inherit' }} />
              <YAxis dataKey="value" tick={{ fontSize: 'inherit' }} />
              <Tooltip contentStyle={{ fontSize: 'inherit' }} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={chartData} {...chartConfig.scatter.pointStyle} />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>
    </NodeWrapper>
  );
};

export default PlotNode;