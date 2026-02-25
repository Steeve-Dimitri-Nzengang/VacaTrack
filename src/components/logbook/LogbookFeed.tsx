import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectLogEntries } from '../../store/slices/logbookSlice';
import LogEntry from './LogEntry';

/** Datum hübsch formatieren: "Mo., 24. Feb. 2026" */
const formatGroupDate = (dateStr: string): string => {
    try {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
};

const LogbookFeed: React.FC = () => {
    const logEntries = useSelector(selectLogEntries);
    const [search, setSearch] = useState('');

    // Sortiere chronologisch (neueste zuerst) + gruppiere nach Datum
    const grouped = useMemo(() => {
        const filtered = logEntries.filter(e =>
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.location.toLowerCase().includes(search.toLowerCase()) ||
            e.description?.toLowerCase().includes(search.toLowerCase())
        );

        const sorted = [...filtered].sort((a, b) => {
            const dateA = `${a.date}T${a.time || '00:00'}`;
            const dateB = `${b.date}T${b.time || '00:00'}`;
            return dateB.localeCompare(dateA);
        });

        const groups: { date: string; entries: typeof sorted }[] = [];
        sorted.forEach(entry => {
            const last = groups[groups.length - 1];
            if (last && last.date === entry.date) {
                last.entries.push(entry);
            } else {
                groups.push({ date: entry.date, entries: [entry] });
            }
        });
        return groups;
    }, [logEntries, search]);

    return (
        <div className="logbook-feed">
            <h3>📖 Reise-Timeline</h3>

            {logEntries.length > 0 && (
                <div className="search-filter-bar">
                    <input
                        type="search"
                        className="search-input"
                        placeholder="🔍 Einträge durchsuchen..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            )}

            {grouped.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>✈️</p>
                    <p>Noch keine Einträge. Dokumentiere deine Reise!</p>
                </div>
            ) : (
                grouped.map(group => (
                    <div key={group.date}>
                        <h4 style={{
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            margin: 'var(--space-md) 0 var(--space-sm)',
                            paddingBottom: 'var(--space-xs)',
                            borderBottom: '1px solid var(--divider)',
                        }}>
                            {formatGroupDate(group.date)}
                        </h4>
                        <ul className="timeline">
                            {group.entries.map(entry => (
                                <LogEntry key={entry.id} entry={entry} />
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default LogbookFeed;