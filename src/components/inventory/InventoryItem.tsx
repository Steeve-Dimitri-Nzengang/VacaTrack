import { InventoryItemProps } from '../../types/inventory';

const InventoryItem: React.FC<InventoryItemProps> = ({ item, onRemove, onTogglePacked }) => {
    return (
        <li className={`inventory-item card ${item.packed ? 'packed' : ''}`}>
            <div className="item-info">
                {item.photoUrl && (
                    <img src={item.photoUrl} alt={item.name} className="item-photo" />
                )}
                <div>
                    <h3>{item.name}</h3>
                    <p>Anzahl: {item.quantity}</p>
                    <p>Kategorie: {item.category}</p>
                    {item.notes && <p>Notizen: {item.notes}</p>}
                </div>
            </div>
            <div className="item-actions">
                <label>
                    <input
                        type="checkbox"
                        checked={item.packed}
                        onChange={() => onTogglePacked?.(item.id)}
                    />
                    Eingepackt
                </label>
                <button onClick={() => onRemove(item.id)} className="button">Entfernen</button>
            </div>
        </li>
    );
};

export default InventoryItem;