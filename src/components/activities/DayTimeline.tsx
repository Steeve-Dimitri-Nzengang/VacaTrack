import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleActivity, removeActivity } from '../../store/slices/activitiesSlice';
import ActivityCard from './ActivityCard';

interface DayTimelineProps {
    date: string;
}

const formatDate = (d: string) => {
    try {
        return new Date(d + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
    } catch { return d; }
};

const DayTimeline: React.FC<DayTimelineProps> = ({ date }) => {
    const dispatch = useDispatch();
    const activities = useSelector((state: RootState) => state.activities.activities);

    const filtered = useMemo(() => {
        return activities
            .filter(a => a.date === date)
            .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    }, [activities, date]);

    const doneCount = filtered.filter(a => a.completed).length;

    return (
        <div className="day-timeline">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                <h3>📅 {formatDate(date)}</h3>
                {filtered.length > 0 && (
                    <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                        {doneCount}/{filtered.length} erledigt
                    </span>
                )}
            </div>
            {filtered.length > 0 ? (
                filtered.map(activity => (
                    <ActivityCard
                        key={activity.id}
                        activity={activity}
                        onToggle={() => dispatch(toggleActivity(activity.id))}
                        onDelete={() => dispatch(removeActivity(activity.id))}
                    />
                ))
            ) : (
                <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>Keine Aktivitäten für diesen Tag geplant.</p>
                </div>
            )}
        </div>
    );
};

export default DayTimeline;