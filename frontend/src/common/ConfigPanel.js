// ConfigPanel.js
// Right-side configuration drawer — opens when a node is selected.
// Shows full-size form fields for the selected node's config.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store';
import { nodeConfigs } from '../nodeRegistry';
import { FieldRenderer } from './FieldRenderer';

export const ConfigPanel = () => {
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const nodes = useStore((s) => s.nodes);
  const setSelectedNodeId = useStore((s) => s.setSelectedNodeId);
  const updateNodeField = useStore((s) => s.updateNodeField);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const config = selectedNode ? nodeConfigs[selectedNode.type] : null;

  // Local field values for the panel form
  const [values, setValues] = useState({});

  // Sync local values when selected node changes
  useEffect(() => {
    if (selectedNode && config) {
      const v = {};
      (config.fields || []).forEach((f) => {
        v[f.key] = selectedNode.data?.[f.key] ?? f.defaultValue ?? '';
      });
      setValues(v);
    }
  }, [selectedNodeId, selectedNode, config]);

  const handleFieldChange = useCallback((key, newValue) => {
    setValues((prev) => ({ ...prev, [key]: newValue }));
    if (selectedNodeId) {
      updateNodeField(selectedNodeId, key, newValue);
    }
  }, [selectedNodeId, updateNodeField]);

  const handleClose = () => setSelectedNodeId(null);

  if (!selectedNode || !config || !config.fields || config.fields.length === 0) {
    return null;
  }

  return (
    <div className="config-panel">
      <div className="config-panel-header">
        <div className="config-panel-header-left">
          <span className="config-panel-icon">{config.icon}</span>
          <span className="config-panel-title">{config.title}</span>
        </div>
        <button className="config-panel-close" onClick={handleClose}>✕</button>
      </div>
      <div className="config-panel-body">
        <div className="config-panel-section">
          <div className="config-panel-section-title">Configuration</div>
          {config.fields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={(v) => handleFieldChange(field.key, v)}
              compact={false}
            />
          ))}
        </div>

        {/* Connection info */}
        <div className="config-panel-section">
          <div className="config-panel-section-title">Connections</div>
          {config.inputs.length > 0 && (
            <div className="field-group">
              <div className="field-label">Inputs</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                {config.inputs.map((h) => h.label).join(', ')}
              </div>
            </div>
          )}
          {config.outputs.length > 0 && (
            <div className="field-group">
              <div className="field-label">Outputs</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                {config.outputs.map((h) => h.label).join(', ')}
              </div>
            </div>
          )}
          {config.inputs.length === 0 && config.outputs.length === 0 && (
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-dim)' }}>
              No connections configured.
            </div>
          )}
        </div>

        {/* Node ID */}
        <div className="config-panel-section">
          <div className="config-panel-section-title">Info</div>
          <div className="field-group">
            <div className="field-label">Node ID</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
              {selectedNodeId}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
