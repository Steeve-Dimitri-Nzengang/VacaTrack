import React from 'react';
import { render, screen } from '@testing-library/react';
import ActivitiesPlanner from '../../src/components/activities/ActivitiesPlanner';

describe('ActivitiesPlanner Component', () => {
    test('renders ActivitiesPlanner heading', () => {
        render(<ActivitiesPlanner />);
        const headingElement = screen.getByText(/Activities Planner/i);
        expect(headingElement).toBeInTheDocument();
    });

    test('renders activity form', () => {
        render(<ActivitiesPlanner />);
        const formElement = screen.getByRole('form');
        expect(formElement).toBeInTheDocument();
    });

    test('renders day timeline', () => {
        render(<ActivitiesPlanner />);
        const timelineElement = screen.getByTestId('day-timeline');
        expect(timelineElement).toBeInTheDocument();
    });
});