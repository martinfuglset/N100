import { ReactNode } from 'react';

type NodeWrapperProps = {
  children: ReactNode;
  icon: ReactNode;
  nodeType: string;
  dataSourceSelect?: ReactNode;
};

export const NodeWrapper = ({ children, icon, nodeType, dataSourceSelect }: NodeWrapperProps) => {
  return (
    <div
      className="node-wrapper"
      style={{
        background: 'white',
        border: '1px solid #DDDDDD',
        borderRadius: '8px',
        minWidth: '250px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: '#f3f4f6',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          borderBottom: '1px solid #DDDDDD'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon}
          <span style={{ color: '#4b5563', fontWeight: 500 }}>{nodeType}</span>
        </div>
        {dataSourceSelect && (
          <div style={{ marginLeft: 'auto' }}>
            {dataSourceSelect}
          </div>
        )}
      </div>
      <div style={{ padding: '16px' }}>
        {children}
      </div>
    </div>
  );
};