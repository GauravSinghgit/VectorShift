// ui.js
// ReactFlow canvas with auto-registered node types from nodeRegistry.
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { getNodeTypes, nodeConfigs } from './nodeRegistry';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: {
    stroke: '#4a5068',
    strokeWidth: 2,
  },
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setSelectedNodeId: state.setSelectedNodeId,
});

export const PipelineUI = () => {
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

  // Keyboard handler for delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input/textarea/select
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        // ReactFlow handles this natively if deleteKeyCode is set
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // MiniMap node color by category
  const minimapNodeColor = (node) => {
    const config = nodeConfigs[node.type];
    return config?.accentColor || '#6366f1';
  };

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
        proOptions={proOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
        deleteKeyCode={['Delete', 'Backspace']}
        fitView
      >
        <Background color="#2e3348" gap={gridSize} size={1} />
        <Controls />
        <MiniMap
          nodeColor={minimapNodeColor}
          maskColor="rgba(15, 17, 23, 0.7)"
          style={{ background: '#1a1d27' }}
        />
      </ReactFlow>
    </div>
  );
};
