'use strict';

const React = require('react');
const { makeStyles } = require('@material-ui/core');
const DataInput = require('./data-input');

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  }
}));

function DataEditPage(props) {
  const classes = useStyles();
  const { data, handleChange } = props;

  return (
    <form noValidate autoComplete="off">
      <div className={classes.container}>
        { data.map(field => (
          <DataInput
            name={field.key}
            key={field.key}
            field={field}
            handleChange={handleChange}
          />
        )) }
      </div>
    </form>
  );
}

module.exports = DataEditPage;
