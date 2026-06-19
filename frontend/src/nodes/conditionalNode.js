import React from 'react';
import { NodeBase, Field, TextInput } from '../common/NodeBase';

export const ConditionalNode = ({ id, data }) => {
  const [condition, setCondition] = React.useState(data?.condition || 'value > 0');

  const inputs = [{ id: `${id}-value`, label: 'value' }];
  const outputs = [
    { id: `${id}-true`, label: 'true', top: '34px' },
    { id: `${id}-false`, label: 'false', top: '56px' },
  ];

  return (
    <NodeBase id={id} title="Conditional" category="logic" icon="⑂" inputs={inputs} outputs={outputs}>
      <Field label="Condition">
        <TextInput value={condition} onChange={(e) => setCondition(e.target.value)} />
      </Field>
    </NodeBase>
  );
};