'use strict';

const React = require('react');
const DataInput = require('./data-input');

function DataEditPage({ data, handleChange }) {
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {data.map(field => (
          <DataInput
            name={field.key}
            key={field.key}
            field={field}
            handleChange={newValue => handleFieldChange({ key: field.key, value: newValue })}
          />
        ))}
      </div>
    </form>
  );
}

module.exports = DataEditPage;
