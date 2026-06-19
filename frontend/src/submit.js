import React from 'react';
import { useStore } from './store';

const buttonStyle = {
  padding: '10px 32px',
  backgroundColor: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

export const SubmitButton = () => {
  const { nodes, edges } = useStore((state) => ({ nodes: state.nodes, edges: state.edges }));

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await response.json();
      const { num_nodes, num_edges, is_dag } = data;
      alert(`Pipeline Stats:\nNodes: ${num_nodes}\nEdges: ${num_edges}\nIs DAG: ${is_dag}`);
    } catch (err) {
      console.error('Submit error', err);
      alert('Failed to submit pipeline');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <button
        style={buttonStyle}
        onClick={handleSubmit}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#4f46e5')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#6366f1')}
      >
        Submit
      </button>
    </div>
  );
};
