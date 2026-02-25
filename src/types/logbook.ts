export interface LogEntry {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    locationType: 'hotel' | 'restaurant' | 'museum' | 'sehenswürdigkeit' | 'strand' | 'transport' | 'sonstiges';
    description: string;
    photos?: string[];
}

export interface LogEntryProps {
    entry: LogEntry;
}

export interface LogbookState {
    entries: LogEntry[];
}