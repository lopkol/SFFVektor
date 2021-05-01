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
  const [fields, setFields] = React.useState([]);

  React.useEffect(() => {
    setFields(data);
  }, [data]);

  function handleFieldChange(event, key, newValue) {
    const fieldToChange = fields.find(field => field.key === key);
    let newFields = [];
    if (fieldToChange.type === 'tags') {
      newFields = fields.map(field => {
        if (field.key === key) {
          return {
            ...field,
            value: newValue
          };
        }
        return field;
      });
    } else {
      newFields = fields.map(field => {
        if (field.key === event.target.name) {
          return {
            ...field,
            value: event.target.value
          };
        }
        return field;
      });
    }
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
            handleChange={handleFieldChange}
          />
        )) }
      </div>
    </form>
  );
}

module.exports = DataEditPage;
