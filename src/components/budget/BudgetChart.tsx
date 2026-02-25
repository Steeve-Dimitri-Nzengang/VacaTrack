import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS: Record<string, string> = {
    'Essen': '#FF6384',
    'Transport': '#36A2EB',
    'Unterkunft': '#FFCE56',
    'Aktivitäten': '#4BC0C0',
    'Shopping': '#9966FF',
    'Sonstiges': '#FF9F40',
};

const BudgetChart: React.FC = () => {
    const expenses = useSelector((state: RootState) => state.budget.expenses);

    // Gruppiere nach Kategorie
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = {
        labels,
        datasets: [{
            data: Object.values(categoryTotals),
            backgroundColor: labels.map(l => CATEGORY_COLORS[l] || '#ccc'),
        }],
    };

    if (expenses.length === 0) {
        return (
            <div className="card">
                <h3>📊 Ausgaben-Verteilung</h3>
                <p>Noch keine Ausgaben vorhanden.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3>📊 Ausgaben-Verteilung</h3>
            <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                <Pie data={data} />
            </div>
        </div>
    );
};

export default BudgetChart;