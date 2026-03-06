import { useState, useRef } from 'react';
import { LogEntry } from '../types/logbook';
import LogEntryForm from '../components/logbook/LogEntryForm';
import LogbookFeed from '../components/logbook/LogbookFeed';
import LogbookExport from '../components/logbook/LogbookExport';

const LogbookPage: React.FC = () => {
    const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);
    const formRef = useRef<HTMLDivElement>(null);

    const handleEdit = (entry: LogEntry) => {
        setEditingEntry(entry);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleEditDone = () => {
        setEditingEntry(null);
    };

    return (
        <div className="logbook-page">
            <h1>📖 Reise-Logbuch</h1>
            <div ref={formRef}>
                <LogEntryForm editingEntry={editingEntry} onDone={handleEditDone} />
            </div>
            <LogbookFeed onEdit={handleEdit} />
            <LogbookExport />
        </div>
    );
};

export default LogbookPage;