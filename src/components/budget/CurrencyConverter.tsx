import { useState, useEffect, useCallback } from 'react';
import useOffline from '../../hooks/useOffline';

/** Statische Fallback-Raten (Stand: März 2026) */
const FALLBACK_RATES: Record<string, number> = {
    EUR: 1, USD: 1.08, GBP: 0.86, JPY: 162.5, CHF: 0.94,
    TRY: 34.2, THB: 38.5, PLN: 4.32, CAD: 1.47, AUD: 1.65,
    SEK: 11.2, NOK: 11.5, DKK: 7.46, CNY: 7.85, INR: 90.5,
    BRL: 5.35, ZAR: 19.8, MAD: 10.85, XAF: 655.96,
};

/** Anzeigename + Flag für jede Währung */
const CURRENCY_INFO: Record<string, { flag: string; name: string }> = {
    EUR: { flag: '🇪🇺', name: 'Euro' },
    USD: { flag: '🇺🇸', name: 'US-Dollar' },
    GBP: { flag: '🇬🇧', name: 'Britisches Pfund' },
    JPY: { flag: '🇯🇵', name: 'Japanischer Yen' },
    CHF: { flag: '🇨🇭', name: 'Schweizer Franken' },
    TRY: { flag: '🇹🇷', name: 'Türkische Lira' },
    THB: { flag: '🇹🇭', name: 'Thailändischer Baht' },
    PLN: { flag: '🇵🇱', name: 'Polnischer Złoty' },
    CAD: { flag: '🇨🇦', name: 'Kanadischer Dollar' },
    AUD: { flag: '🇦🇺', name: 'Australischer Dollar' },
    SEK: { flag: '🇸🇪', name: 'Schwedische Krone' },
    NOK: { flag: '🇳🇴', name: 'Norwegische Krone' },
    DKK: { flag: '🇩🇰', name: 'Dänische Krone' },
    CNY: { flag: '🇨🇳', name: 'Chinesischer Yuan' },
    INR: { flag: '🇮🇳', name: 'Indische Rupie' },
    BRL: { flag: '🇧🇷', name: 'Brasilianischer Real' },
    ZAR: { flag: '🇿🇦', name: 'Südafrikanischer Rand' },
    MAD: { flag: '🇲🇦', name: 'Marokkanischer Dirham' },
    XAF: { flag: '🇨🇲', name: 'CFA-Franc (BEAC)' },
};

const API_URL = 'https://api.exchangerate-api.com/v4/latest/EUR';

const CurrencyConverter: React.FC = () => {
    const { isOffline } = useOffline();
    const [amount, setAmount] = useState<number>(100);
    const [from, setFrom] = useState('EUR');
    const [to, setTo] = useState('USD');
    const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLive, setIsLive] = useState(false);

    const fetchRates = useCallback(async () => {
        if (isOffline) return;
        setIsLoading(true);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            // Nur die Währungen übernehmen, die wir kennen
            const newRates: Record<string, number> = {};
            for (const code of Object.keys(CURRENCY_INFO)) {
                if (data.rates[code] !== undefined) {
                    newRates[code] = data.rates[code];
                } else if (FALLBACK_RATES[code] !== undefined) {
                    newRates[code] = FALLBACK_RATES[code];
                }
            }
            setRates(newRates);
            setIsLive(true);
            setLastUpdated(new Date().toLocaleString('de-DE', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            }));
            // Cache in localStorage
            localStorage.setItem('vacatrack_rates', JSON.stringify(newRates));
            localStorage.setItem('vacatrack_rates_time', new Date().toISOString());
        } catch {
            console.warn('Konnte keine Live-Kurse abrufen, nutze Fallback.');
            setIsLive(false);
        } finally {
            setIsLoading(false);
        }
    }, [isOffline]);

    // Beim Laden: gespeicherte Kurse aus localStorage lesen, dann ggf. live aktualisieren
    useEffect(() => {
        const cached = localStorage.getItem('vacatrack_rates');
        const cachedTime = localStorage.getItem('vacatrack_rates_time');
        if (cached) {
            try {
                setRates(JSON.parse(cached));
                if (cachedTime) {
                    setLastUpdated(new Date(cachedTime).toLocaleString('de-DE', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                    }));
                    setIsLive(true);
                }
            } catch { /* ignore */ }
        }
        fetchRates();
    }, [fetchRates]);

    // Wenn wieder online: Kurse neu laden
    useEffect(() => {
        if (!isOffline) {
            fetchRates();
        }
    }, [isOffline, fetchRates]);

    const converted = rates[to] && rates[from]
        ? (amount / rates[from]) * rates[to]
        : 0;

    const currencies = Object.keys(CURRENCY_INFO);

    const swapCurrencies = () => {
        setFrom(to);
        setTo(from);
    };

    const renderOption = (code: string) => {
        const info = CURRENCY_INFO[code];
        return (
            <option key={code} value={code}>
                {info?.flag} {code} — {info?.name}
            </option>
        );
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: 'var(--space-xs)' }}>💱 Währungsrechner</h2>

            {/* Status-Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: 'var(--fs-xs)', padding: '2px 10px', borderRadius: '999px',
                    background: isLive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    color: isLive ? '#22c55e' : '#ef4444',
                    fontWeight: 600,
                }}>
                    <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: isLive ? '#22c55e' : '#ef4444',
                        display: 'inline-block',
                    }} />
                    {isLoading ? 'Lade...' : isLive ? 'Live-Kurse' : 'Offline-Kurse'}
                </span>
                {lastUpdated && (
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                        Aktualisiert: {lastUpdated}
                    </span>
                )}
                {!isOffline && (
                    <button
                        onClick={fetchRates}
                        className="button small"
                        style={{ marginLeft: 'auto', fontSize: 'var(--fs-xs)', padding: '2px 8px' }}
                        disabled={isLoading}
                        title="Kurse aktualisieren"
                    >
                        🔄
                    </button>
                )}
            </div>

            {/* Betrag */}
            <div className="form-group">
                <label htmlFor="convAmount">Betrag:</label>
                <input
                    type="number" id="convAmount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="0" step="0.01"
                    style={{ fontSize: 'var(--fs-lg)', fontWeight: 700 }}
                />
            </div>

            {/* Von → Nach */}
            <div className="form-row-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="convFrom">Von:</label>
                    <select id="convFrom" value={from} onChange={(e) => setFrom(e.target.value)}>
                        {currencies.map(renderOption)}
                    </select>
                </div>
                <button
                    type="button" onClick={swapCurrencies}
                    className="button small"
                    style={{ marginTop: '18px' }}
                    title="Tauschen"
                >
                    ⇄
                </button>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="convTo">Nach:</label>
                    <select id="convTo" value={to} onChange={(e) => setTo(e.target.value)}>
                        {currencies.map(renderOption)}
                    </select>
                </div>
            </div>

            {/* Ergebnis */}
            <div style={{
                marginTop: 'var(--space-md)',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--glass-surface-bg)',
                textAlign: 'center',
            }}>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    {amount.toFixed(2)} {CURRENCY_INFO[from]?.flag} {from}
                </p>
                <p style={{ fontSize: 'var(--fs-xl)', fontWeight: 800 }}>
                    = {converted.toFixed(2)} {CURRENCY_INFO[to]?.flag} {to}
                </p>
                {rates[from] && rates[to] && (
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
                        1 {from} = {(rates[to] / rates[from]).toFixed(4)} {to}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CurrencyConverter;