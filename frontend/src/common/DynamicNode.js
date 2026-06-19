// DynamicNode.js
// Generic config-driven node component.
// Reads fields from a config object and renders via FieldRenderer.
// ─────────────────────────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import { NodeBase } from './NodeBase';
import { FieldRenderer } from './FieldRenderer';
import { useStore } from '../store';

/**
 * Props (from ReactFlow + nodeRegistry wrapper):
 *  - id, data, selected     — from ReactFlow
 *  - config                 — from nodeRegistry: { type, title, icon, accentColor, fields, inputs, outputs }
 */
export const DynamicNode = ({ id, data, selected, config }) => {
  // Initialize local state from config defaults, merged with any existing data
  const initialValues = {};
  (config.fields || []).forEach((f) => {
    initialValues[f.key] = data?.[f.key] ?? f.defaultValue ?? '';
  });

  // For Input nodes: generate default name from ID
  if (config.type === 'customInput' && !data?.inputName) {
    initialValues.inputName = id.replace('customInput-', 'input_');
  }
  if (config.type === 'customOutput' && !data?.outputName) {
    initialValues.outputName = id.replace('customOutput-', 'output_');
  }

  const [values, setValues] = useState(initialValues);
  const updateNodeField = useStore((s) => s.updateNodeField);

  const handleFieldChange = useCallback((key, newValue) => {
    setValues((prev) => ({ ...prev, [key]: newValue }));
    updateNodeField(id, key, newValue);
  }, [id, updateNodeField]);

  // Build compact summary for when config panel is open
  const summaryParts = (config.fields || []).slice(0, 2).map((f) => {
    const v = values[f.key];
    if (v === undefined || v === '') return null;
    return `${f.label}: ${String(v).slice(0, 20)}`;
  }).filter(Boolean);

  const compactSummary = summaryParts.join(' · ') || config.title;

  return (
    <NodeBase
      id={id}
      data={data}
      title={config.title}
      icon={config.icon}
      accentColor={config.accentColor}
      status={data?.status || 'idle'}
      selected={selected}
      inputs={config.inputs}
      outputs={config.outputs}
    >
      {/* Render each field from the config */}
      {(config.fields || []).map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={(v) => handleFieldChange(field.key, v)}
          compact={true}
        />
      ))}

      {/* Fallback: if no fields, show a summary line */}
      {(!config.fields || config.fields.length === 0) && (
        <div className="node-compact-summary">{compactSummary}</div>
      )}
    </NodeBase>
  );
};
