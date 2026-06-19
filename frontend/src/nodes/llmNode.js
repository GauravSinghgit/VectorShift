// llmNode.js

import React from 'react';
import { NodeBase } from '../common/NodeBase';

export const LLMNode = ({ id, data }) => {
  const inputs = [
    { id: `${id}-system`, label: 'system' },
    { id: `${id}-prompt`, label: 'prompt' }
  ];
  const outputs = [{ id: `${id}-response`, label: 'response' }];

  return (
    <NodeBase id={id} title="LLM" inputs={inputs} outputs={outputs}>
      <div>
        <div style={{ fontSize: '13px', color: '#1a202c' }}>LLM Node</div>
        <div style={{ fontSize: '11px', color: '#718096' }}>This is a LLM.</div>
      </div>
    </NodeBase>
  );
};
