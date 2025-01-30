import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeProps,
  getBezierPath,
} from 'reactflow';
import TableNode from './components/TableNode';
import PlotNode from './components/PlotNode';
import { FaTable, FaChartLine } from 'react-icons/fa';
import 'reactflow/dist/style.css';

type TableData = {
  headers: string[];
  rows: string[][];
};

const nodeTypes: NodeTypes = {
  tableNode: TableNode,
  plotNode: PlotNode,
};

const initialTableData: TableData = {
  headers: ['Year', 'Annual Sales (M)'],
  rows: [
    ['2019', '150'],
    ['2020', '142'],
    ['2021', '168'],
    ['2022', '185'],
    ['2023', '210']
  ],
};

function App() {
  const [tableData, setTableData] = useState<TableData>(initialTableData);

  const updateTableData = (nodeId: string, newData: TableData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // Update the source node
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              tableData: newData,
            },
          };
          
          // Find all connected target nodes and update their data
          edges.forEach((edge) => {
            if (edge.source === nodeId) {
              const targetNode = nds.find((n) => n.id === edge.target);
              if (targetNode && targetNode.type === 'plotNode') {
                targetNode.data = {
                  ...targetNode.data,
                  tableData: newData,
                };
              }
            }
          });
          
          return updatedNode;
        }
        return node;
      })
    );
  };

  const initialNodes: Node[] = [
    { id: '1', type: 'tableNode', position: { x: 100, y: 100 }, data: { tableData: { ...initialTableData }, onUpdate: (newData: TableData) => updateTableData('1', newData) } },
    { 
      id: '2', 
      type: 'plotNode', 
      position: { x: 400, y: 100 }, 
      data: { 
        tableData: { ...initialTableData }
      } 
    },
  ];

  const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });

    const onEdgeClick = (evt: React.MouseEvent<SVGGElement, MouseEvent>, id: string) => {
      evt.stopPropagation();
      const edge = edges.find(e => e.id === id);
      if (edge) {
        const targetNode = nodes.find(n => n.id === edge.target);
        if (targetNode && targetNode.type === 'plotNode') {
          setNodes(nds => nds.map(node => {
            if (node.id === edge.target) {
              return {
                ...node,
                data: {
                  ...node.data,
                  tableData: { headers: [], rows: [] }
                }
              };
            }
            return node;
          }));
        }
      }
      setEdges((eds) => eds.filter((e) => e.id !== id));
    };

    return (
      <g onClick={(e) => onEdgeClick(e, id)} style={{ cursor: 'pointer' }}>
        <path
          id={id}
          className="react-flow__edge-path"
          d={edgePath}
          strokeWidth={2}
          stroke="#b1b1b7"
        />
      </g>
    );
  };

  const edgeTypes = {
    default: CustomEdge,
  };

  const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      // First add the edge
      setEdges((eds) => addEdge(connection, eds));
      
      // Then update the target node with the source node's data
      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);
      
      if (sourceNode && targetNode && targetNode.type === 'plotNode') {
        setNodes(nds => nds.map(node => {
          if (node.id === targetNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                tableData: sourceNode.data.tableData
              }
            };
          }
          return node;
        }));
      }
    },
    [setEdges, nodes, setNodes],
  );

  const addNode = (type: 'tableNode' | 'plotNode') => {
    const nodeId = `${nodes.length + 1}`;
    const newNode = {
      id: nodeId,
      type,
      position: { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 100 },
      data: type === 'tableNode' 
        ? { tableData: { ...initialTableData }, onUpdate: (newData: TableData) => updateTableData(nodeId, newData) }
        : { tableData: { ...initialTableData } }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
      </ReactFlow>
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '8px',
          borderRadius: '5px',
          display: 'flex',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <button
          onClick={() => addNode('tableNode')}
          title="Add Table"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            ':hover': {
              background: '#f0f0f0',
              transform: 'scale(1.05)'
            }
          }}
        >
          <FaTable size={20} />
        </button>
        <button
          onClick={() => addNode('plotNode')}
          title="Add Plot"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            ':hover': {
              background: '#f0f0f0',
              transform: 'scale(1.05)'
            }
          }}
        >
          <FaChartLine size={20} />
        </button>
      </div>
    </div>
  );
}

export default App;
