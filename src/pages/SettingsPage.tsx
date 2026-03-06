import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../store/slices/tripSlice';
import { setTrips } from '../store/slices/tripSlice';
import { setItems } from '../store/slices/inventorySlice';
import { setActivities } from '../store/slices/activitiesSlice';
import { setLogEntries } from '../store/slices/logbookSlice';
import { setExpenses, setTotalBudget, setCurrency } from '../store/slices/budgetSlice';
import { RootState } from '../store';
import { useToast } from '../components/common/Toast';
import { mergeById, createEmptySummary, SyncSummary } from '../utils/syncMerge';

const SettingsPage: React.FC = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state: RootState) => state.trip.settings);
    const fullState = useSelector((state: RootState) => state);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();
    const [importSummary, setImportSummary] = useState<SyncSummary | null>(null);

    // Theme live auf <html> anwenden
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);

    /** Backup-Daten-Objekt erstellen */
    const createBackupData = () => ({
        _vacatrack: true,
        version: 2,
        exportedAt: new Date().toISOString(),
        deviceName: navigator.userAgent.includes('Mobile') ? '📱 Smartphone' :
                    navigator.userAgent.includes('Tablet') ? '📱 Tablet' : '💻 Computer',
        inventory: fullState.inventory,
        activities: fullState.activities,
        budget: fullState.budget,
        logbook: fullState.logbook,
        trip: fullState.trip,
    });

    /** Dateiname generieren */
    const getFileName = () => {
        const date = new Date().toISOString().slice(0, 10);
        const time = new Date().toTimeString().slice(0, 5).replace(':', '-');
        return `VacaTrack_${date}_${time}.vacatrack`;
    };

    /** Backup als .vacatrack Datei herunterladen */
    const handleDownloadBackup = () => {
        const data = createBackupData();
        const blob = new Blob([JSON.stringify(data)], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = getFileName();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('💾 Backup heruntergeladen!');
    };

    /** Backup über native Share-API teilen */
    const handleShareBackup = async () => {
        const data = createBackupData();
        const blob = new Blob([JSON.stringify(data)], { type: 'application/octet-stream' });
        const file = new File([blob], getFileName(), { type: 'application/octet-stream' });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'VacaTrack Backup',
                    text: 'Mein VacaTrack-Backup zum Übertragen auf ein anderes Gerät.',
                    files: [file],
                });
                showToast('📤 Backup geteilt!');
            } catch (err: unknown) {
                // User hat Share-Dialog abgebrochen
                if (err instanceof Error && err.name !== 'AbortError') {
                    handleDownloadBackup(); // Fallback
                }
            }
        } else {
            // Fallback: Download, wenn Share API nicht verfügbar
            handleDownloadBackup();
        }
    };

    /** Smart-Import mit Merge */
    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result as string);

                // Validierung
                if (!data._vacatrack && !data.version) {
                    showToast('❌ Das ist keine gültige VacaTrack-Datei.', 'error');
                    return;
                }

                const summary = createEmptySummary();

                // Inventar mergen
                if (data.inventory?.items) {
                    const result = mergeById(fullState.inventory.items, data.inventory.items);
                    dispatch(setItems(result.merged));
                    summary.inventory = result.stats;
                }

                // Aktivitäten mergen
                if (data.activities?.activities) {
                    const result = mergeById(fullState.activities.activities, data.activities.activities);
                    dispatch(setActivities(result.merged));
                    summary.activities = result.stats;
                }

                // Budget-Ausgaben mergen
                if (data.budget?.expenses) {
                    const result = mergeById(fullState.budget.expenses, data.budget.expenses);
                    dispatch(setExpenses(result.merged));
                    summary.expenses = result.stats;

                    // Budget-Betrag nur übernehmen, wenn lokal noch 0
                    if (data.budget.totalBudget && fullState.budget.totalBudget === 0) {
                        dispatch(setTotalBudget(data.budget.totalBudget));
                    }
                    if (data.budget.currency) {
                        dispatch(setCurrency(data.budget.currency));
                    }
                }

                // Logbuch mergen
                if (data.logbook?.entries) {
                    const result = mergeById(fullState.logbook.entries, data.logbook.entries);
                    dispatch(setLogEntries(result.merged));
                    summary.logbook = result.stats;
                }

                // Reisen mergen
                if (data.trip?.trips) {
                    const result = mergeById(fullState.trip.trips, data.trip.trips);
                    dispatch(setTrips(result.merged));
                    summary.trips = result.stats;
                }

                // Einstellungen übernehmen (kein Merge, da kein Array)
                if (data.trip?.settings) {
                    dispatch(updateSettings(data.trip.settings));
                }

                // Gesamt
                summary.totalAdded = summary.inventory.added + summary.activities.added +
                    summary.expenses.added + summary.logbook.added + summary.trips.added;
                summary.totalUpdated = summary.inventory.updated + summary.activities.updated +
                    summary.expenses.updated + summary.logbook.updated + summary.trips.updated;

                setImportSummary(summary);
                showToast(`✅ Import abgeschlossen: ${summary.totalAdded} neu, ${summary.totalUpdated} aktualisiert`);
            } catch {
                showToast('❌ Import fehlgeschlagen – Datei konnte nicht gelesen werden.', 'error');
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
        dispatch(setExpenses([]));
        dispatch(setLogEntries([]));
        dispatch(setTrips([]));
        dispatch(setTotalBudget(0));
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
                        <option value="MAD">🇲🇦 MAD – Dirham</option>
                        <option value="XAF">🇨🇲 XAF – CFA-Franc</option>
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

            {/* ────────── Geräte-Sync ────────── */}
            <div className="card">
                <h3>� Geräte-Sync</h3>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
                    Übertrage deine Daten auf ein anderes Gerät — per WhatsApp, E-Mail, AirDrop oder als Datei.
                </p>
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>
                    💡 <strong>So geht's:</strong> Tippe auf „Backup teilen", schick dir die Datei selbst zu
                    (z.B. per WhatsApp oder E-Mail), und öffne sie dann auf deinem anderen Gerät mit „Backup laden".
                    Bestehende Daten werden dabei <strong>nicht überschrieben</strong>, sondern intelligent zusammengeführt.
                </p>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
                    <button onClick={handleShareBackup} className="button">
                        📤 Backup teilen
                    </button>
                    <button onClick={handleDownloadBackup} className="button secondary">
                        � Backup herunterladen
                    </button>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    <label className="button secondary" style={{ cursor: 'pointer' }}>
                        📥 Backup laden
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".vacatrack,.json"
                            onChange={handleImport}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                {/* Import-Zusammenfassung */}
                {importSummary && (
                    <div style={{
                        marginTop: 'var(--space-md)',
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--glass-surface-bg)',
                        fontSize: 'var(--fs-sm)',
                    }}>
                        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--fs-base)' }}>
                            ✅ Import abgeschlossen
                        </h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', paddingBottom: '4px', borderBottom: '1px solid var(--divider)' }}>Bereich</th>
                                    <th style={{ textAlign: 'center', paddingBottom: '4px', borderBottom: '1px solid var(--divider)' }}>Neu</th>
                                    <th style={{ textAlign: 'center', paddingBottom: '4px', borderBottom: '1px solid var(--divider)' }}>Aktualisiert</th>
                                    <th style={{ textAlign: 'center', paddingBottom: '4px', borderBottom: '1px solid var(--divider)' }}>Unverändert</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { label: '📦 Inventar', data: importSummary.inventory },
                                    { label: '🎯 Aktivitäten', data: importSummary.activities },
                                    { label: '💰 Ausgaben', data: importSummary.expenses },
                                    { label: '📖 Logbuch', data: importSummary.logbook },
                                    { label: '✈️ Reisen', data: importSummary.trips },
                                ].map(row => (
                                    <tr key={row.label}>
                                        <td style={{ padding: '4px 0' }}>{row.label}</td>
                                        <td style={{ textAlign: 'center', color: row.data.added > 0 ? '#22c55e' : 'var(--text-muted)' }}>
                                            {row.data.added > 0 ? `+${row.data.added}` : '—'}
                                        </td>
                                        <td style={{ textAlign: 'center', color: row.data.updated > 0 ? '#f59e0b' : 'var(--text-muted)' }}>
                                            {row.data.updated > 0 ? row.data.updated : '—'}
                                        </td>
                                        <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                            {row.data.unchanged}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ marginTop: 'var(--space-sm)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="button small secondary" onClick={() => setImportSummary(null)}>
                                Schließen
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ────────── Gefahrenzone ────────── */}
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