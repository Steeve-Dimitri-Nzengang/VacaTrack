import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { removeItem, togglePacked } from '../../store/slices/inventorySlice';
import InventoryItem from './InventoryItem';

const InventoryList: React.FC = () => {
    const dispatch = useDispatch();
    const inventoryItems = useSelector((state: RootState) => state.inventory.items);

    return (
        <div className="inventory-list">
            <h2>📦 Dein Inventar</h2>
            {inventoryItems.length === 0 ? (
                <p>Noch keine Gegenstände erfasst. Füge welche hinzu!</p>
            ) : (
                <ul>
                    {inventoryItems.map(item => (
                        <InventoryItem
                            key={item.id}
                            item={item}
                            onRemove={(id) => dispatch(removeItem(id))}
                            onTogglePacked={(id) => dispatch(togglePacked(id))}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default InventoryList;