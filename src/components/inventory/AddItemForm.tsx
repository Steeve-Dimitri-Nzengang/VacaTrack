import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/slices/inventorySlice';
import { InventoryItem } from '../../types/inventory';
import { v4 as uuidv4 } from 'uuid';

/** Bild via Canvas komprimieren, max 800px Breite, 0.7 JPEG-Qualität */
const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onloadend = () => {
            img.src = reader.result as string;
        };
        reader.onerror = reject;

        img.onload = () => {
            const ratio = Math.min(1, maxWidth / img.width);
            const canvas = document.createElement('canvas');
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const AddItemForm: React.FC = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState('Kleidung');
    const [notes, setNotes] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [compressing, setCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCompressing(true);
        try {
            const compressed = await compressImage(file);
            setPhotoUrl(compressed);
        } catch {
            // Fallback: ohne Komprimierung
            const reader = new FileReader();
            reader.onloadend = () => setPhotoUrl(reader.result as string);
            reader.readAsDataURL(file);
        } finally {
            setCompressing(false);
        }
    };

    const removePhoto = () => {
        setPhotoUrl('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const newItem: InventoryItem = {
            id: uuidv4(),
            name: name.trim(),
            quantity,
            category,
            packed: false,
            photoUrl: photoUrl || undefined,
            notes: notes || undefined,
        };
        dispatch(addItem(newItem));
        setName('');
        setQuantity(1);
        setNotes('');
        removePhoto();
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3>📦 Neuen Gegenstand hinzufügen</h3>
            <div className="form-group">
                <label htmlFor="itemName">Name</label>
                <input type="text" id="itemName" value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Reisepass, Ladekabel..." required />
            </div>
            <div className="form-group">
                <label htmlFor="itemQuantity">Anzahl</label>
                <input type="number" id="itemQuantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" required />
            </div>
            <div className="form-group">
                <label htmlFor="itemCategory">Kategorie</label>
                <select id="itemCategory" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Kleidung">👕 Kleidung</option>
                    <option value="Elektronik">🔌 Elektronik</option>
                    <option value="Hygiene">🧴 Hygiene</option>
                    <option value="Dokumente">📄 Dokumente</option>
                    <option value="Medikamente">💊 Medikamente</option>
                    <option value="Sonstiges">📎 Sonstiges</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="itemPhoto">📸 Foto</label>
                <input
                    ref={fileInputRef}
                    type="file"
                    id="itemPhoto"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoCapture}
                />
                {compressing && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Bild wird komprimiert...</p>}
                {photoUrl && (
                    <div style={{ position: 'relative', display: 'inline-block', marginTop: '8px' }}>
                        <img
                            src={photoUrl}
                            alt="Vorschau"
                            style={{
                                maxWidth: '200px',
                                maxHeight: '200px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                objectFit: 'cover',
                            }}
                        />
                        <button
                            type="button"
                            onClick={removePhoto}
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: 'var(--danger)',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                lineHeight: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >✕</button>
                    </div>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="itemNotes">Notizen</label>
                <input type="text" id="itemNotes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optionale Notizen..." />
            </div>
            <button type="submit" className="button">➕ Hinzufügen</button>
        </form>
    );
};

export default AddItemForm;