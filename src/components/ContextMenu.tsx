import React from 'react';

type ContextMenuProps = {
  x: number;
  y: number;
  onDelete: () => void;
  onClose: () => void;
};

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onDelete, onClose }) => {
  React.useEffect(() => {
    const handleClickOutside = () => {
      onClose();
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: y,
        left: x,
        background: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        borderRadius: '4px',
        padding: '4px 0',
        zIndex: 1000,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
          onClose();
        }}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px 16px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          ':hover': {
            background: '#f0f0f0'
          }
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default ContextMenu;