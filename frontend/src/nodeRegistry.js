// nodeRegistry.js
// Central registry: every node type is defined by a config object.
// ─────────────────────────────────────────────────────────────

import { DynamicNode } from './common/DynamicNode';
import { TextNode } from './nodes/textNode';

/**
 * Each config: { type, title, category, icon, accentColor, fields[], inputs[], outputs[] }
 * Field shape: { type: 'text'|'select'|'number'|'checkbox'|'textarea', key, label, options?, defaultValue }
 * Handle shape: { id: string (suffix — prefixed with nodeId at runtime), label: string }
 */
const configs = [
  // ── Input / Output ──────────────────────────
  {
    type: 'customInput',
    title: 'Input',
    category: 'input',
    icon: '📥',
    accentColor: '#3b82f6',
    fields: [
      { type: 'text', key: 'inputName', label: 'Name', defaultValue: '' },
      { type: 'select', key: 'inputType', label: 'Type', options: ['Text', 'File'], defaultValue: 'Text' },
    ],
    inputs: [],
    outputs: [{ id: 'value', label: 'value' }],
  },
  {
    type: 'customOutput',
    title: 'Output',
    category: 'output',
    icon: '📤',
    accentColor: '#8b5cf6',
    fields: [
      { type: 'text', key: 'outputName', label: 'Name', defaultValue: '' },
      { type: 'select', key: 'outputType', label: 'Type', options: ['Text', 'Image'], defaultValue: 'Text' },
    ],
    inputs: [{ id: 'value', label: 'value' }],
    outputs: [],
  },

  // ── LLM ─────────────────────────────────────
  {
    type: 'llm',
    title: 'LLM',
    category: 'llm',
    icon: '🤖',
    accentColor: '#10b981',
    fields: [
      { type: 'select', key: 'model', label: 'Model', options: ['GPT-4', 'GPT-3.5', 'Claude', 'Gemini'], defaultValue: 'GPT-4' },
      { type: 'number', key: 'temperature', label: 'Temperature', defaultValue: 0.7 },
      { type: 'number', key: 'maxTokens', label: 'Max Tokens', defaultValue: 1024 },
    ],
    inputs: [
      { id: 'system', label: 'system' },
      { id: 'prompt', label: 'prompt' },
    ],
    outputs: [{ id: 'response', label: 'response' }],
  },

  // ── Text (custom component — has {{variable}} logic) ────
  // Registered separately below — uses TextNode directly.

  // ── 5 NEW NODE TYPES ────────────────────────

  // 1. Math / Calculator
  {
    type: 'math',
    title: 'Math',
    category: 'transform',
    icon: '🧮',
    accentColor: '#f59e0b',
    fields: [
      { type: 'select', key: 'operation', label: 'Operation', options: ['Add', 'Subtract', 'Multiply', 'Divide', 'Modulo', 'Power'], defaultValue: 'Add' },
    ],
    inputs: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ],
    outputs: [{ id: 'result', label: 'Result' }],
  },

  // 2. Filter / Conditional
  {
    type: 'filter',
    title: 'Filter',
    category: 'transform',
    icon: '🔀',
    accentColor: '#f59e0b',
    fields: [
      { type: 'select', key: 'condition', label: 'Condition', options: ['Equals', 'Not Equals', 'Greater Than', 'Less Than', 'Contains'], defaultValue: 'Equals' },
      { type: 'text', key: 'value', label: 'Compare Value', defaultValue: '' },
    ],
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [
      { id: 'passed', label: 'Passed' },
      { id: 'rejected', label: 'Rejected' },
    ],
  },

  // 3. API Request
  {
    type: 'apiRequest',
    title: 'API Request',
    category: 'action',
    icon: '🌐',
    accentColor: '#ef4444',
    fields: [
      { type: 'select', key: 'method', label: 'Method', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], defaultValue: 'GET' },
      { type: 'text', key: 'url', label: 'URL', defaultValue: 'https://api.example.com' },
      { type: 'textarea', key: 'headers', label: 'Headers (JSON)', defaultValue: '{\n  "Content-Type": "application/json"\n}' },
    ],
    inputs: [{ id: 'body', label: 'Body' }],
    outputs: [{ id: 'response', label: 'Response' }],
  },

  // 4. Timer / Delay
  {
    type: 'timer',
    title: 'Timer',
    category: 'action',
    icon: '⏱️',
    accentColor: '#ef4444',
    fields: [
      { type: 'number', key: 'delay', label: 'Delay (ms)', defaultValue: 1000 },
      { type: 'checkbox', key: 'repeat', label: 'Repeat', defaultValue: false },
    ],
    inputs: [{ id: 'trigger', label: 'Trigger' }],
    outputs: [{ id: 'done', label: 'Done' }],
  },

  // 5. Database Query
  {
    type: 'dbQuery',
    title: 'DB Query',
    category: 'action',
    icon: '🗄️',
    accentColor: '#ef4444',
    fields: [
      { type: 'select', key: 'database', label: 'Database', options: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite'], defaultValue: 'PostgreSQL' },
      { type: 'textarea', key: 'query', label: 'Query', defaultValue: 'SELECT * FROM table' },
    ],
    inputs: [{ id: 'params', label: 'Params' }],
    outputs: [{ id: 'rows', label: 'Rows' }],
  },
];

// Build the config map: type → config
export const nodeConfigs = {};
configs.forEach((c) => {
  nodeConfigs[c.type] = c;
});

// Text node — custom component, still registered in the map for metadata
export const textNodeConfig = {
  type: 'text',
  title: 'Text',
  category: 'text',
  icon: '📝',
  accentColor: '#06b6d4',
  fields: [],         // handled internally by TextNode
  inputs: [],         // dynamic — generated from {{var}}
  outputs: [{ id: 'output', label: 'output' }],
};
nodeConfigs['text'] = textNodeConfig;

// Group by category for sidebar
export const nodeCategories = {};
Object.values(nodeConfigs).forEach((c) => {
  if (!nodeCategories[c.category]) {
    nodeCategories[c.category] = [];
  }
  nodeCategories[c.category].push(c);
});

// Category display metadata
export const categoryMeta = {
  input:     { label: 'Input',     color: '#3b82f6' },
  output:    { label: 'Output',    color: '#8b5cf6' },
  llm:       { label: 'LLM',      color: '#10b981' },
  text:      { label: 'Text',      color: '#06b6d4' },
  transform: { label: 'Transform', color: '#f59e0b' },
  action:    { label: 'Action',    color: '#ef4444' },
};

// Build ReactFlow nodeTypes map
// Config-driven nodes use DynamicNode; text uses its custom component.
export const getNodeTypes = () => {
  const types = {};

  // All config-driven nodes (everything except 'text')
  configs.forEach((config) => {
    types[config.type] = (props) => <DynamicNode {...props} config={config} />;
  });

  // Text node — custom component
  types['text'] = TextNode;

  return types;
};
