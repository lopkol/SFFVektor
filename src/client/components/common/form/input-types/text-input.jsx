'use strict';

const React = require('react');
const { MenuItem, TextField, Typography } = require('@material-ui/core');

function TextInput({ className, field, handleChange, inputClass, labelClass }) {
  return (
    <div className={className}>
      <Typography variant="subtitle2" className={labelClass}>
        {field.label}
      </Typography>
      <TextField
        className={inputClass}
        name={field.key}
        value={field.value}
        select={field.type === 'select'}
        onChange={event => handleChange(event.target.value)}
        variant="outlined"
        disabled={field.immutable}
      >
        {field.type === 'select' &&
          field.options.map(option => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
      </TextField>
    </div>
  );
}

module.exports = TextInput;
