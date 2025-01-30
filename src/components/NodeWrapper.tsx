import { ReactNode } from 'react';

type NodeWrapperProps = {
  children: ReactNode;
  icon: ReactNode;
};

export const NodeWrapper = ({ children, icon }: NodeWrapperProps) => {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #DDDDDD',
        borderRadius: '8px',
        padding: '16px',
        minWidth: '250px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px'
        }}
      >
        {icon}
      </div>
      {children}
    </div>
  );
};