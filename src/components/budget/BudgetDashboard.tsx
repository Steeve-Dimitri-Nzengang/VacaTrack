import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/currencyHelpers';

const BudgetDashboard: React.FC = () => {
    const { totalBudget, expenses, currency } = useSelector((state: RootState) => state.budget);

    const { totalSpent, remaining, percent, byCategory } = useMemo(() => {
        const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const rem = totalBudget - spent;
        const pct = totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0;

        // Kategorien aufschlüsseln
        const catMap: Record<string, number> = {};
        expenses.forEach(e => {
            catMap[e.category] = (catMap[e.category] || 0) + e.amount;
        });
        const sorted = Object.entries(catMap).sort(([, a], [, b]) => b - a);

        return { totalSpent: spent, remaining: rem, percent: pct, byCategory: sorted };
    }, [expenses, totalBudget]);

    const barColor = percent > 90 ? 'var(--danger)' : percent > 70 ? 'var(--warning)' : 'var(--success)';

    return (
        <div className="card budget-dashboard">
            <h3>💰 Budget-Übersicht</h3>

            <div className="budget-stats">
                <div>
                    <span>Gesamtbudget</span>
                    <strong>{formatCurrency(totalBudget, currency)}</strong>
                </div>
                <div>
                    <span>Ausgegeben</span>
                    <strong>{formatCurrency(totalSpent, currency)}</strong>
                </div>
                <div>
                    <span>Verbleibend</span>
                    <strong style={{ color: remaining >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {formatCurrency(remaining, currency)}
                    </strong>
                </div>
                <div>
                    <span>Ausgenutzt</span>
                    <strong style={{ color: barColor }}>{percent}%</strong>
                </div>
            </div>

            <div className="budget-bar">
                <div
                    className="budget-bar-fill"
                    style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: barColor }}
                />
            </div>

            {byCategory.length > 0 && (
                <div style={{ marginTop: 'var(--space-lg)' }}>
                    <h4 style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
                        Nach Kategorie
                    </h4>
                    {byCategory.map(([cat, amount]) => {
                        const catPercent = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
                        return (
                            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: 'var(--fs-sm)' }}>
                                <span>{cat}</span>
                                <span style={{ fontWeight: 500 }}>
                                    {formatCurrency(amount, currency)} ({catPercent}%)
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BudgetDashboard;