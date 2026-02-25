import React from 'react';
import { render, screen } from '@testing-library/react';
import LogbookFeed from '../../src/components/logbook/LogbookFeed';
import { Provider } from 'react-redux';
import { store } from '../../src/store';

describe('LogbookFeed Component', () => {
    test('renders logbook entries', () => {
        render(
            <Provider store={store}>
                <LogbookFeed />
            </Provider>
        );

        const logbookElement = screen.getByText(/logbook entries/i);
        expect(logbookElement).toBeInTheDocument();
    });

    // Additional tests can be added here
});