import { useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, Connection, addEdge } from 'reactflow';
import { FlowState, TableData, NodeData, PlotNodeData, TableNodeData } from '../types';

export const useFlowState = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    JSON.parse(localStorage.getItem('flowNodes') || '[]')
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    JSON.parse(localStorage.getItem('flowEdges') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('flowNodes', JSON.stringify(nodes));
    localStorage.setItem('flowEdges', JSON.stringify(edges));
  }, [nodes, edges]);

  const updateTableData = useCallback((nodeId: string, newData: TableData) => {
    setNodes((nds) => {
      return nds.map((node) => {
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
              plotType: (node.data as PlotNodeData).plotType || 'line',
              onUpdate: (newData: Partial<PlotNodeData>) => {
                setNodes(nds => nds.map(n => 
                  n.id === node.id ? { ...n, data: { ...n.data, ...newData } } : n
                ));
              }
            },
          };
        }
        return node;
      });
    });
  }, [edges, setNodes]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(connection, eds);
        const sourceNode = nodes.find(n => n.id === connection.source);
        const targetNode = nodes.find(n => n.id === connection.target);

        if (sourceNode?.type === 'tableNode' && targetNode?.type === 'plotNode') {
          const sourceData = (sourceNode.data as TableNodeData).tableData;
          setNodes(nds => nds.map(node => {
            if (node.id === connection.target) {
              return {
                ...node,
                data: {
                  ...node.data,
                  tableData: sourceData,
                  plotType: (node.data as PlotNodeData).plotType || 'line',
                  onUpdate: (newData: Partial<PlotNodeData>) => {
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

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateTableData,
  };
};