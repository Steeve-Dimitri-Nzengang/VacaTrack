import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTrip } from '../../store/slices/tripSlice';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../common/Toast';

interface TripFormProps {
    onClose: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ onClose }) => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const [name, setName] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !destination.trim() || !startDate || !endDate) return;

        if (new Date(endDate) < new Date(startDate)) {
            showToast('Das Enddatum darf nicht vor dem Startdatum liegen.', 'error');
            return;
        }

        dispatch(addTrip({
            id: uuidv4(),
            name: name.trim(),
            destination: destination.trim(),
            startDate,
            endDate,
            budget: 0,
            currency: 'EUR',
            notes: notes || undefined,
        }));

        showToast(`✈️ Reise „${name.trim()}" hinzugefügt!`);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>✈️ Neue Reise hinzufügen</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Schließen">✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="tripName">Name der Reise</label>
                        <input
                            type="text"
                            id="tripName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="z.B. Sommerurlaub 2026"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tripDest">Reiseziel</label>
                        <input
                            type="text"
                            id="tripDest"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="z.B. Barcelona, Spanien"
                            required
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                        <div className="form-group">
                            <label htmlFor="tripStart">Von</label>
                            <input
                                type="date"
                                id="tripStart"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tripEnd">Bis</label>
                            <input
                                type="date"
                                id="tripEnd"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || undefined}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tripNotes">Notizen (optional)</label>
                        <textarea
                            id="tripNotes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="z.B. Flug gebucht, Hotel: ..."
                            rows={3}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
                        <button type="button" className="button secondary" onClick={onClose}>Abbrechen</button>
                        <button type="submit" className="button">✈️ Reise hinzufügen</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TripForm;
