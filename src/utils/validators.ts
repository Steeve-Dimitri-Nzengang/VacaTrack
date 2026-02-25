export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
    return value.trim() !== '';
};

export const validateNumber = (value: string): boolean => {
    const numberRegex = /^\d+(\.\d+)?$/;
    return numberRegex.test(value);
};

export const validateDate = (dateString: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dateString);
};

export const validateBudget = (budget: number): boolean => {
    return budget > 0;
};