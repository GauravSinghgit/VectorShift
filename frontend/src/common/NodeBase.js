import React from 'react';
import { Handle, Position } from 'reactflow';

/**
 * Reusable base component for all node types.
 * Uses plain inline styles — no Chakra UI dependency.
 */
export const NodeBase = ({ id, data, title, inputs = [], outputs = [], children }) => {
  const containerStyle = {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: '#ffffff',
    padding: '12px',
    minWidth: '220px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  };

  const titleStyle = {
    fontWeight: 600,
    fontSize: '13px',
    textAlign: 'center',
    marginBottom: '10px',
    color: '#1a202c',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const handleLabelStyle = {
    fontSize: '10px',
    color: '#718096',
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>{title}</div>

      {/* Input handles */}
      {inputs.map((h, idx) => (
        <Handle
          key={h.id}
          type="target"
          id={h.id}
          position={h.position ?? Position.Left}
          style={{
            background: '#6366f1',
            width: 10,
            height: 10,
            top: `${30 + idx * 24}%`,
          }}
        />
      ))}

      {/* Body content */}
      <div>{children}</div>

      {/* Output handles */}
      {outputs.map((h, idx) => (
        <Handle
          key={h.id}
          type="source"
          id={h.id}
          position={h.position ?? Position.Right}
          style={{
            background: '#10b981',
            width: 10,
            height: 10,
            top: `${30 + idx * 24}%`,
          }}
        />
      ))}
    </div>
  );
};
