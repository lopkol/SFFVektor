'use strict';

const React = require('react');
const { Box, Link, List, ListItem, Typography } = require('@mui/material');
const BookAlternativeDisplay = require('./book-alternative-display');

function getDisplayValue(field) {
  if (field.type === 'select') {
    return <ListItem>{field.options.find(option => option.id === field.value).name}</ListItem>;
  } else if (field.type === 'tags') {
    const nameList = field.value.map(optionId => (
      <ListItem key={optionId}>
        {field.options.find(option => option.id === optionId).name}
      </ListItem>
    ));
    return <List dense>{nameList}</List>;
  } else if (field.type === 'alternatives') {
    return <BookAlternativeDisplay alternatives={field.value} />;
  } else if (field.type === 'url') {
    return (
      <ListItem>
        <Link color="inherit" href={field.value} target="_blank" rel="noopener">
          {field.value}
        </Link>
      </ListItem>
    );
  }
  return <ListItem>{field.value}</ListItem>;
}

function DataDisplayPage({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {data.map(field => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 2,
            marginRight: 2,
            marginTop: 2,
            minWidth: '400px'
          }}
          key={field.key}
        >
          <Typography variant="subtitle2" sx={{ color: theme => theme.palette.grey[500] }}>
            {field.label}
          </Typography>
          <Box sx={{ minHeight: theme => theme.typography.fontSize * 2 }}>
            {getDisplayValue(field)}
          </Box>
        </Box>
      ))}
    </div>
  );
}

module.exports = DataDisplayPage;
