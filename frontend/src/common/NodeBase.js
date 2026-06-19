// NodeBase.js
// Shared visual shell for all nodes: accent bar, icon, title, status dot,
// dynamic handle positioning, and a children slot for body content.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { Handle, Position } from 'reactflow';

/**
 * Props:
 *  - id, data               — from ReactFlow
 *  - title                  — display title
 *  - icon                   — emoji string
 *  - accentColor            — left accent bar color
 *  - status                 — 'idle' | 'running' | 'success' | 'error'
 *  - selected               — boolean, from ReactFlow
 *  - inputs                 — [{ id, label, position? }]
 *  - outputs                — [{ id, label, position? }]
 *  - children               — body content
 *  - style                  — extra styles on container (e.g. dynamic width)
 */
export const NodeBase = ({
  id,
  data,
  title,
  icon = '',
  accentColor = '#6366f1',
  status = 'idle',
  selected = false,
  inputs = [],
  outputs = [],
  children,
  style = {},
}) => {
  const maxHandles = Math.max(inputs.length, outputs.length, 1);
  const headerHeight = 40;   // approximate px for header
  const bodyMinHeight = 40;  // minimum body space
  const handleSpacing = 24;  // px between handles
  const minNodeHeight = headerHeight + bodyMinHeight + maxHandles * handleSpacing;

  return (
    <div
      className={`node-card${selected ? ' selected' : ''}`}
      style={{
        minHeight: `${minNodeHeight}px`,
        ...style,
      }}
    >
      {/* Accent bar */}
      <div className="node-accent-bar" style={{ background: accentColor }} />

      {/* Header */}
      <div className="node-header">
        {icon && <span className="node-icon">{icon}</span>}
        <span className="node-title">{title}</span>
        <span className={`node-status-dot ${status}`} />
      </div>

      {/* Input handles */}
      {inputs.map((h, idx) => {
        const topPx = headerHeight + 20 + idx * handleSpacing;
        return (
          <React.Fragment key={`in-${h.id}`}>
            <Handle
              type="target"
              id={`${id}-${h.id}`}
              position={h.position ?? Position.Left}
              style={{
                background: accentColor,
                width: 10,
                height: 10,
                top: `${topPx}px`,
                border: '2px solid var(--color-surface)',
              }}
            />
            {h.label && (
              <div
                className="handle-label handle-label-left"
                style={{ top: `${topPx}px` }}
              >
                {h.label}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Body */}
      <div className="node-body">
        {children}
      </div>

      {/* Output handles */}
      {outputs.map((h, idx) => {
        const topPx = headerHeight + 20 + idx * handleSpacing;
        return (
          <React.Fragment key={`out-${h.id}`}>
            <Handle
              type="source"
              id={`${id}-${h.id}`}
              position={h.position ?? Position.Right}
              style={{
                background: '#10b981',
                width: 10,
                height: 10,
                top: `${topPx}px`,
                border: '2px solid var(--color-surface)',
              }}
            />
            {h.label && (
              <div
                className="handle-label handle-label-right"
                style={{ top: `${topPx}px` }}
              >
                {h.label}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
