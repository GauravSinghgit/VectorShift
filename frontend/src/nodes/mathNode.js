import React from 'react';
import { NodeBase, Field, SelectInput } from '../common/NodeBase';

export const MathNode = ({ id, data }) => {
  const [operation, setOperation] = React.useState(data?.operation || 'Add');

  const inputs = [
    { id: `${id}-a`, label: 'a', top: '34px' },
    { id: `${id}-b`, label: 'b', top: '56px' },
  ];
  const outputs = [{ id: `${id}-result`, label: 'result' }];

  return (
    <NodeBase id={id} title="Math" category="logic" icon="∑" inputs={inputs} outputs={outputs}>
      <Field label="Operation">
        <SelectInput value={operation} onChange={(e) => setOperation(e.target.value)}>
          <option value="Add">Add</option>
          <option value="Subtract">Subtract</option>
          <option value="Multiply">Multiply</option>
          <option value="Divide">Divide</option>
        </SelectInput>
      </Field>
    </NodeBase>
  );
};