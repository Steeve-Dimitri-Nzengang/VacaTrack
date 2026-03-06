import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
    { to: '/inventory', emoji: '📦', label: 'Inventar' },
    { to: '/activities', emoji: '🎯', label: 'Aktivitäten' },
    { to: '/budget', emoji: '💰', label: 'Budget' },
    { to: '/logbook', emoji: '📖', label: 'Logbuch' },
    { to: '/currency', emoji: '💱', label: 'Währung' },
    { to: '/settings', emoji: '⚙️', label: 'Einstellungen' },
];

const Navbar: React.FC = () => {
    const { pathname } = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    // Menü schließen bei Navigation
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Body-Scroll sperren bei offenem Menü
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/">🌴 VacaTrack</Link>
                </div>

                {/* Desktop-Links */}
                <ul className="navbar-links navbar-desktop">
                    {NAV_ITEMS.map(item => (
                        <li key={item.to}>
                            <Link to={item.to} className={pathname === item.to ? 'active' : ''}>
                                {item.emoji} {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Hamburger-Button (Mobile) */}
                <button
                    className={`hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Menü öffnen"
                >
                    <span /><span /><span />
                </button>
            </nav>

            {/* Mobile Drawer Overlay */}
            <div className={`drawer-overlay ${menuOpen ? 'visible' : ''}`} onClick={() => setMenuOpen(false)} />

            {/* Mobile Drawer */}
            <aside className={`drawer ${menuOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <span className="drawer-brand">🌴 VacaTrack</span>
                </div>
                <nav className="drawer-nav">
                    <Link to="/" className={`drawer-link ${pathname === '/' ? 'active' : ''}`}>
                        🏠 Home
                    </Link>
                    {NAV_ITEMS.map(item => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`drawer-link ${pathname === item.to ? 'active' : ''}`}
                        >
                            {item.emoji} {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Navbar;