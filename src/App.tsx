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
import TextNode from './components/TextNode';
import { Toolbar } from './components/Toolbar';
import { CustomEdge } from './components/CustomEdge';
import 'reactflow/dist/style.css';
import { useFlowState } from './hooks/useFlowState';
import { ContextMenuState, TableData } from './types';
import { nodeStyles, toolbarStyles, flowStyles } from './styles/components';

const nodeTypes: NodeTypes = {
  tableNode: TableNode,
  plotNode: PlotNode,
  textNode: TextNode,
};

const initialTableData: TableData = {
  headers: ['Year', 'Annual Sales (M)'],
  rows: [
    ['2000', '120'],
    ['2001', '125'],
    ['2002', '135'],
    ['2003', '142'],
    ['2004', '148'],
    ['2005', '155'],
    ['2006', '162'],
    ['2007', '170'],
    ['2008', '165'],
    ['2009', '158'],
    ['2010', '175'],
    ['2011', '182'],
    ['2012', '190'],
    ['2013', '198'],
    ['2014', '205'],
    ['2015', '215'],
    ['2016', '225'],
    ['2017', '235'],
    ['2018', '245'],
    ['2019', '255'],
    ['2020', '245'],
    ['2021', '265'],
    ['2022', '285'],
    ['2023', '305'],
    ['2024', '325']
  ],
};

function App() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateTableData
  } = useFlowState();

  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const handleEdgeContextMenu = (x: number, y: number, id: string) => {
    setContextMenu({ x, y, id, type: 'edge' });
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
    default: (props: EdgeProps) => <CustomEdge {...props} onContextMenu={handleEdgeContextMenu} />,
  };

  const addNode = (type: 'tableNode' | 'plotNode' | 'textNode') => {
    const nodeId = `${nodes.length + 1}`;
    const baseNodeData = {
      id: nodeId,
      type,
      position: { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 100 },
    };
  
    const initialTableData: TableData = {
      headers: ['Column 1'],
      rows: [['']]
    };

    type NodeDataType = {
      tableNode: { tableData: TableData; onUpdate: (data: TableData) => void };
      plotNode: { tableData: TableData; plotType: string; onUpdate: (data: Partial<{ tableData: TableData; plotType: string }>) => void };
      textNode: { text: string; onUpdate: (data: Partial<{ text: string }>) => void };
    };

    const nodeData: NodeDataType = {
      tableNode: { 
        tableData: { ...initialTableData }, 
        onUpdate: (newData: TableData) => updateTableData(nodeId, newData) 
      },
      plotNode: { 
        tableData: { ...initialTableData }, 
        plotType: 'line', 
        onUpdate: (newData) => {
          setNodes(nds => nds.map(n => 
            n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n
          ));
        }
      },
      textNode: {
        text: '',
        onUpdate: (newData) => {
          setNodes(nds => nds.map(n => 
            n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n
          ));
        }
      }
    };
  
    const newNode = {
      ...baseNodeData,
      data: nodeData[type]
    };
  
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
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
        style={{ width: '100%', height: '100%' }}
        proOptions={{ hideAttribution: true }}
        panOnScroll={true}
        selectionOnDrag={true}
        panOnDrag={[1, 2]}
        selectNodesOnDrag={false}
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
      <Toolbar onAddNode={addNode} />
    </div>
  );
}

export default App;
