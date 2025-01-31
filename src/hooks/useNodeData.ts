import { useCallback } from 'react';
import { Node } from 'reactflow';
import { NodeData } from '../types';

type UseNodeDataParams = {
  nodeId: string;
  setNodes: (updater: (nodes: Node[]) => Node[]) => void;
};

export const useNodeData = ({ nodeId, setNodes }: UseNodeDataParams) => {
  const updateNodeData = useCallback(
    (newData: Partial<NodeData>) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
        )
      );
    },
    [nodeId, setNodes]
  );

  return { updateNodeData };
};