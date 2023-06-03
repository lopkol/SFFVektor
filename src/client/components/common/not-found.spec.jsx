'use strict';

const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { Router } = require('react-router-dom');
const { createMemoryHistory } = require('history');
const { ThemeProvider, createTheme } = require('@mui/material/styles');
const NotFound = require('./not-found');

describe('NotFound component', () => {
  it('should redirect to start page when clicking redirect button', async () => {
    const history = createMemoryHistory();
    history.push('/there/is/nothing/here/bro');

    render(
      <ThemeProvider theme={createTheme()}>
        <Router location={history.location} navigator={history}>
          <NotFound />
        </Router>
      </ThemeProvider>
    );
    fireEvent.click(screen.getByText('Vissza a kezdőlapra'));

    expect(history.location.pathname).toEqual('/');
  });
});
