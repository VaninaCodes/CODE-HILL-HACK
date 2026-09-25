import React from 'react';

export const Badge = ({ text, onRemove }) => {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '16px',
      backgroundColor: 'var(--accent-bg)',
      color: 'var(--accent)',
      border: '1px solid var(--accent-border)',
      fontSize: '0.85rem',
      fontWeight: '500',
      margin: '2px'
    }}>
      #{text}
      {onRemove && (
        <button 
          type="button"
          onClick={onRemove} 
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: 'var(--accent)',
            padding: '0 2px'
          }}
        >
          
        </button>
      )}
    </span>
  );
};