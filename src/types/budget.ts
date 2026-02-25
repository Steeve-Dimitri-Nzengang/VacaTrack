export interface Expense {
    id: string;
    description: string;
    amount: number;
    date: string;
    time?: string;
    location?: string;
    category: string;
    currency: string;
}

export interface BudgetState {
    totalBudget: number;
    currency: string;
    expenses: Expense[];
}