import { LogEntry } from '../types/logbook';
import { InventoryItem } from '../types/inventory';
import { Expense } from '../types/budget';

/** Hilfsfunktion: JSON-Download auslösen */
const downloadJSON = (data: unknown, filename: string): void => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const exportLogbookData = (logbookEntries: LogEntry[]): void => {
    downloadJSON(logbookEntries, 'vacatrack-logbook.json');
};

export const exportInventoryData = (inventoryItems: InventoryItem[]): void => {
    downloadJSON(inventoryItems, 'vacatrack-inventory.json');
};

export const exportBudgetData = (budgetData: Expense[]): void => {
    downloadJSON(budgetData, 'vacatrack-budget.json');
};