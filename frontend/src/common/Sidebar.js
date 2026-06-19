// Sidebar.js
// Left sidebar node palette — grouped by category with search/filter.
// ─────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import { nodeCategories, categoryMeta } from '../nodeRegistry';
import { DraggableNode } from '../draggableNode';

const CATEGORY_ORDER = ['input', 'output', 'llm', 'text', 'transform', 'action'];

export const Sidebar = () => {
  const [search, setSearch] = useState('');

  // Filter nodes by search term
  const filteredCategories = useMemo(() => {
    const result = {};
    const q = search.toLowerCase().trim();

    CATEGORY_ORDER.forEach((cat) => {
      const items = nodeCategories[cat] || [];
      const filtered = q
        ? items.filter((c) => c.title.toLowerCase().includes(q) || cat.includes(q))
        : items;
      if (filtered.length > 0) {
        result[cat] = filtered;
      }
    });

    return result;
  }, [search]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Nodes</div>
        <input
          className="sidebar-search"
          type="text"
          placeholder="Search nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="sidebar-body">
        {Object.entries(filteredCategories).map(([cat, items]) => {
          const meta = categoryMeta[cat] || { label: cat, color: '#6366f1' };
          return (
            <div key={cat} className="sidebar-category">
              <div className="sidebar-category-title">
                <span
                  className="sidebar-category-dot"
                  style={{ background: meta.color }}
                />
                {meta.label}
              </div>
              {items.map((config) => (
                <DraggableNode
                  key={config.type}
                  type={config.type}
                  label={config.title}
                  icon={config.icon}
                  accentColor={config.accentColor}
                />
              ))}
            </div>
          );
        })}

        {Object.keys(filteredCategories).length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'var(--color-text-dim)',
            fontSize: 'var(--text-sm)',
            padding: 'var(--space-8) var(--space-4)',
          }}>
            No nodes match "{search}"
          </div>
        )}
      </div>
    </div>
  );
};
