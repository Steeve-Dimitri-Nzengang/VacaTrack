import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addLogEntry, updateLogEntry } from '../../store/slices/logbookSlice';
import { LogEntry } from '../../types/logbook';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../common/Toast';

interface LogEntryFormProps {
    editingEntry?: LogEntry | null;
    onDone?: () => void;
}

const LogEntryForm: React.FC<LogEntryFormProps> = ({ editingEntry, onDone }) => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [locationType, setLocationType] = useState<LogEntry['locationType']>('sonstiges');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));

    // When editingEntry changes, populate the form
    useEffect(() => {
        if (editingEntry) {
            setTitle(editingEntry.title);
            setDescription(editingEntry.description);
            setLocation(editingEntry.location);
            setLocationType(editingEntry.locationType);
            setDate(editingEntry.date);
            setTime(editingEntry.time);
        }
    }, [editingEntry]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setLocation('');
        setLocationType('sonstiges');
        setDate(new Date().toISOString().split('T')[0]);
        setTime(new Date().toTimeString().slice(0, 5));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !location.trim()) return;

        if (editingEntry) {
            dispatch(updateLogEntry({
                id: editingEntry.id,
                title: title.trim(),
                description,
                location: location.trim(),
                locationType,
                date,
                time,
                photos: editingEntry.photos,
            }));
            showToast(`✏️ "${title.trim()}" aktualisiert!`);
            onDone?.();
        } else {
            dispatch(addLogEntry({
                id: uuidv4(),
                title: title.trim(),
                description,
                location: location.trim(),
                locationType,
                date,
                time,
            }));
            showToast(`📖 "${title.trim()}" zum Logbuch hinzugefügt!`);
        }
        resetForm();
    };

    const handleCancel = () => {
        resetForm();
        onDone?.();
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3>{editingEntry ? '✏️ Eintrag bearbeiten' : 'Neuer Logbuch-Eintrag'}</h3>
            <div className="form-group">
                <label htmlFor="logTitle">Titel:</label>
                <input type="text" id="logTitle" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="logLocation">Ort:</label>
                <input type="text" id="logLocation" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="z.B. Hotel Miramare" />
            </div>
            <div className="form-group">
                <label htmlFor="logLocationType">Ortstyp:</label>
                <select id="logLocationType" value={locationType} onChange={(e) => setLocationType(e.target.value as LogEntry['locationType'])}>
                    <option value="hotel">🏨 Hotel</option>
                    <option value="restaurant">🍽️ Restaurant</option>
                    <option value="museum">🏛️ Museum</option>
                    <option value="sehenswürdigkeit">📸 Sehenswürdigkeit</option>
                    <option value="strand">🏖️ Strand</option>
                    <option value="transport">🚌 Transport</option>
                    <option value="sonstiges">📌 Sonstiges</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="logDate">Datum:</label>
                <input type="date" id="logDate" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="logTime">Uhrzeit:</label>
                <input type="time" id="logTime" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="logDesc">Beschreibung:</label>
                <textarea id="logDesc" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                <button type="submit" className="button">
                    {editingEntry ? 'Änderungen speichern' : 'Eintrag speichern'}
                </button>
                {editingEntry && (
                    <button type="button" className="button secondary" onClick={handleCancel}>
                        Abbrechen
                    </button>
                )}
            </div>
        </form>
    );
};

export default LogEntryForm;