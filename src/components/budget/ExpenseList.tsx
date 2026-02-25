import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { removeExpense } from '../../store/slices/budgetSlice';

const ExpenseList: React.FC = () => {
    const dispatch = useDispatch();
    const expenses = useSelector((state: RootState) => state.budget.expenses);

    return (
        <div className="card expense-list">
            <h2>📋 Ausgaben</h2>
            {expenses.length === 0 ? (
                <p>Noch keine Ausgaben erfasst.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Beschreibung</th>
                            <th>Betrag</th>
                            <th>Datum</th>
                            <th>Ort</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense.id}>
                                <td>{expense.description}</td>
                                <td>{expense.amount.toFixed(2)} {expense.currency}</td>
                                <td>{expense.date}{expense.time ? ` ${expense.time}` : ''}</td>
                                <td>{expense.location || '–'}</td>
                                <td>
                                    <button onClick={() => dispatch(removeExpense(expense.id))} className="button">✕</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExpenseList;