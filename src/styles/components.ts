import { CSSProperties } from 'react';

export const nodeStyles = {
  button: {
    base: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    hover: {
      background: '#00F',
      color: 'white'
    }
  },
  input: {
    base: {
      width: '100%',
      border: 'none',
      padding: '4px',
      color: '#4b5563',
      background: 'transparent'
    },
    header: {
      fontWeight: '600',
      color: '#374151'
    }
  },
  table: {
    container: {
      overflowX: 'auto' as const,
      marginBottom: '8px'
    },
    table: {
      borderCollapse: 'separate' as const,
      borderSpacing: 0,
      width: '100%'
    },
    th: {
      borderBottom: '2px solid #e5e7eb',
      padding: '8px',
      background: '#f9fafb'
    },
    td: {
      borderBottom: '1px solid #e5e7eb',
      padding: '8px'
    }
  },
  plot: {
    container: {
      width: '100%',
      height: '200px'
    }
  }
};

export const toolbarStyles: CSSProperties = {
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'white',
  padding: '12px 16px',
  borderRadius: '12px',
  display: 'flex',
  gap: '12px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

export const flowStyles: CSSProperties = {
  width: '100vw',
  height: '100vh',
  position: 'relative',
  background: '#F5F5F5'
};