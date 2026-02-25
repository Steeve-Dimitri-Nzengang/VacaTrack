import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">🌴 VacaTrack</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/inventory">📦 Inventar</Link></li>
                <li><Link to="/activities">🎯 Aktivitäten</Link></li>
                <li><Link to="/budget">💰 Budget</Link></li>
                <li><Link to="/logbook">📖 Logbuch</Link></li>
                <li><Link to="/settings">⚙️ Einstellungen</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;