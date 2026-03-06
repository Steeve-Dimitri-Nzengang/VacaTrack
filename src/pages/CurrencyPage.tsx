import CurrencyConverter from '../components/budget/CurrencyConverter';

const CurrencyPage: React.FC = () => {
    return (
        <div className="currency-page">
            <h1>💱 Währungsrechner</h1>
            <CurrencyConverter />
        </div>
    );
};

export default CurrencyPage;
