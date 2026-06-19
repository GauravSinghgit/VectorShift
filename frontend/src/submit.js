// submit.js
// Submit handler with toast notifications, loading state, and error handling.
// Used by TopBar — exports the hook, not a standalone component.
// ─────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { useStore } from './store';

export const useSubmitPipeline = (addToast) => {
  const [isLoading, setIsLoading] = useState(false);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const handleSubmit = useCallback(async () => {
    if (isLoading) return;

    // Validate: need at least one node
    if (nodes.length === 0) {
      addToast({
        type: 'warning',
        title: 'Empty Pipeline',
        message: 'Add at least one node to the canvas before running.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Server returned ${response.status}`);
      }

      const data = await response.json();
      const { num_nodes, num_edges, is_dag } = data;

      if (is_dag) {
        addToast({
          type: 'success',
          title: 'Valid Pipeline ✓',
          message: `${num_nodes} nodes · ${num_edges} edges · No cycles detected. This is a valid DAG.`,
          duration: 6000,
        });
      } else {
        addToast({
          type: 'error',
          title: 'Cycle Detected ✗',
          message: `${num_nodes} nodes · ${num_edges} edges · The pipeline contains a cycle and is not a valid DAG.`,
          duration: 8000,
        });
      }
    } catch (err) {
      console.error('Submit error', err);
      addToast({
        type: 'error',
        title: 'Connection Failed',
        message: err.message === 'Failed to fetch'
          ? 'Could not reach the backend at localhost:8000. Make sure the server is running.'
          : err.message,
        duration: 8000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [nodes, edges, isLoading, addToast]);

  return { handleSubmit, isLoading };
};
