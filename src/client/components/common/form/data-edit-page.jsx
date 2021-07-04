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

function DataEditPage({ data, handleChange }) {
  const classes = useStyles();

  function handleFieldChange({ key, value }) {
    const newFields = data.map(field => {
      if (field.key === key) {
        return {
          ...field,
          value
        };
      }
      return field;
    });
    handleChange(newFields);
  }

  return (
    <form noValidate autoComplete="off">
      <div className={classes.container}>
        { data.map(field => (
          <DataInput
            name={field.key}
            key={field.key}
            field={field}
            handleChange={(newValue) => handleFieldChange({ key: field.key, value: newValue })}
          />
        )) }
      </div>
    </form>
  );
}

module.exports = DataEditPage;
