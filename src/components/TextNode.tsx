import { NodeProps } from 'reactflow';

type TextNodeData = {
  text: string;
  onUpdate: (data: Partial<TextNodeData>) => void;
};

const TextNode = ({ data }: NodeProps<TextNodeData>) => {
  const { text = '', onUpdate } = data;

  return (
    <div style={{ background: 'transparent' }}>
      <textarea
        value={text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        style={{
          width: '100%',
          minHeight: '100px',
          padding: '8px',
          border: 'none',
          background: 'transparent',
          resize: 'both',
          fontFamily: 'inherit',
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#4b5563',
          outline: 'none'
        }}
        placeholder="Enter your text here..."
      />
    </div>
  );
};

export default TextNode;