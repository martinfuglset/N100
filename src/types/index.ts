import { Node, Edge } from 'reactflow';

export type TableData = {
  headers: string[];
  rows: string[][];
};

export type TableNodeData = {
  tableData: TableData;
  onUpdate?: (data: TableData) => void;
};

export type PlotNodeData = {
  tableData: TableData;
  plotType: 'line' | 'scatter';
  onUpdate: (data: Partial<PlotNodeData>) => void;
};

export type TextNodeData = {
  text: string;
  onUpdate: (data: Partial<TextNodeData>) => void;
};

export type NodeData = TableNodeData | PlotNodeData | TextNodeData;

export type FlowState = {
  nodes: Node<NodeData>[];
  edges: Edge[];
};

export type ContextMenuState = {
  x: number;
  y: number;
  id: string;
  type: 'node' | 'edge';
} | null;