import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, updateExpense } from '../../store/slices/budgetSlice';
import { RootState } from '../../store';
import { Expense } from '../../types/budget';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '../common/Toast';

interface ExpenseFormProps {
    editingExpense?: Expense | null;
    onDone?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ editingExpense, onDone }) => {
    const dispatch = useDispatch();
    const currency = useSelector((state: RootState) => state.budget.currency);
    const { showToast } = useToast();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('Essen');

    // When editingExpense changes, populate the form
    useEffect(() => {
        if (editingExpense) {
            setDescription(editingExpense.description);
            setAmount(editingExpense.amount.toString());
            setDate(editingExpense.date);
            setTime(editingExpense.time || '');
            setLocation(editingExpense.location || '');
            setCategory(editingExpense.category);
        }
    }, [editingExpense]);

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setTime('');
        setLocation('');
        setCategory('Essen');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !date) return;

        if (editingExpense) {
            dispatch(updateExpense({
                id: editingExpense.id,
                description,
                amount: parseFloat(amount),
                date,
                time: time || undefined,
                location: location || undefined,
                category,
                currency: editingExpense.currency || currency,
            }));
            showToast(`✏️ Ausgabe "${description}" aktualisiert!`);
            onDone?.();
        } else {
            dispatch(addExpense({
                id: uuidv4(),
                description,
                amount: parseFloat(amount),
                date,
                time: time || undefined,
                location: location || undefined,
                category,
                currency,
            }));
            showToast(`💰 Ausgabe "${description}" gespeichert!`);
        }
        resetForm();
    };

    const handleCancel = () => {
        resetForm();
        onDone?.();
    };

    return (
        <form className="card" onSubmit={handleSubmit}>
            <h3>{editingExpense ? '✏️ Ausgabe bearbeiten' : 'Neue Ausgabe erfassen'}</h3>
            <div className="form-group">
                <label htmlFor="expDesc">Beschreibung:</label>
                <input type="text" id="expDesc" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="expAmount">Betrag ({currency}):</label>
                <input type="number" id="expAmount" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" min="0" required />
            </div>
            <div className="form-group">
                <label htmlFor="expDate">Datum:</label>
                <input type="date" id="expDate" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="expTime">Uhrzeit (optional):</label>
                <input type="time" id="expTime" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="expLocation">Ort / Laden:</label>
                <input type="text" id="expLocation" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="z.B. Supermarkt am Strand" />
            </div>
            <div className="form-group">
                <label htmlFor="expCategory">Kategorie:</label>
                <select id="expCategory" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Essen">🍽️ Essen</option>
                    <option value="Transport">🚌 Transport</option>
                    <option value="Unterkunft">🏨 Unterkunft</option>
                    <option value="Aktivitäten">🎯 Aktivitäten</option>
                    <option value="Shopping">🛍️ Shopping</option>
                    <option value="Sonstiges">📌 Sonstiges</option>
                </select>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                <button type="submit" className="button">
                    {editingExpense ? 'Änderungen speichern' : 'Ausgabe speichern'}
                </button>
                {editingExpense && (
                    <button type="button" className="button secondary" onClick={handleCancel}>
                        Abbrechen
                    </button>
                )}
            </div>
        </form>
    );
};

export default ExpenseForm;