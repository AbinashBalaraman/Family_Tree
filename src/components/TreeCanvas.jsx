import React, { useEffect, useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import MemberCard from './MemberCard';

const TreeCanvas = () => {
    const { members, relationships, removeMember } = useFamily();
    const [positions, setPositions] = useState({});

    // Simple auto-layout (naive)
    useEffect(() => {
        const newPositions = {};
        const levelHeight = 150;
        const siblingGap = 220;

        // Find roots (no parents)
        const childrenIds = new Set(relationships.filter(r => r.type === 'parent').map(r => r.to));
        const roots = members.filter(m => !childrenIds.has(m.id));

        let xOffset = 50;

        const processNode = (memberId, level, startX) => {
            if (newPositions[memberId]) return; // Already placed

            newPositions[memberId] = { x: startX, y: level * levelHeight + 50 };

            // Find children
            const children = relationships
                .filter(r => r.type === 'parent' && r.from === memberId)
                .map(r => r.to);

            let childX = startX;
            children.forEach((childId, index) => {
                processNode(childId, level + 1, childX + (index * siblingGap));
            });

            // Find spouses (place next to)
            const spouses = relationships
                .filter(r => r.type === 'spouse' && (r.from === memberId || r.to === memberId))
                .map(r => r.from === memberId ? r.to : r.from);

            spouses.forEach((spouseId, index) => {
                if (!newPositions[spouseId]) {
                    newPositions[spouseId] = { x: startX + 220, y: level * levelHeight + 50 };
                }
            });
        };

        roots.forEach((root, index) => {
            processNode(root.id, 0, xOffset + (index * 300));
        });

        // Handle disconnected or circular nodes gracefully by placing them if missing
        members.forEach((m, i) => {
            if (!newPositions[m.id]) {
                newPositions[m.id] = { x: 50 + (i * 220), y: 500 }; // Dump at bottom
            }
        });

        setPositions(newPositions);
    }, [members, relationships]);

    return (
        <div style={{
            flex: 1,
            position: 'relative',
            overflow: 'auto',
            backgroundColor: '#f0f4f8',
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '20px 20px'
        }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '2000px', height: '2000px', pointerEvents: 'none' }}>
                {relationships.map(rel => {
                    const start = positions[rel.from];
                    const end = positions[rel.to];
                    if (!start || !end) return null;

                    return (
                        <line
                            key={rel.id}
                            x1={start.x + 100} // Center of card (width 200)
                            y1={start.y + 50}  // Center-ish
                            x2={end.x + 100}
                            y2={end.y + 50}
                            stroke={rel.type === 'parent' ? '#64748b' : '#ec4899'}
                            strokeWidth="2"
                            strokeDasharray={rel.type === 'spouse' ? '5,5' : '0'}
                        />
                    );
                })}
            </svg>

            {members.map(member => (
                positions[member.id] && (
                    <MemberCard
                        key={member.id}
                        member={member}
                        onDelete={removeMember}
                        onEdit={(m) => console.log('Edit', m)}
                        style={{
                            left: positions[member.id].x,
                            top: positions[member.id].y
                        }}
                    />
                )
            ))}
        </div>
    );
};

export default TreeCanvas;
