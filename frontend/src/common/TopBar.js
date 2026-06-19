// TopBar.js
// Top toolbar bar with pipeline name, save indicator, and submit button.
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { useStore } from '../store';

export const TopBar = ({ onSubmit, isLoading }) => {
  const [pipelineName, setPipelineName] = useState('Untitled Pipeline');
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  return (
    <div className="topbar">
      {/* Left side: brand + pipeline name */}
      <div className="topbar-left">
        <div className="topbar-brand">
          <span className="topbar-brand-icon">⚡</span>
          <span>VectorShift</span>
        </div>
        <div className="topbar-divider" />
        <input
          className="topbar-pipeline-name"
          value={pipelineName}
          onChange={(e) => setPipelineName(e.target.value)}
          spellCheck={false}
        />
      </div>

      {/* Right side: stats + save + submit */}
      <div className="topbar-right">
        <div className="topbar-save-indicator">
          <span style={{ color: 'var(--color-success)' }}>●</span>
          <span>Saved</span>
        </div>
        <div className="topbar-divider" />
        <span style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          {nodes.length} nodes · {edges.length} edges
        </span>
        <div className="topbar-divider" />
        <button
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              Analyzing...
            </>
          ) : (
            <>
              ▶ Run Pipeline
            </>
          )}
        </button>
      </div>
    </div>
  );
};
