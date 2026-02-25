import { useSelector } from 'react-redux';
import { selectLogEntries } from '../../store/slices/logbookSlice';

const LogbookExport: React.FC = () => {
    const logEntries = useSelector(selectLogEntries);

    const handleExport = () => {
        const dataStr = JSON.stringify(logEntries, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vacatrack-logbook.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="card">
            <h3>📥 Logbuch exportieren</h3>
            <button onClick={handleExport} className="button" disabled={logEntries.length === 0}>
                Als JSON exportieren
            </button>
        </div>
    );
};

export default LogbookExport;