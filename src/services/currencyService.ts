const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

export const fetchExchangeRates = async (baseCurrency: string = 'EUR'): Promise<Record<string, number>> => {
    try {
        const response = await fetch(`${API_URL}${baseCurrency}`);
        if (!response.ok) throw new Error('Failed to fetch rates');
        const data = await response.json();
        return data.rates as Record<string, number>;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        // Fallback-Raten für Offline-Nutzung
        return { EUR: 1, USD: 1.08, GBP: 0.86, JPY: 162.5, CHF: 0.94 };
    }
};

export const convertCurrency = (amount: number, fromRate: number, toRate: number): number => {
    return (amount / fromRate) * toRate;
};