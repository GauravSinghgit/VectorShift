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

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = React.useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = React.useState(data?.outputType || 'Text');

  const handleNameChange = (e) => setCurrName(e.target.value);
  const handleTypeChange = (e) => setOutputType(e.target.value);

  const inputs = [{ id: `${id}-value`, label: 'value' }];
  const outputs = [];

  return (
    <NodeBase id={id} title="Output" inputs={inputs} outputs={outputs}>
      <div>
        <div style={labelStyle}>Name:</div>
        <input style={inputStyle} value={currName} onChange={handleNameChange} />
        <div style={labelStyle}>Type:</div>
        <select style={selectStyle} value={outputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </NodeBase>
  );
};
