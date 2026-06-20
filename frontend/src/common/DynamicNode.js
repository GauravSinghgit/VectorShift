// DynamicNode.js
import React, { useCallback } from 'react';   // remove useState
import { NodeBase } from './NodeBase';
import { FieldRenderer } from './FieldRenderer';
import { useStore } from '../store';

export const DynamicNode = ({ id, data, selected, config }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);

  // Auto-populate defaults into store on first render if missing
  React.useEffect(() => {
    (config.fields || []).forEach((f) => {
      if (data?.[f.key] === undefined) {
        updateNodeField(id, f.key, f.defaultValue ?? '');
      }
    });
    if (config.type === 'customInput' && !data?.inputName) {
      updateNodeField(id, 'inputName', id.replace('customInput-', 'input_'));
    }
    if (config.type === 'customOutput' && !data?.outputName) {
      updateNodeField(id, 'outputName', id.replace('customOutput-', 'output_'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFieldChange = useCallback((key, newValue) => {
    updateNodeField(id, key, newValue);  // write directly to store
  }, [id, updateNodeField]);

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
      {(config.fields || []).map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={data?.[field.key] ?? field.defaultValue ?? ''}  // read from store via data prop
          onChange={(v) => handleFieldChange(field.key, v)}
          compact={true}
        />
      ))}
      {(!config.fields || config.fields.length === 0) && (
        <div className="node-compact-summary">{config.title}</div>
      )}
    </NodeBase>
  );
};