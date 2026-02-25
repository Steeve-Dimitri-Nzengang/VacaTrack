import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="home-page">
            <h1>🌴 Willkommen bei VacaTrack</h1>
            <p>Dein persönlicher Reisebegleiter – alles offline verfügbar!</p>

            <div className="module-grid">
                <Link to="/inventory" className="card module-card">
                    <h2>📦 Inventar-Tracker</h2>
                    <p>Erfasse deine Gegenstände mit Foto und hake sie beim Packen ab.</p>
                </Link>
                <Link to="/activities" className="card module-card">
                    <h2>🎯 Aktivitäten-Planer</h2>
                    <p>Plane deine Urlaubserlebnisse als dynamische To-Do-Liste.</p>
                </Link>
                <Link to="/budget" className="card module-card">
                    <h2>💰 Budget-Manager</h2>
                    <p>Behalte deine Ausgaben im Blick und sieh dein Restbudget.</p>
                </Link>
                <Link to="/logbook" className="card module-card">
                    <h2>📖 Reise-Logbuch</h2>
                    <p>Dokumentiere besuchte Orte als chronologische Timeline.</p>
                </Link>
            </div>
        </div>
    );
};

export default Home;