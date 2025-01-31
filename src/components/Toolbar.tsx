import { CiViewTable } from 'react-icons/ci';
import { VscGraphLine } from 'react-icons/vsc';
import { TbTextResize } from 'react-icons/tb';
import { nodeStyles } from '../styles/components';

type ToolbarProps = {
  onAddNode: (type: 'tableNode' | 'plotNode' | 'textNode') => void;
};

export const Toolbar = ({ onAddNode }: ToolbarProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '24px',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '1px solid #DDDDDD'
      }}
    >
      <button
        onClick={() => onAddNode('tableNode')}
        title="Add Table"
        style={nodeStyles.button.base}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = nodeStyles.button.hover.background;
          const svg = e.currentTarget.querySelector('svg');
          if (svg) svg.style.color = nodeStyles.button.hover.color;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = nodeStyles.button.base.background;
          const svg = e.currentTarget.querySelector('svg');
          if (svg) svg.style.color = '#4b5563';
        }}
      >
        <CiViewTable size={20} color="#4b5563" />
      </button>
      <button
        onClick={() => onAddNode('plotNode')}
        title="Add Plot"
        style={nodeStyles.button.base}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = nodeStyles.button.hover.background;
          const svg = e.currentTarget.querySelector('svg');
          if (svg) svg.style.color = nodeStyles.button.hover.color;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = nodeStyles.button.base.background;
          const svg = e.currentTarget.querySelector('svg');
          if (svg) svg.style.color = '#666';
        }}
      >
        <VscGraphLine size={20} color="#666" />
      </button>
      <button
        onClick={() => onAddNode('textNode')}
        title="Add Text"
        style={nodeStyles.button.base}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = nodeStyles.button.hover.background;
          const svg = e.currentTarget.querySelector('svg');
          if (svg) svg.style.color = nodeStyles.button.hover.color;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = nodeStyles.button.base.background;
          const svg = e.currentTarget.querySelector('svg');
          if (svg) svg.style.color = '#666';
        }}
      >
        <TbTextResize size={20} color="#666" />
      </button>
    </div>
  );
};