// src/components/shared/PopupModal.jsx
import React, { useEffect } from 'react';
import { SFX } from '../../utils/audio.js';

export default function PopupModal({
  isOpen,
  onClose,
  title,
  type = 'info', // 'info' | 'hint' | 'success' | 'error' | 'badge' | 'exit'
  icon = '💡',
  children,
  confirmText = 'Got It!',
  cancelText = null,
  onConfirm = null,
}) {
  useEffect(() => {
    if (isOpen) {
      if (type === 'success' || type === 'badge') SFX.badge();
      else if (type === 'error') SFX.wrong();
      else SFX.click();
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    SFX.click();
    if (onConfirm) onConfirm();
    else onClose();
  };

  const handleCancel = () => {
    SFX.click();
    onClose();
  };

  // Type color mappings
  const getHeaderColor = () => {
    switch (type) {
      case 'success': return '#4caf50';
      case 'error': return '#ef5350';
      case 'hint': return '#ffc107';
      case 'badge': return '#9c27b0';
      case 'exit': return '#ff7043';
      default: return '#5c7cfa';
    }
  };

  return (
    <div className="popup-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose} aria-label="Close modal">
          ✖
        </button>

        <div className="popup-header" style={{ color: getHeaderColor() }}>
          <span className="popup-icon">{icon}</span>
          <h3 className="popup-title">{title}</h3>
        </div>

        <div className="popup-body">
          {children}
        </div>

        <div className="popup-footer">
          {cancelText && (
            <button className="btn btn-secondary" onClick={handleCancel}>
              {cancelText}
            </button>
          )}
          <button
            className={`btn ${type === 'success' ? 'btn-success' : type === 'error' ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
            style={{ borderRadius: '12px', padding: '10px 24px', fontWeight: 'bold' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
