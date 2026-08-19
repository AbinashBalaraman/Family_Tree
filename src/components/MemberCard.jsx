import React, { useState } from 'react';
import ActionMenu from './ActionMenu';

const MemberCard = ({ member, onEdit, onDelete, onAction, style }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuPos({ x: e.clientX, y: e.clientY });
        setShowMenu(true);
    };

    const handleAction = (action) => {
        onAction(action, member);
        setShowMenu(false);
    };

    const getAvatarColor = (gender) => {
        switch (gender) {
            case 'male': return '#bfdbfe'; // blue-200
            case 'female': return '#fbcfe8'; // pink-200
            default: return '#e2e8f0'; // slate-200
        }
    };

    return (
        <>
            <div
                className="member-card"
                onClick={handleContextMenu}
                style={{
                    ...style,
                    position: 'absolute',
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    border: `2px solid ${getAvatarColor(member.gender)}`,
                    width: '200px',
                    zIndex: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}
            >
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: getAvatarColor(member.gender),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                }}>
                    {member.gender === 'male' ? '👨' : member.gender === 'female' ? '👩' : '👤'}
                </div>

                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{member.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {member.birthDate || 'Unknown Date'}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(member); }}
                        style={{ fontSize: '0.75rem', color: 'var(--primary-color)', background: 'none', padding: 0 }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(member.id); }}
                        style={{ fontSize: '0.75rem', color: 'var(--danger-color)', background: 'none', padding: 0 }}
                    >
                        Del
                    </button>
                </div>
            </div>

            {showMenu && (
                <ActionMenu
                    position={menuPos}
                    onAction={handleAction}
                    onClose={() => setShowMenu(false)}
                />
            )}
        </>
    );
};

export default MemberCard;
