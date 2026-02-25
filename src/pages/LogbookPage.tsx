import LogEntryForm from '../components/logbook/LogEntryForm';
import LogbookFeed from '../components/logbook/LogbookFeed';
import LogbookExport from '../components/logbook/LogbookExport';

const LogbookPage: React.FC = () => {
    return (
        <div className="logbook-page">
            <h1>📖 Reise-Logbuch</h1>
            <LogEntryForm />
            <LogbookFeed />
            <LogbookExport />
        </div>
    );
};

export default LogbookPage;