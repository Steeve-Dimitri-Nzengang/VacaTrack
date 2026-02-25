import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useParams } from 'react-router-dom';

const TripDetailPage: React.FC = () => {
    const { tripId } = useParams<{ tripId: string }>();
    const trip = useSelector((state: RootState) =>
        state.trip.trips.find((t) => t.id === tripId)
    );

    if (!trip) {
        return <div className="card"><p>Reise nicht gefunden.</p></div>;
    }

    return (
        <div className="trip-detail-page">
            <h1>✈️ {trip.name}</h1>
            <div className="card">
                <p><strong>Ziel:</strong> {trip.destination}</p>
                <p><strong>Zeitraum:</strong> {trip.startDate} – {trip.endDate}</p>
                <p><strong>Budget:</strong> {trip.budget} {trip.currency}</p>
                {trip.notes && <p><strong>Notizen:</strong> {trip.notes}</p>}
            </div>
        </div>
    );
};

export default TripDetailPage;