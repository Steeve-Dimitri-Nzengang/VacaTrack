import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { togglePacked } from '../../store/slices/inventorySlice';

const PackingChecklist: React.FC = () => {
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => state.inventory.items);
    const packedCount = items.filter(i => i.packed).length;

    return (
        <div className="card">
            <h2>🧳 Pack-Checkliste</h2>
            <p>{packedCount} von {items.length} eingepackt</p>
            {items.length === 0 ? (
                <p>Noch keine Gegenstände vorhanden.</p>
            ) : (
                <ul className="checklist">
                    {items.map((item) => (
                        <li key={item.id} className={item.packed ? 'checked' : ''}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={item.packed}
                                    onChange={() => dispatch(togglePacked(item.id))}
                                />
                                {item.name} (×{item.quantity})
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PackingChecklist;