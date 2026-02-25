import { useState } from 'react';

const RATES: Record<string, number> = {
    EUR: 1, USD: 1.08, GBP: 0.86, JPY: 162.5, CHF: 0.94, TRY: 34.2, THB: 38.5, PLN: 4.32,
};

const CurrencyConverter: React.FC = () => {
    const [amount, setAmount] = useState<number>(100);
    const [from, setFrom] = useState('EUR');
    const [to, setTo] = useState('USD');

    const converted = RATES[to] && RATES[from]
        ? (amount / RATES[from]) * RATES[to]
        : 0;

    const currencies = Object.keys(RATES);

    return (
        <div className="card">
            <h3>💱 Währungsrechner</h3>
            <div className="form-group">
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min="0" step="0.01" />
            </div>
            <div className="form-row-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center' }}>
                <select value={from} onChange={(e) => setFrom(e.target.value)}>
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span>→</span>
                <select value={to} onChange={(e) => setTo(e.target.value)}>
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <p><strong>{amount.toFixed(2)} {from} = {converted.toFixed(2)} {to}</strong></p>
        </div>
    );
};

export default CurrencyConverter;