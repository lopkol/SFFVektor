'use strict';

const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { Router } = require('react-router-dom');
const { createMemoryHistory } = require('history');
const NotFound = require('./not-found');

describe('NotFound component', () => {
  it('should redirect to start page when clicking redirect button', async () => {
    const history = createMemoryHistory();
    history.push('/there/is/nothing/here/bro');

    render(
      <Router location={history.location} navigator={history}>
        <NotFound />
      </Router>
    );
    fireEvent.click(screen.getByRole('button'));

    expect(history.location.pathname).toEqual('/');
  });
});
