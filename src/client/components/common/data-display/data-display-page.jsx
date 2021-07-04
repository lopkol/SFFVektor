'use strict';

const React = require('react');
const {
  List,
  ListItem,
  Typography,
  makeStyles
} = require('@material-ui/core');

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    minWidth: '400px'
  },
  label: {
    color: theme.palette.grey[500]
  },
  value: {
    minHeight: theme.typography.fontSize*2
  }
}));

function getDisplayValue(field) {
  if (field.type === 'select') {
    return <ListItem>{ field.options.find(option => option.id === field.value).name }</ListItem>;
  } else if (field.type === 'tags') {
    const nameList = field.value.map(optionId => <ListItem key={optionId}>{ field.options.find(option => option.id === optionId).name }</ListItem> );
    return <List dense>{ nameList }</List>;
  } else if (field.type === 'alternatives') {
    return <div/>;
  }
  return <ListItem>{ field.value }</ListItem>;
}

function DataDisplayPage({ data }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      { data.map(field => (
        <div className={classes.fieldContainer} key={field.key}>
          <Typography variant="subtitle2" className={classes.label}>
            {field.label}
          </Typography>
          <div className={classes.value}>
            {getDisplayValue(field)}
          </div>
        </div>
      )) }
    </div>
  );
}

module.exports = DataDisplayPage;
