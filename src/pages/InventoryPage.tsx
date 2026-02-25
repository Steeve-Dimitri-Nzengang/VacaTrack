import AddItemForm from '../components/inventory/AddItemForm';
import PackingChecklist from '../components/inventory/PackingChecklist';
import InventoryList from '../components/inventory/InventoryList';

const InventoryPage: React.FC = () => {
    return (
        <div className="inventory-page">
            <h1>📦 Inventar-Tracker</h1>
            <AddItemForm />
            <PackingChecklist />
            <InventoryList />
        </div>
    );
};

export default InventoryPage;