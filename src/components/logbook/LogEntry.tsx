import { useDispatch } from 'react-redux';
import { removeLogEntry } from '../../store/slices/logbookSlice';
import { LogEntry as LogEntryType } from '../../types/logbook';

const LOCATION_ICONS: Record<string, string> = {
    hotel: '🏨',
    restaurant: '🍽️',
    museum: '🏛️',
    sehenswürdigkeit: '📸',
    strand: '🏖️',
    transport: '🚌',
    sonstiges: '📌',
};

interface LogEntryComponentProps {
    entry: LogEntryType;
    onEdit?: (entry: LogEntryType) => void;
}

const LogEntry: React.FC<LogEntryComponentProps> = ({ entry, onEdit }) => {
    const dispatch = useDispatch();
    const icon = LOCATION_ICONS[entry.locationType] || '📌';

    return (
        <li className="card log-entry">
            <div className="log-entry-header">
                <span className="log-icon">{icon}</span>
                <h3 style={{ flex: 1 }}>{entry.title}</h3>
                <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                    <button onClick={() => onEdit?.(entry)} className="button small" title="Bearbeiten">✏️</button>
                    <button onClick={() => dispatch(removeLogEntry(entry.id))} className="button small danger" title="Löschen">✕</button>
                </div>
            </div>
            <p className="log-meta">
                📅 {entry.date} {entry.time && `⏰ ${entry.time}`} · 📍 {entry.location}
            </p>
            <p>{entry.description}</p>
        </li>
    );
};

export default LogEntry;