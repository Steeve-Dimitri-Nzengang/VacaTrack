import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { removeExpense } from '../../store/slices/budgetSlice';
import { Expense } from '../../types/budget';
import { formatCurrency } from '../../utils/currencyHelpers';

interface ExpenseListProps {
    onEdit?: (expense: Expense) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ onEdit }) => {
    const dispatch = useDispatch();
    const expenses = useSelector((state: RootState) => state.budget.expenses);
    const currency = useSelector((state: RootState) => state.budget.currency);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const categories = useMemo(() => {
        const cats = new Set(expenses.map(e => e.category));
        return ['all', ...Array.from(cats)];
    }, [expenses]);

    const filtered = useMemo(() => {
        return expenses.filter(e => {
            const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase()) ||
                                  e.location?.toLowerCase().includes(search.toLowerCase());
            const matchesCat = filterCategory === 'all' || e.category === filterCategory;
            return matchesSearch && matchesCat;
        });
    }, [expenses, search, filterCategory]);

    return (
        <div className="card expense-list">
            <h2>📋 Ausgaben</h2>

            {expenses.length > 0 && (
                <div className="search-filter-bar">
                    <input
                        type="search"
                        className="search-input"
                        placeholder="🔍 Suchen..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="filter-select"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>{c === 'all' ? 'Alle Kategorien' : c}</option>
                        ))}
                    </select>
                </div>
            )}

            {expenses.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-state-icon">💸</span>
                    <p>Noch keine Ausgaben erfasst.</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-state-icon">🔍</span>
                    <p>Keine Ausgaben gefunden.</p>
                </div>
            ) : (
                <div className="expense-table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Beschreibung</th>
                                <th>Betrag</th>
                                <th>Datum</th>
                                <th>Kategorie</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(expense => (
                                <tr key={expense.id}>
                                    <td>
                                        <strong>{expense.description}</strong>
                                        {expense.location && <span className="text-muted" style={{ display: 'block', fontSize: 'var(--fs-xs)' }}>📍 {expense.location}</span>}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{formatCurrency(expense.amount, expense.currency || currency)}</td>
                                    <td>{expense.date}{expense.time ? ` ${expense.time}` : ''}</td>
                                    <td><span className="category-badge">{expense.category}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button onClick={() => onEdit?.(expense)} className="button small" title="Bearbeiten">✏️</button>
                                            <button onClick={() => dispatch(removeExpense(expense.id))} className="button small danger" title="Löschen">✕</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ExpenseList;