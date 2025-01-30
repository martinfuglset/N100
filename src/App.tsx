import { useCallback, useState, useEffect } from 'react';
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
import ContextMenu from './components/ContextMenu';
import { CiViewTable } from 'react-icons/ci';
import { VscGraphLine } from 'react-icons/vsc';
import TextNode from './components/TextNode';
import { TbTextResize } from 'react-icons/tb';
import 'reactflow/dist/style.css';
import { RoomProvider, useOthers, useUpdateMyPresence } from './liveblocks.config';

type TableData = {
  headers: string[];
  rows: string[][];
};

const nodeTypes: NodeTypes = {
  tableNode: TableNode,
  plotNode: PlotNode,
  textNode: TextNode,
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
  const [nodes, setNodes, onNodesChange] = useNodesState(
    JSON.parse(localStorage.getItem('flowNodes') || '[]')
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    JSON.parse(localStorage.getItem('flowEdges') || '[]')
  );
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string; type: 'node' | 'edge' } | null>(null);

  useEffect(() => {
    localStorage.setItem('flowNodes', JSON.stringify(nodes));
    localStorage.setItem('flowEdges', JSON.stringify(edges));
  }, [nodes, edges]);

  const updateTableData = (nodeId: string, newData: TableData) => {
    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              tableData: newData,
            },
          };
        }
        const connectedEdge = edges.find(e => e.source === nodeId && e.target === node.id);
        if (connectedEdge && node.type === 'plotNode') {
          return {
            ...node,
            data: {
              ...node.data,
              tableData: newData,
              plotType: node.data.plotType || 'line',
              onUpdate: (newData: any) => {
                setNodes(nds => nds.map(n => 
                  n.id === node.id ? { ...n, data: { ...n.data, ...newData } } : n
                ));
              }
            },
          };
        }
        return node;
      });
      return updatedNodes;
    });
  };

  const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      curvature: 0.3
    });

    const onEdgeContextMenu = (evt: React.MouseEvent<SVGGElement, MouseEvent>, id: string) => {
      evt.preventDefault();
      setContextMenu({ x: evt.clientX, y: evt.clientY, id, type: 'edge' });
    };

    return (
      <g onContextMenu={(e) => onEdgeContextMenu(e, id)}>
        <path
          id={id}
          className="react-flow__edge-path"
          d={edgePath}
          strokeWidth={1}
          stroke="#DDDDDD"
          strokeDasharray="none"
          style={{
            transition: 'stroke-width 0.2s, stroke 0.2s',
            animation: 'flowPathAnimation 1.5s linear infinite'
          }}
        />
      </g>
    );
  };

  const onNodeContextMenu = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, id: node.id, type: 'node' });
  };

  const handleDelete = () => {
    if (!contextMenu) return;

    if (contextMenu.type === 'edge') {
      setEdges((eds) => eds.filter((e) => e.id !== contextMenu.id));
    } else {
      setNodes((nds) => nds.filter((n) => n.id !== contextMenu.id));
      setEdges((eds) => eds.filter((e) => e.source !== contextMenu.id && e.target !== contextMenu.id));
    }
    setContextMenu(null);
  };

  const edgeTypes = {
    default: CustomEdge,
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(connection, eds);
        const sourceNode = nodes.find(n => n.id === connection.source);
        const targetNode = nodes.find(n => n.id === connection.target);

        if (sourceNode?.type === 'tableNode' && targetNode?.type === 'plotNode') {
          setNodes(nds => nds.map(node => {
            if (node.id === connection.target) {
              return {
                ...node,
                data: {
                  ...node.data,
                  tableData: sourceNode.data.tableData,
                  plotType: node.data.plotType || 'line',
                  onUpdate: (newData: any) => {
                    setNodes(ns => ns.map(n => 
                      n.id === node.id ? { ...n, data: { ...n.data, ...newData } } : n
                    ));
                  }
                }
              };
            }
            return node;
          }));
        }
        return newEdges;
      });
    },
    [nodes, setNodes]
  );

  const addNode = (type: 'tableNode' | 'plotNode' | 'textNode') => {
    const nodeId = `${nodes.length + 1}`;
    const newNode = {
      id: nodeId,
      type,
      position: { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 100 },
      data: type === 'tableNode' 
        ? { tableData: { ...initialTableData }, onUpdate: (newData: TableData) => updateTableData(nodeId, newData) }
        : type === 'plotNode'
        ? { 
            tableData: { ...initialTableData }, 
            plotType: 'line', 
            onUpdate: (newData: any) => {
              setNodes(nds => nds.map(n => 
                n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n
              ));
            }
          }
        : {
            text: '',
            onUpdate: (newData: any) => {
              setNodes(nds => nds.map(n => 
                n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n
              ));
            }
          }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      updateMyPresence({
        cursor: { x: e.clientX, y: e.clientY },
        username: 'user1'
      });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [updateMyPresence]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {others.map(({ presence }) => {
        if (!presence?.cursor) return null;
        return (
          <div key={presence.username} style={{ position: 'absolute', left: presence.cursor.x, top: presence.cursor.y, pointerEvents: 'none', transform: 'translate(-50%, -50%)' }}>
            <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '16px solid #4299e1', transform: 'rotate(45deg)' }} />
            <div style={{ position: 'absolute', fontSize: '12px', color: '#4299e1', transform: 'translate(8px, 8px)', fontWeight: 500 }}>
              {presence.username}
            </div>
          </div>
        );
      })}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        fitView
        style={{ background: '#f8f8f8' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        {nodes.length === 0 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#6b7280',
              fontSize: '1.2rem',
              fontWeight: 500,
              userSelect: 'none'
            }}
          >
            Place a node to get started
          </div>
        )}
      </ReactFlow>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={handleDelete}
          onClose={() => setContextMenu(null)}
        />
      )}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '12px 16px',
          borderRadius: '12px',
          display: 'flex',
          gap: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <button
          onClick={() => addNode('tableNode')}
          title="Add Table"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00F';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.color = '#4b5563';
          }}
        >
          <CiViewTable size={20} color="#4b5563" />
        </button>
        <button
          onClick={() => addNode('plotNode')}
          title="Add Plot"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00F';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.color = '#666';
          }}
        >
          <VscGraphLine size={20} color="#666" />
        </button>
        <button
          onClick={() => addNode('textNode')}
          title="Add Text"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00F';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.color = '#666';
          }}
        >
          <TbTextResize size={20} color="#666" />
        </button>
      </div>
    </div>
  );
}

export default function LiveblocksProvider() {
  return (
    <RoomProvider id="my-flow-app" initialPresence={{ cursor: null, username: 'user1' }}>
      <App />
    </RoomProvider>
  );
}
