// FieldRenderer.js
// Renders a single form field from a declarative config object.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';

/**
 * Props:
 *  - field: { type, key, label, options?, defaultValue }
 *  - value: current value
 *  - onChange: (newValue) => void
 *  - compact: boolean — if true, render a compact inline version (for on-node)
 */
export const FieldRenderer = ({ field, value, onChange, compact = false }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (field.type === 'textarea' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, field.type]);

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            className="field-input"
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || ''}
          />
        );

      case 'number':
        return (
          <input
            className="field-number"
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            step={field.step || 'any'}
          />
        );

      case 'select':
        return (
          <select
            className="field-select"
            value={value ?? field.defaultValue}
            onChange={(e) => onChange(e.target.value)}
          >
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            ref={textareaRef}
            className="field-textarea"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            rows={compact ? 2 : 4}
          />
        );

      case 'checkbox':
        return (
          <div className="field-checkbox-wrapper" onClick={() => onChange(!value)}>
            <div className={`field-checkbox ${value ? 'checked' : ''}`}>
              <div className="field-checkbox-knob" />
            </div>
            <span className="field-checkbox-label">{value ? 'On' : 'Off'}</span>
          </div>
        );

      default:
        return (
          <input
            className="field-input"
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="field-group">
      {field.type !== 'checkbox' && (
        <div className="field-label">{field.label}</div>
      )}
      {renderField()}
    </div>
  );
};
