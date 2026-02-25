import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <h2>🌴 VacaTrack</h2>
            <nav>
                <ul>
                    <li><Link to="/">🏠 Home</Link></li>
                    <li><Link to="/inventory">📦 Inventar</Link></li>
                    <li><Link to="/activities">🎯 Aktivitäten</Link></li>
                    <li><Link to="/budget">💰 Budget</Link></li>
                    <li><Link to="/logbook">📖 Logbuch</Link></li>
                    <li><Link to="/settings">⚙️ Einstellungen</Link></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;