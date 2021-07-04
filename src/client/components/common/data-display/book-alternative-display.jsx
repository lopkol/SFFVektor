'use strict';

const React = require('react');
const {
  Link,
  List,
  ListItem
} = require('@material-ui/core');

function BookAlternativeDisplay({ field }) {
  const [alternatives] = React.useState(field.value);

  return (
    <List dense disablePadding>
      { alternatives.map(alternative => (
        <ListItem key={alternative.id}>
          <List dense disablePadding>
            <div>
              {alternative.name}
            </div>
            { alternative.urls.map((url, idx) => (
              <ListItem key={idx}>
                <Link
                  color="inherit"
                  href={url}
                  target="_blank"
                  rel="noopener"
                >
                  {url}
                </Link>
              </ListItem>
            ))}
          </List>
        </ListItem>
      )) }
    </List>
  );
}

module.exports = BookAlternativeDisplay;
