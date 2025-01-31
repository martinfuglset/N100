import { EdgeProps, getBezierPath } from 'reactflow';

type CustomEdgeProps = EdgeProps & {
  onContextMenu: (x: number, y: number, id: string) => void;
};

export const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, onContextMenu }: CustomEdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    curvature: 0.3
  });

  const handleContextMenu = (evt: React.MouseEvent<SVGGElement, MouseEvent>) => {
    evt.preventDefault();
    onContextMenu(evt.clientX, evt.clientY, id);
  };

  return (
    <g onContextMenu={handleContextMenu}>
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