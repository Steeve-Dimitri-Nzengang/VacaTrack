import { LogEntryProps } from '../../types/logbook';

const LOCATION_ICONS: Record<string, string> = {
    hotel: '🏨',
    restaurant: '🍽️',
    museum: '🏛️',
    sehenswürdigkeit: '📸',
    strand: '🏖️',
    transport: '🚌',
    sonstiges: '📌',
};

const LogEntry: React.FC<LogEntryProps> = ({ entry }) => {
    const icon = LOCATION_ICONS[entry.locationType] || '📌';

    return (
        <li className="card log-entry">
            <div className="log-entry-header">
                <span className="log-icon">{icon}</span>
                <h3>{entry.title}</h3>
            </div>
            <p className="log-meta">
                📅 {entry.date} {entry.time && `⏰ ${entry.time}`} · 📍 {entry.location}
            </p>
            <p>{entry.description}</p>
        </li>
    );
};

export default LogEntry;