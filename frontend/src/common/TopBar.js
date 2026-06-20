// TopBar.js
// Top toolbar bar with pipeline name, theme toggle, clear canvas,
// save indicator, and submit button.
// ─────────────────────────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import { useStore } from '../store';

export const TopBar = ({ onSubmit, isLoading, theme, toggleTheme }) => {
  const [pipelineName, setPipelineName] = useState('Untitled Pipeline');
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const clearCanvas = useStore((s) => s.clearCanvas);

  const handleClear = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) return;
    const confirmed = window.confirm(
      `Clear the entire canvas? This will remove ${nodes.length} node(s) and ${edges.length} edge(s).`
    );
    if (confirmed) {
      clearCanvas();
    }
  }, [nodes.length, edges.length, clearCanvas]);

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

      {/* Right side: theme + clear + stats + save + submit */}
      <div className="topbar-right">
        {/* Theme toggle */}
        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Clear canvas */}
        <button
          className="btn btn-ghost btn-icon"
          onClick={handleClear}
          title="Clear canvas"
          disabled={nodes.length === 0 && edges.length === 0}
        >
          🗑️
        </button>

        <div className="topbar-divider" />

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
