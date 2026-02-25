import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../store/slices/tripSlice';
import { setItems } from '../store/slices/inventorySlice';
import { setActivities } from '../store/slices/activitiesSlice';
import { setLogEntries } from '../store/slices/logbookSlice';
import { RootState } from '../store';
import { useToast } from '../components/common/Toast';

const SettingsPage: React.FC = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state: RootState) => state.trip.settings);
    const fullState = useSelector((state: RootState) => state);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    // Theme live auf <html> anwenden
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);

    /** Alle Daten als JSON exportieren */
    const handleExportAll = () => {
        const data = {
            version: 1,
            exportedAt: new Date().toISOString(),
            inventory: fullState.inventory,
            activities: fullState.activities,
            budget: fullState.budget,
            logbook: fullState.logbook,
            trip: fullState.trip,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vacatrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('💾 Backup erfolgreich exportiert!');
    };

    /** Daten aus JSON importieren */
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result as string);
                if (data.inventory?.items) dispatch(setItems(data.inventory.items));
                if (data.activities?.activities) dispatch(setActivities(data.activities.activities));
                if (data.logbook?.entries) dispatch(setLogEntries(data.logbook.entries));
                if (data.trip?.settings) dispatch(updateSettings(data.trip.settings));
                showToast('📥 Daten erfolgreich importiert!');
            } catch {
                showToast('Import fehlgeschlagen – ungültiges Format.', 'error');
            }
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    /** Alle Daten löschen */
    const handleClearAll = () => {
        if (!window.confirm('Alle Daten löschen? Dies kann nicht rückgängig gemacht werden!')) return;
        dispatch(setItems([]));
        dispatch(setActivities([]));
        dispatch(setLogEntries([]));
        showToast('🗑️ Alle Daten gelöscht.', 'warning');
    };

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

            <div className="card">
                <h3>💾 Daten-Backup</h3>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                    Exportiere alle deine Daten als JSON-Backup oder stelle sie aus einer Datei wieder her.
                </p>
                <div className="form-row-responsive" style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    <button onClick={handleExportAll} className="button">📤 Backup exportieren</button>
                    <label className="button secondary" style={{ cursor: 'pointer' }}>
                        📥 Backup importieren
                        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                    </label>
                </div>
            </div>

            <div className="card">
                <h3>🗑️ Gefahrenzone</h3>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                    Alle lokal gespeicherten Daten unwiderruflich löschen.
                </p>
                <button onClick={handleClearAll} className="button danger">Alle Daten löschen</button>
            </div>
        </div>
    );
};

export default SettingsPage;