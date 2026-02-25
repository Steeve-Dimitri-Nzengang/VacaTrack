import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../store/slices/tripSlice';
import { RootState } from '../store';

const SettingsPage: React.FC = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state: RootState) => state.trip.settings);

    // Theme live auf <html> anwenden
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);

    return (
        <div className="settings-page">
            <h2>⚙️ Einstellungen</h2>
            <div className="card">
                <h3>Allgemein</h3>
                <div className="form-group">
                    <label htmlFor="currency">Währung</label>
                    <select
                        id="currency"
                        value={settings.currency}
                        onChange={(e) => dispatch(updateSettings({ currency: e.target.value }))}
                    >
                        <option value="EUR">🇪🇺 EUR – Euro</option>
                        <option value="USD">🇺🇸 USD – US-Dollar</option>
                        <option value="GBP">🇬🇧 GBP – Pfund</option>
                        <option value="CHF">🇨🇭 CHF – Schweizer Franken</option>
                        <option value="JPY">🇯🇵 JPY – Yen</option>
                        <option value="TRY">🇹🇷 TRY – Türkische Lira</option>
                        <option value="THB">🇹🇭 THB – Thai Baht</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="language">Sprache</label>
                    <select
                        id="language"
                        value={settings.language}
                        onChange={(e) => dispatch(updateSettings({ language: e.target.value }))}
                    >
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="en">🇬🇧 English</option>
                    </select>
                </div>

                <h3 style={{ marginTop: 'var(--space-lg)' }}>Darstellung</h3>
                <div className="form-group">
                    <label htmlFor="theme">Farbschema</label>
                    <select
                        id="theme"
                        value={settings.theme}
                        onChange={(e) => dispatch(updateSettings({ theme: e.target.value as 'light' | 'dark' }))}
                    >
                        <option value="light">☀️ Hell</option>
                        <option value="dark">🌙 Dunkel</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;