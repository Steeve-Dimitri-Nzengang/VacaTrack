import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BudgetDashboard from '../../src/components/budget/BudgetDashboard';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../src/store';

const renderWithRedux = (component, { initialState, store = createStore(rootReducer, initialState) } = {}) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('BudgetDashboard Component', () => {
  test('renders budget overview', () => {
    renderWithRedux(<BudgetDashboard />);
    const budgetOverviewElement = screen.getByText(/budget overview/i);
    expect(budgetOverviewElement).toBeInTheDocument();
  });

  test('displays total budget correctly', () => {
    const initialState = {
      budget: {
        total: 1000,
        expenses: [],
      },
    };
    renderWithRedux(<BudgetDashboard />, { initialState });
    const totalBudgetElement = screen.getByText(/total budget: \$1000/i);
    expect(totalBudgetElement).toBeInTheDocument();
  });

  test('adds an expense correctly', () => {
    const initialState = {
      budget: {
        total: 1000,
        expenses: [],
      },
    };
    renderWithRedux(<BudgetDashboard />, { initialState });

    const addExpenseButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(addExpenseButton);

    const expenseInput = screen.getByPlaceholderText(/enter expense amount/i);
    fireEvent.change(expenseInput, { target: { value: '200' } });
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    const updatedTotalElement = screen.getByText(/total budget: \$800/i);
    expect(updatedTotalElement).toBeInTheDocument();
  });
});