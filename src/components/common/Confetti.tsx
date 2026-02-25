import { useEffect, useState } from 'react';

interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    delay: number;
    rotation: number;
    size: number;
}

interface ConfettiProps {
    active: boolean;
    onComplete?: () => void;
}

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#66bb6a', '#f06292'];

const Confetti: React.FC<ConfettiProps> = ({ active, onComplete }) => {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (!active) { setPieces([]); return; }

        const newPieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            delay: Math.random() * 0.5,
            rotation: Math.random() * 360,
            size: 6 + Math.random() * 8,
        }));
        setPieces(newPieces);

        const timer = setTimeout(() => {
            setPieces([]);
            onComplete?.();
        }, 3000);

        return () => clearTimeout(timer);
    }, [active, onComplete]);

    if (pieces.length === 0) return null;

    return (
        <div className="confetti-container" aria-hidden="true">
            {pieces.map(p => (
                <div
                    key={p.id}
                    className="confetti-piece"
                    style={{
                        left: `${p.x}%`,
                        backgroundColor: p.color,
                        width: `${p.size}px`,
                        height: `${p.size * 0.6}px`,
                        animationDelay: `${p.delay}s`,
                        transform: `rotate(${p.rotation}deg)`,
                    }}
                />
            ))}
        </div>
    );
};

export default Confetti;
