import { Handle, Position, NodeProps } from 'reactflow';
import { FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TableData = {
  headers: string[];
  rows: string[][];
};

type PlotNodeData = {
  tableData: TableData;
};

const PlotNode = ({ data }: NodeProps<PlotNodeData>) => {
  const { tableData } = data;

  // Ensure we have valid data before processing
  const chartData = tableData?.rows?.map((row: string[]) => ({
    x: row[0] || '',
    y: parseFloat(row[1]) || 0
  })).filter(data => data.x !== '' && !isNaN(data.y)) || [];

  return (
    <div className="plot-node" style={{ background: 'white', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '300px' }}>
      <Handle type="target" position={Position.Left} />
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <FaChartLine size={20} color="#666" />
      </div>
      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlotNode;