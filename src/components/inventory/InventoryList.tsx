import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { removeItem, togglePacked } from '../../store/slices/inventorySlice';
import InventoryItem from './InventoryItem';

const InventoryList: React.FC = () => {
    const dispatch = useDispatch();
    const inventoryItems = useSelector((state: RootState) => state.inventory.items);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const categories = useMemo(() => {
        const cats = new Set(inventoryItems.map(i => i.category));
        return ['all', ...Array.from(cats)];
    }, [inventoryItems]);

    const filtered = useMemo(() => {
        return inventoryItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                                  item.notes?.toLowerCase().includes(search.toLowerCase());
            const matchesCat = filterCategory === 'all' || item.category === filterCategory;
            return matchesSearch && matchesCat;
        });
    }, [inventoryItems, search, filterCategory]);

    return (
        <div className="inventory-list">
            <h2>📦 Dein Inventar</h2>

            {inventoryItems.length > 0 && (
                <div className="search-filter-bar">
                    <input
                        type="search"
                        className="search-input"
                        placeholder="🔍 Suchen..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="filter-select"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        {categories.map(c => (
                            <option key={c} value={c}>{c === 'all' ? 'Alle Kategorien' : c}</option>
                        ))}
                    </select>
                </div>
            )}

            {inventoryItems.length === 0 ? (
                <div className="empty-state card">
                    <span className="empty-state-icon">📦</span>
                    <p>Noch keine Gegenstände erfasst.</p>
                    <p className="text-muted">Füge oben welche hinzu!</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="empty-state card">
                    <span className="empty-state-icon">🔍</span>
                    <p>Kein Ergebnis für „{search}"</p>
                </div>
            ) : (
                <ul>
                    {filtered.map(item => (
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