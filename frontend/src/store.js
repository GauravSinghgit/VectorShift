// store.js
// Zustand store for pipeline state.
// Contract: nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange,
//           onConnect, updateNodeField, selectedNodeId, setSelectedNodeId.
// Added:    deleteNode, deleteEdge, clearCanvas.
// ─────────────────────────────────────────────────────────────

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  selectedNodeId: null,

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'deletableEdge',
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
            height: '20px',
            width: '20px',
          },
        },
        get().edges
      ),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },

  setSelectedNodeId: (id) => {
    set({ selectedNodeId: id });
  },

  // ── NEW: Deletion actions ──────────────────────────────────

  /**
   * Remove a node by id AND all edges connected to it.
   */
  deleteNode: (nodeId) => {
    const { nodes, edges, selectedNodeId } = get();
    set({
      nodes: nodes.filter((n) => n.id !== nodeId),
      edges: edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: selectedNodeId === nodeId ? null : selectedNodeId,
    });
  },

  /**
   * Remove a single edge by id.
   */
  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((e) => e.id !== edgeId),
    });
  },

  /**
   * Clear the entire canvas (all nodes + edges).
   */
  clearCanvas: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
    });
  },
}));
