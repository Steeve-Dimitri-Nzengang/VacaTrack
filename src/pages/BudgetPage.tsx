import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setTotalBudget } from '../store/slices/budgetSlice';
import { Expense } from '../types/budget';
import BudgetDashboard from '../components/budget/BudgetDashboard';
import ExpenseForm from '../components/budget/ExpenseForm';
import ExpenseList from '../components/budget/ExpenseList';
import BudgetChart from '../components/budget/BudgetChart';

const BudgetPage: React.FC = () => {
    const dispatch = useDispatch();
    const totalBudget = useSelector((state: RootState) => state.budget.totalBudget);
    const [budgetInput, setBudgetInput] = useState(totalBudget.toString());
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const formRef = useRef<HTMLDivElement>(null);

    const handleSetBudget = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(budgetInput);
        if (!isNaN(val) && val >= 0) {
            dispatch(setTotalBudget(val));
        }
    };

    const handleEditExpense = (expense: Expense) => {
        setEditingExpense(expense);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleEditDone = () => {
        setEditingExpense(null);
    };

    return (
        <div className="budget-page">
            <h1>💰 Budget-Manager</h1>

            <form onSubmit={handleSetBudget} className="card form-row-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="totalBudget">Gesamtbudget festlegen:</label>
                    <input type="number" id="totalBudget" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} step="0.01" min="0" />
                </div>
                <button type="submit" className="button">Setzen</button>
            </form>

            <BudgetDashboard />
            <div ref={formRef}>
                <ExpenseForm editingExpense={editingExpense} onDone={handleEditDone} />
            </div>
            <ExpenseList onEdit={handleEditExpense} />
            <BudgetChart />
        </div>
    );
};

export default BudgetPage;