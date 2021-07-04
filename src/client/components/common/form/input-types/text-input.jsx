'use strict';

const React = require('react');
const { MenuItem, TextField } = require('@material-ui/core');

function TextInput ({ field, inputClass, handleChange }) {

  return (
    <TextField
      className={inputClass}
      name={field.key}
      label={field.label}
      value={field.value}
      select={field.type === 'select'}
      onChange={(event) => handleChange(event.target.value)}
      InputLabelProps={{
        shrink: true
      }}
      variant="outlined"
    >
      { field.type === 'select' && field.options.map((option) => (
        <MenuItem key={option.id} value={option.id}>
          {option.name}
        </MenuItem>
      )) }
    </TextField> 
  );
}

module.exports = TextInput;
