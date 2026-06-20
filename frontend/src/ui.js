// ui.js
// ReactFlow canvas with auto-registered node types, custom deletable edge,
// and manual keyboard delete (fixes the textarea/backspace conflict).
// ─────────────────────────────────────────────────────────────

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap, getSmoothStepPath, EdgeLabelRenderer } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { getNodeTypes, nodeConfigs } from './nodeRegistry';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const defaultEdgeOptions = {
  type: 'deletableEdge',
  animated: true,
  style: {
    stroke: 'var(--color-border-hover)',
    strokeWidth: 2,
  },
};

// ── Custom Edge with delete button ─────────────────────────
const DeletableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}) => {
  const [hovered, setHovered] = useState(false);
  const deleteEdge = useStore((s) => s.deleteEdge);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // ONE handler for the whole edge group — no more racing listeners
  const handleEnter = () => setHovered(true);
  const handleLeave = () => setHovered(false);

  return (
    <>
      {/* Single group owns hover state for path + invisible hit area */}
      <g onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <path
          d={edgePath}
          fill="none"
          stroke="transparent"
          strokeWidth={20}
        />
        <path
          d={edgePath}
          fill="none"
          stroke={selected ? 'var(--color-primary)' : 'var(--color-border-hover)'}
          strokeWidth={selected ? 2.5 : 2}
          markerEnd={markerEnd}
          className="react-flow__edge-path"
          style={style}
        />
      </g>

      {/* Button is now OUTSIDE the hover group's mouseleave trigger zone logic —
          it stays visible because `hovered` only changes when leaving the <g>,
          and the button sits visually on top of the path, not beside it */}
      {(hovered || selected) && (
        <EdgeLabelRenderer>
          <button
            className="edge-delete-btn"
            style={{
            position: 'absolute',
            left: labelX,
            top: labelY,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'all',
           }}
            onClick={(e) => {
              e.stopPropagation();
              deleteEdge(id);
            }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            title="Delete edge"
          >
            ✕
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

const edgeTypes = {
  deletableEdge: DeletableEdge,
};

// ── Store selector ──────────────────────────────────────────
const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setSelectedNodeId: state.setSelectedNodeId,
  deleteNode: state.deleteNode,
  deleteEdge: state.deleteEdge,
});

export const PipelineUI = ({ theme }) => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
    deleteNode,
    deleteEdge,
  } = useStore(selector, shallow);

  // Build nodeTypes once from registry
  const nodeTypes = useMemo(() => getNodeTypes(), []);

  const getInitNodeData = (nodeID, type) => {
    return { id: nodeID, nodeType: type };
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Track node selection for config panel
  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  // ── Manual keyboard delete ────────────────────────────────
  // We do NOT set deleteKeyCode on ReactFlow. Instead we handle delete
  // ourselves, checking document.activeElement to avoid deleting nodes
  // when the user is typing in an input/textarea/select.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;

      // If user is focused on a text-entry element, don't delete nodes/edges
      const active = document.activeElement;
      if (active) {
        const tag = active.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        if (active.isContentEditable) return;
      }

      // Delete all selected nodes (which also removes their edges via deleteNode)
      const { nodes: currentNodes, edges: currentEdges } = useStore.getState();
      const selectedNodes = currentNodes.filter((n) => n.selected);
      const selectedEdges = currentEdges.filter((e) => e.selected);

      selectedNodes.forEach((n) => deleteNode(n.id));
      selectedEdges.forEach((e) => deleteEdge(e.id));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteNode, deleteEdge]);

  // MiniMap node color by category
  const minimapNodeColor = (node) => {
    const config = nodeConfigs[node.type];
    return config?.accentColor || '#6366f1';
  };

  // Theme-aware MiniMap colors (avoid hardcoded hex)
  const isDark = theme === 'dark';
  const minimapMaskColor = isDark ? 'rgba(15, 17, 23, 0.7)' : 'rgba(255, 255, 255, 0.7)';
  const minimapBg = isDark ? '#1a1d27' : '#f1f5f9';
  const bgDotColor = isDark ? '#2e3348' : '#cbd5e1';

  return (
    <div ref={reactFlowWrapper} className="canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        deleteKeyCode={null}
        fitView
      >
        <Background color={bgDotColor} gap={gridSize} size={1} />
        <Controls />
        <MiniMap
          nodeColor={minimapNodeColor}
          maskColor={minimapMaskColor}
          style={{ background: minimapBg }}
        />
      </ReactFlow>
    </div>
  );
};
