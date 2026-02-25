export function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

export function convertCurrency(amount: number, exchangeRate: number): number {
    return amount * exchangeRate;
}

export function isValidCurrencyCode(code: string): boolean {
    const currencyCodes = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
    return currencyCodes.includes(code);
}