import { Link, useLocation } from 'react-router-dom';

const SIDEBAR_ITEMS = [
    { to: '/', emoji: '🏠', label: 'Home' },
    { to: '/inventory', emoji: '📦', label: 'Inventar' },
    { to: '/activities', emoji: '🎯', label: 'Aktivitäten' },
    { to: '/budget', emoji: '💰', label: 'Budget' },
    { to: '/logbook', emoji: '📖', label: 'Logbuch' },
    { to: '/settings', emoji: '⚙️', label: 'Einstellungen' },
];

const Sidebar: React.FC = () => {
    const { pathname } = useLocation();

    return (
        <aside className="sidebar">
            <h3>Navigation</h3>
            <nav>
                <ul>
                    {SIDEBAR_ITEMS.map(item => (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                className={pathname === item.to ? 'active' : ''}
                            >
                                {item.emoji} {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;