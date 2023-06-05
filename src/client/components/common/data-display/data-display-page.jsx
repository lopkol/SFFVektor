'use strict';

const React = require('react');
const { Link, List, ListItem, Typography } = require('@mui/material');
const { makeStyles } = require('@mui/styles');
const BookAlternativeDisplay = require('./book-alternative-display');

const useStyles = makeStyles(theme => ({
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    minWidth: '400px'
  },
  value: {
    minHeight: theme.typography.fontSize * 2
  }
}));

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
  const classes = useStyles();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {data.map(field => (
        <div className={classes.fieldContainer} key={field.key}>
          <Typography variant="subtitle2" sx={{ color: theme => theme.palette.grey[500] }}>
            {field.label}
          </Typography>
          <div className={classes.value}>{getDisplayValue(field)}</div>
        </div>
      ))}
    </div>
  );
}

module.exports = DataDisplayPage;
