'use strict';

const React = require('react');
const {
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
    margin: theme.spacing(2),
    minWidth: '400px'
  },
  label: {
    color: theme.palette.grey[500],
    marginBottom: theme.spacing(1)
  },
  value: {
    paddingLeft: theme.spacing(2),
    minHeight: theme.typography.fontSize*1.7
  }
}));

function getDisplayValue(field) {
  if (field.select) {
    return field.options.find(option => option.id === field.value).name;
  }
  return field.value;
}

function DataDisplayPage(props) {
  const classes = useStyles();
  const { data } = props;

  return (
    <div className={classes.root}>
      { data.map(field => (
        <div className={classes.fieldContainer} key={field.key}>
          <Typography variant="subtitle2" className={classes.label}>
            {field.label}
          </Typography>
          <Typography className={classes.value}>
            {getDisplayValue(field)}
          </Typography>
        </div>
      )) }
    </div>
  );
}

module.exports = DataDisplayPage;
