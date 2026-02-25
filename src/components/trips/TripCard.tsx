import { Trip } from '../../types/trip';

interface TripCardProps {
    trip: Trip;
    onDelete: (id: string) => void;
}

/** Berechne Reisedauer in Tagen */
const getDuration = (start: string, end: string): number => {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1);
};

/** Formatiere Datum schön */
const formatDate = (dateStr: string): string => {
    try {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('de-DE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

/** Ist die Reise aktuell (heute zwischen start und end)? */
const isCurrent = (start: string, end: string): boolean => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now >= new Date(start) && now <= new Date(end);
};

/** Liegt die Reise in der Zukunft? */
const isUpcoming = (start: string): boolean => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return new Date(start) > now;
};

const TripCard: React.FC<TripCardProps> = ({ trip, onDelete }) => {
    const duration = getDuration(trip.startDate, trip.endDate);
    const current = isCurrent(trip.startDate, trip.endDate);
    const upcoming = isUpcoming(trip.startDate);

    let statusBadge = { label: '✅ Vergangen', className: 'trip-badge-past' };
    if (current) statusBadge = { label: '🟢 Aktuell', className: 'trip-badge-current' };
    else if (upcoming) statusBadge = { label: '📅 Geplant', className: 'trip-badge-upcoming' };

    return (
        <div className={`card trip-card ${current ? 'trip-card-current' : ''}`}>
            <div className="trip-card-header">
                <div>
                    <h3>{trip.name}</h3>
                    <p className="trip-destination">📍 {trip.destination}</p>
                </div>
                <span className={`trip-badge ${statusBadge.className}`}>{statusBadge.label}</span>
            </div>
            <div className="trip-card-dates">
                <span>🗓️ {formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
                <span className="trip-duration">{duration} {duration === 1 ? 'Tag' : 'Tage'}</span>
            </div>
            {trip.notes && <p className="trip-notes">{trip.notes}</p>}
            <div className="trip-card-actions">
                <button
                    onClick={() => {
                        if (window.confirm(`Reise „${trip.name}" wirklich löschen?`)) {
                            onDelete(trip.id);
                        }
                    }}
                    className="button small danger"
                >
                    🗑️ Löschen
                </button>
            </div>
        </div>
    );
};

export default TripCard;
