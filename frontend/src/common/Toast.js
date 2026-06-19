// Toast.js
// Reusable toast notification component with auto-dismiss.
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from 'react';

const ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

/**
 * Single toast item
 */
const ToastItem = ({ toast, onRemove }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 250);
    }, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 250);
  };

  return (
    <div className={`toast ${toast.type} ${exiting ? 'toast-exiting' : ''}`}>
      <span className="toast-icon">{ICONS[toast.type] || ICONS.info}</span>
      <div className="toast-body">
        <div className="toast-title">{toast.title}</div>
        {toast.message && <div className="toast-message">{toast.message}</div>}
      </div>
      <button className="toast-close" onClick={handleClose}>✕</button>
    </div>
  );
};

/**
 * Toast container — manages a list of toasts.
 * Usage: const { addToast, ToastContainer } = useToast();
 */
let toastIdCounter = 0;
let globalAddToast = null;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Store globally so submit.js can access
  useEffect(() => {
    globalAddToast = addToast;
    return () => { globalAddToast = null; };
  }, [addToast]);

  const ToastContainer = () => (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );

  return { addToast, ToastContainer };
};

// Global accessor for addToast (used by submit.js)
export const getGlobalAddToast = () => globalAddToast;
