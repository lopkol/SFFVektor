'use strict';

const React = require('react');
const { MenuItem, TextField, Typography } = require('@mui/material');

function TextInput({ className, field, handleChange, inputWidth }) {
  return (
    <div className={className}>
      <Typography variant="subtitle2" sx={{ color: theme => theme.palette.grey[500] }}>
        {field.label}
      </Typography>
      <TextField
        sx={{ width: inputWidth }}
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
