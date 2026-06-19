// draggableNode.js
// Sidebar-friendly draggable node item with icon and accent color.
// ─────────────────────────────────────────────────────────────

export const DraggableNode = ({ type, label, icon, accentColor }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      <span className="sidebar-node-icon">{icon || '⬜'}</span>
      <span>{label}</span>
    </div>
  );
};