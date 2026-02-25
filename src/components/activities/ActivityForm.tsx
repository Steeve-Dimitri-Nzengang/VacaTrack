import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addActivity } from '../../store/slices/activitiesSlice';
import { ActivityType } from '../../types/activity';
import { v4 as uuidv4 } from 'uuid';

const ActivityForm: React.FC = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState<ActivityType>('sightseeing');
    const [duration, setDuration] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !date) return;

        dispatch(addActivity({
            id: uuidv4(),
            title: title.trim(),
            description,
            date,
            time: time || undefined,
            location,
            type,
            duration: duration ? Number(duration) : undefined,
            completed: false,
        }));
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setLocation('');
        setDuration('');
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3>🎯 Neue Aktivität</h3>
            <div className="form-group">
                <label htmlFor="actTitle">Titel</label>
                <input type="text" id="actTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z.B. Eiffelturm besichtigen" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="form-group">
                    <label htmlFor="actDate">Datum</label>
                    <input type="date" id="actDate" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="actTime">Uhrzeit</label>
                    <input type="time" id="actTime" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div className="form-group">
                    <label htmlFor="actType">Typ</label>
                    <select id="actType" value={type} onChange={(e) => setType(e.target.value as ActivityType)}>
                        <option value="sightseeing">🏛️ Sightseeing</option>
                        <option value="food">🍽️ Essen & Trinken</option>
                        <option value="transport">🚌 Transport</option>
                        <option value="sport">⛷️ Sport & Outdoor</option>
                        <option value="culture">🎭 Kultur</option>
                        <option value="shopping">🛍️ Shopping</option>
                        <option value="other">📌 Sonstiges</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="actDuration">Dauer (Min.)</label>
                    <input type="number" id="actDuration" value={duration} onChange={(e) => setDuration(e.target.value)} min="0" placeholder="60" />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="actLocation">📍 Ort</label>
                <input type="text" id="actLocation" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="z.B. Paris, Champ de Mars" />
            </div>
            <div className="form-group">
                <label htmlFor="actDesc">Beschreibung</label>
                <textarea id="actDesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optionale Notizen..." />
            </div>
            <button type="submit" className="button">➕ Hinzufügen</button>
        </form>
    );
};

export default ActivityForm;