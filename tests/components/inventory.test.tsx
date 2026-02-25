import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../src/store';
import InventoryList from '../../src/components/inventory/InventoryList';

describe('InventoryList Component', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <InventoryList />
            </Provider>
        );
    });

    test('renders inventory list heading', () => {
        const heading = screen.getByText(/inventory/i);
        expect(heading).toBeInTheDocument();
    });

    test('displays inventory items', () => {
        const items = screen.getAllByRole('listitem');
        expect(items.length).toBeGreaterThan(0); // Assuming there are items in the inventory
    });

    test('adds a new item to the inventory', () => {
        const addItemButton = screen.getByRole('button', { name: /add item/i });
        fireEvent.click(addItemButton);

        const newItemInput = screen.getByPlaceholderText(/item name/i);
        fireEvent.change(newItemInput, { target: { value: 'New Item' } });

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        const newItem = screen.getByText(/new item/i);
        expect(newItem).toBeInTheDocument();
    });
});