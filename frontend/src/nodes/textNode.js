import React, { useState, useEffect, useRef } from 'react';
import { NodeBase } from '../common/NodeBase';

/**
 * Parses {{var}} placeholders and returns an array of handle ids.
 */
const extractVariables = (text) => {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const vars = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return Array.from(vars);
};

const textareaStyle = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  fontSize: '13px',
  outline: 'none',
  resize: 'none',
  overflow: 'hidden',
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  boxSizing: 'border-box',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: 500,
  color: '#4a5568',
  marginBottom: '4px',
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);

  // Update variables whenever text changes
  useEffect(() => {
    setVariables(extractVariables(currText));
  }, [currText]);

  const handleTextChange = (e) => setCurrText(e.target.value);

  // Auto-resize textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  // Build input handles for each variable on the left side
  const inputs = variables.map((v) => ({ id: `${id}-${v}`, label: v }));
  const outputs = [{ id: `${id}-output`, label: 'output' }];

  return (
    <NodeBase id={id} title="Text" inputs={inputs} outputs={outputs}>
      <div>
        <div style={labelStyle}>Text:</div>
        <textarea
          ref={textareaRef}
          style={textareaStyle}
          value={currText}
          onChange={handleTextChange}
        />
      </div>
    </NodeBase>
  );
};
