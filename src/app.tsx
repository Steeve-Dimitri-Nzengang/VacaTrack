import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import OfflineBanner from './components/common/OfflineBanner';
import { ToastProvider } from './components/common/Toast';
import Home from './pages/Home';
import InventoryPage from './pages/InventoryPage';
import ActivitiesPage from './pages/ActivitiesPage';
import BudgetPage from './pages/BudgetPage';
import LogbookPage from './pages/LogbookPage';
import SettingsPage from './pages/SettingsPage';
import TripDetailPage from './pages/TripDetailPage';

const App = () => {
    const theme = useSelector((state: RootState) => state.trip.settings.theme);

    // Theme beim Start + bei Änderung anwenden
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <Router>
            <ToastProvider>
                <div className="app-container">
                    <Navbar />
                    <Sidebar />
                    <OfflineBanner />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/inventory" element={<InventoryPage />} />
                            <Route path="/activities" element={<ActivitiesPage />} />
                            <Route path="/budget" element={<BudgetPage />} />
                            <Route path="/logbook" element={<LogbookPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/trip/:tripId" element={<TripDetailPage />} />
                        </Routes>
                    </main>
                </div>
            </ToastProvider>
        </Router>
    );
};

export default App;