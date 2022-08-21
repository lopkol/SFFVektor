'use strict';

const React = require('react');
const { render, screen } = require('@testing-library/react');
const { MemoryRouter } = require('react-router-dom');
const NotFound = require('./not-found');

describe('dummy test for checking test setup', () => {
  it('renders something', () => {
    render(<NotFound />, { wrapper: MemoryRouter });

    expect(screen.getByRole('button')).toHaveTextContent('Vissza a kezdőlapra');
  });
});
