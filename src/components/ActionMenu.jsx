import React from 'react';

const ActionMenu = ({ position, onAction, onClose }) => {
    const menuStyle = {
        position: 'absolute',
        left: position.x,
        top: position.y,
        backgroundColor: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        padding: '0.5rem',
        minWidth: '150px',
    };

    const itemStyle = {
        padding: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        color: 'var(--text-color)',
        border: 'none',
        background: 'none',
        textAlign: 'left',
        borderRadius: '4px',
    };

    return (
        <>
            <div
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
                onClick={onClose}
            />
            <div style={menuStyle}>
                <button style={itemStyle} onClick={() => onAction('add_parent')}>Add Parent</button>
                <button style={itemStyle} onClick={() => onAction('add_spouse')}>Add Spouse</button>
                <button style={itemStyle} onClick={() => onAction('add_child')}>Add Child</button>
                <button style={itemStyle} onClick={() => onAction('add_sibling')}>Add Sibling</button>
            </div>
        </>
    );
};

export default ActionMenu;
