import React from 'react';
import { NodeBase } from '../common/NodeBase';

const inputStyle = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  fontSize: '13px',
  outline: 'none',
  marginBottom: '8px',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
  marginBottom: 0,
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: 500,
  color: '#4a5568',
  marginBottom: '4px',
};

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = React.useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = React.useState(data?.inputType || 'Text');

  const handleNameChange = (e) => setCurrName(e.target.value);
  const handleTypeChange = (e) => setInputType(e.target.value);

  const inputs = [];
  const outputs = [{ id: `${id}-value`, label: 'value' }];

  return (
    <NodeBase id={id} title="Input" inputs={inputs} outputs={outputs}>
      <div>
        <div style={labelStyle}>Name:</div>
        <input style={inputStyle} value={currName} onChange={handleNameChange} />
        <div style={labelStyle}>Type:</div>
        <select style={selectStyle} value={inputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </NodeBase>
  );
};
