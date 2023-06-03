'use strict';

const React = require('react');
const { Link, List, ListItem } = require('@mui/material');

function BookAlternativeDisplay({ alternatives }) {
  return (
    <List dense disablePadding>
      {alternatives.map(alternative => (
        <ListItem key={alternative.id}>
          <List dense disablePadding>
            <div>{alternative.name}</div>
            {alternative.urls.map((url, idx) => (
              <ListItem key={idx}>
                <Link color="inherit" href={url} target="_blank" rel="noopener">
                  {url}
                </Link>
              </ListItem>
            ))}
          </List>
        </ListItem>
      ))}
    </List>
  );
}

module.exports = BookAlternativeDisplay;
