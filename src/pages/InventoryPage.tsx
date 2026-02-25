import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import AddItemForm from '../components/inventory/AddItemForm';
import PackingChecklist from '../components/inventory/PackingChecklist';
import InventoryList from '../components/inventory/InventoryList';
import Confetti from '../components/common/Confetti';

const InventoryPage: React.FC = () => {
    const items = useSelector((s: RootState) => s.inventory.items);
    const [showConfetti, setShowConfetti] = useState(false);
    const prevAllPacked = useRef(false);

    // Confetti auslösen wenn alle Gegenstände gepackt sind
    useEffect(() => {
        const allPacked = items.length > 0 && items.every(i => i.packed);
        if (allPacked && !prevAllPacked.current) {
            setShowConfetti(true);
        }
        prevAllPacked.current = allPacked;
    }, [items]);

    return (
        <div className="inventory-page">
            <h1>📦 Inventar-Tracker</h1>
            <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
            <AddItemForm />
            <PackingChecklist />
            <InventoryList />
        </div>
    );
};

export default InventoryPage;