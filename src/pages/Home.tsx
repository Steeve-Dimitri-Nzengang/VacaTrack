import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeTrip } from '../store/slices/tripSlice';
import { formatCurrency } from '../utils/currencyHelpers';
import TripForm from '../components/trips/TripForm';
import TripCard from '../components/trips/TripCard';

const Home: React.FC = () => {
    const dispatch = useDispatch();
    const items = useSelector((s: RootState) => s.inventory.items);
    const activities = useSelector((s: RootState) => s.activities.activities);
    const { totalBudget, expenses, currency } = useSelector((s: RootState) => s.budget);
    const logEntries = useSelector((s: RootState) => s.logbook.entries);
    const trips = useSelector((s: RootState) => s.trip.trips);
    const [showTripForm, setShowTripForm] = useState(false);

    const stats = useMemo(() => {
        const packedCount = items.filter(i => i.packed).length;
        const packedPct = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;
        const doneActivities = activities.filter(a => a.completed).length;
        const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
        const remaining = totalBudget - totalSpent;

        return { packedCount, packedPct, itemCount: items.length, doneActivities, activityCount: activities.length, remaining, totalSpent, logCount: logEntries.length };
    }, [items, activities, expenses, totalBudget, logEntries]);

    return (
        <div className="home-page">
            <div className="home-hero">
                <h1>🌴 Willkommen bei VacaTrack</h1>
                <p>Dein persönlicher Reisebegleiter – alles offline verfügbar!</p>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-pill">
                    <span className="stat-icon">📦</span>
                    <span className="stat-value">{stats.packedCount}/{stats.itemCount}</span>
                    <span className="stat-label">gepackt</span>
                </div>
                <div className="stat-pill">
                    <span className="stat-icon">🎯</span>
                    <span className="stat-value">{stats.doneActivities}/{stats.activityCount}</span>
                    <span className="stat-label">erledigt</span>
                </div>
                <div className="stat-pill">
                    <span className="stat-icon">💰</span>
                    <span className="stat-value">{formatCurrency(stats.remaining, currency)}</span>
                    <span className="stat-label">übrig</span>
                </div>
                <div className="stat-pill">
                    <span className="stat-icon">📖</span>
                    <span className="stat-value">{stats.logCount}</span>
                    <span className="stat-label">Einträge</span>
                </div>
            </div>

            <div className="module-grid">
                <Link to="/inventory" className="card module-card module-inventory">
                    <span className="module-icon">📦</span>
                    <div className="module-info">
                        <h2>Inventar-Tracker</h2>
                        <p>Erfasse Gegenstände mit Foto und hake sie beim Packen ab.</p>
                    </div>
                    {items.length > 0 && (
                        <div className="module-progress">
                            <div className="mini-bar"><div className="mini-bar-fill" style={{ width: `${stats.packedPct}%` }} /></div>
                            <span>{stats.packedPct}%</span>
                        </div>
                    )}
                </Link>
                <Link to="/activities" className="card module-card module-activities">
                    <span className="module-icon">🎯</span>
                    <div className="module-info">
                        <h2>Aktivitäten-Planer</h2>
                        <p>Plane deine Urlaubserlebnisse als dynamische To-Do-Liste.</p>
                    </div>
                    {activities.length > 0 && (
                        <span className="module-badge">{stats.doneActivities}/{stats.activityCount}</span>
                    )}
                </Link>
                <Link to="/budget" className="card module-card module-budget">
                    <span className="module-icon">💰</span>
                    <div className="module-info">
                        <h2>Budget-Manager</h2>
                        <p>Behalte deine Ausgaben im Blick und sieh dein Restbudget.</p>
                    </div>
                    {totalBudget > 0 && (
                        <span className="module-badge" style={{ color: stats.remaining >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {formatCurrency(stats.remaining, currency)}
                        </span>
                    )}
                </Link>
                <Link to="/logbook" className="card module-card module-logbook">
                    <span className="module-icon">📖</span>
                    <div className="module-info">
                        <h2>Reise-Logbuch</h2>
                        <p>Dokumentiere besuchte Orte als chronologische Timeline.</p>
                    </div>
                    {logEntries.length > 0 && (
                        <span className="module-badge">{stats.logCount} Einträge</span>
                    )}
                </Link>
            </div>

            {/* Meine Reisen */}
            <section className="trips-section">
                <div className="trips-header">
                    <h2>✈️ Meine Reisen</h2>
                    <button className="button" onClick={() => setShowTripForm(true)}>
                        + Neue Reise
                    </button>
                </div>

                {trips.length === 0 ? (
                    <div className="card empty-state">
                        <span className="empty-state-icon">🌍</span>
                        <p>Du hast noch keine Reisen angelegt.</p>
                        <p className="text-muted">Füge deine erste Reise hinzu, um den Überblick zu behalten!</p>
                    </div>
                ) : (
                    <div className="trips-list">
                        {[...trips]
                            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                            .map(trip => (
                                <TripCard
                                    key={trip.id}
                                    trip={trip}
                                    onDelete={(id) => dispatch(removeTrip(id))}
                                />
                            ))
                        }
                    </div>
                )}
            </section>

            {showTripForm && <TripForm onClose={() => setShowTripForm(false)} />}
        </div>
    );
};

export default Home;