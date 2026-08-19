import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';

const Sidebar = () => {
    const { addMember, members, addRelationship } = useFamily();
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('male');

    // Relationship form state
    const [relFrom, setRelFrom] = useState('');
    const [relTo, setRelTo] = useState('');
    const [relType, setRelType] = useState('parent');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return;
        addMember({ name, birthDate, gender });
        setName('');
        setBirthDate('');
    };

    const handleAddRel = (e) => {
        e.preventDefault();
        if (!relFrom || !relTo || !relType) return;
        addRelationship(relFrom, relTo, relType);
        setRelFrom('');
        setRelTo('');
    };

    return (
        <div style={{
            width: '300px',
            backgroundColor: 'white',
            borderRight: '1px solid var(--border-color)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            overflowY: 'auto'
        }}>
            <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Member</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    />
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    />
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <button
                        type="submit"
                        style={{
                            padding: '0.5rem',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)'
                        }}
                    >
                        Add Member
                    </button>
                </form>
            </div>

            <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Relationship</h2>
                <form onSubmit={handleAddRel} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <select
                        value={relFrom}
                        onChange={(e) => setRelFrom(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    >
                        <option value="">Select Person 1</option>
                        {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>

                    <select
                        value={relType}
                        onChange={(e) => setRelType(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    >
                        <option value="parent">is Parent of</option>
                        <option value="spouse">is Spouse of</option>
                    </select>

                    <select
                        value={relTo}
                        onChange={(e) => setRelTo(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    >
                        <option value="">Select Person 2</option>
                        {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>

                    <button
                        type="submit"
                        style={{
                            padding: '0.5rem',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)'
                        }}
                    >
                        Add Relationship
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Sidebar;
