import { Activity, ActivityType } from '../../types/activity';

interface ActivityCardProps {
  activity: Activity;
  onToggle?: () => void;
  onDelete?: () => void;
}

const typeConfig: Record<ActivityType, { emoji: string; color: string }> = {
    sightseeing: { emoji: '🏛️', color: '#2196F3' },
    food:        { emoji: '🍽️', color: '#FF9800' },
    transport:   { emoji: '🚌', color: '#607D8B' },
    sport:       { emoji: '⛷️', color: '#4CAF50' },
    culture:     { emoji: '🎭', color: '#9C27B0' },
    shopping:    { emoji: '🛍️', color: '#E91E63' },
    other:       { emoji: '📌', color: '#795548' },
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onToggle, onDelete }) => {
    const cfg = typeConfig[activity.type || 'other'];

    return (
        <div
            className={`card activity-card ${activity.completed ? 'completed' : ''}`}
            style={{ borderLeft: `4px solid ${activity.completed ? 'var(--success)' : cfg.color}` }}
        >
            <div className="activity-header">
                <h4>
                    {cfg.emoji} {activity.title}
                    {activity.completed && <span style={{ marginLeft: '8px', fontSize: 'var(--fs-sm)' }}>✅</span>}
                </h4>
                {activity.time && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', margin: 0 }}>
                        🕐 {activity.time}
                    </p>
                )}
            </div>
            {activity.description && <p style={{ color: 'var(--text-secondary)', margin: 'var(--space-xs) 0' }}>{activity.description}</p>}
            {activity.location && <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', margin: '2px 0' }}>📍 {activity.location}</p>}
            {activity.duration && (
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', margin: '2px 0' }}>
                    ⏱️ {activity.duration >= 60 ? `${Math.floor(activity.duration / 60)}h ${activity.duration % 60}min` : `${activity.duration}min`}
                </p>
            )}
            <div className="activity-card-actions">
                {onToggle && (
                    <button onClick={onToggle} className={`button small ${activity.completed ? 'secondary' : ''}`}>
                        {activity.completed ? '↩ Rückgängig' : '✓ Erledigt'}
                    </button>
                )}
                {onDelete && <button onClick={onDelete} className="button small danger">🗑 Löschen</button>}
            </div>
        </div>
    );
};

export default ActivityCard;