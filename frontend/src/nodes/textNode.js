// textNode.js
// Custom node with {{variable}} extraction, auto-resize (width + height),
// and syntax highlighting overlay.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NodeBase } from '../common/NodeBase';
import { useStore } from '../store';
import { textNodeConfig } from '../nodeRegistry';

/**
 * Parses {{var}} placeholders and returns a sorted array of unique variable names.
 */
const extractVariables = (text) => {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const vars = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return Array.from(vars).sort(); // sort for stable handle ordering
};

/**
 * Builds highlighted HTML: replaces {{var}} tokens with <span class="var-token">
 */
const buildHighlightedHTML = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g,
      '<span class="var-token">{{$1}}</span>'
    ) + '\n'; // trailing newline prevents height collapse
};

/**
 * Measures approximate text width using a canvas context.
 */
const measureTextWidth = (text, font) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  const lines = text.split('\n');
  let maxWidth = 0;
  lines.forEach((line) => {
    const w = ctx.measureText(line).width;
    if (w > maxWidth) maxWidth = w;
  });
  return maxWidth;
};

export const TextNode = ({ id, data, selected }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => extractVariables(data?.text || '{{input}}'));
  const [nodeWidth, setNodeWidth] = useState(220);
  const textareaRef = useRef(null);
  const updateNodeField = useStore((s) => s.updateNodeField);

  // Update variables whenever text changes
  useEffect(() => {
    setVariables(extractVariables(currText));
    updateNodeField(id, 'text', currText);
  }, [currText, id, updateNodeField]);

  const handleTextChange = useCallback((e) => {
    setCurrText(e.target.value);
  }, []);

  // Auto-resize textarea height + compute dynamic node width
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    // Measure text width and set node width (with bounds)
    const font = "11px 'JetBrains Mono', 'Fira Code', monospace";
    const textWidth = measureTextWidth(currText, font);
    const padding = 80; // account for padding + handles
    const handleWidth = variables.length * 10; // more vars = slightly wider
    const desired = Math.max(220, textWidth + padding + handleWidth);
    const clamped = Math.min(450, desired);
    setNodeWidth(clamped);
  }, [currText, variables.length]);

  // Build input handles for each variable
  const inputs = variables.map((v) => ({ id: v, label: v }));
  const outputs = [{ id: 'output', label: 'output' }];

  const highlightedHTML = buildHighlightedHTML(currText);

  return (
    <NodeBase
      id={id}
      data={data}
      title={textNodeConfig.title}
      icon={textNodeConfig.icon}
      accentColor={textNodeConfig.accentColor}
      status={data?.status || 'idle'}
      selected={selected}
      inputs={inputs}
      outputs={outputs}
      style={{
        width: `${nodeWidth}px`,
        transition: 'width 0.2s ease',
      }}
    >
      <div className="field-group">
        <div className="field-label">Text</div>
        <div className="text-node-editor">
          {/* Highlight overlay */}
          <div
            className="text-node-highlight-overlay"
            dangerouslySetInnerHTML={{ __html: highlightedHTML }}
          />
          {/* Actual textarea */}
          <textarea
            ref={textareaRef}
            className="field-textarea text-node-textarea"
            value={currText}
            onChange={handleTextChange}
          />
        </div>
      </div>
    </NodeBase>
  );
};
