import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addLogEntry } from '../../store/slices/logbookSlice';
import { LogEntry } from '../../types/logbook';
import { v4 as uuidv4 } from 'uuid';

const LogEntryForm: React.FC = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [locationType, setLocationType] = useState<LogEntry['locationType']>('sonstiges');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !location.trim()) return;

        dispatch(addLogEntry({
            id: uuidv4(),
            title: title.trim(),
            description,
            location: location.trim(),
            locationType,
            date,
            time,
        }));
        setTitle('');
        setDescription('');
        setLocation('');
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3>Neuer Logbuch-Eintrag</h3>
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
            <button type="submit" className="button">Eintrag speichern</button>
        </form>
    );
};

export default LogEntryForm;