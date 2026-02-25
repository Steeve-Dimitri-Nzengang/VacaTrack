import { useState } from 'react';
import ActivityForm from './ActivityForm';
import DayTimeline from './DayTimeline';

const ActivitiesPlanner: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    return (
        <div>
            <h1>🎯 Aktivitäten-Planer</h1>
            <div className="form-group">
                <label htmlFor="dateFilter">Tag auswählen:</label>
                <input
                    type="date"
                    id="dateFilter"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>
            <ActivityForm />
            <DayTimeline date={selectedDate} />
        </div>
    );
};

export default ActivitiesPlanner;