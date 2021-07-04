'use strict';

const React = require('react');
const { TextField } = require('@material-ui/core');
const CustomAutocomplete = require('../custom-autocomplete');

function TagsInput({ field, inputClass, handleChange }) {

  return (
    <CustomAutocomplete
      className={inputClass}
      multiple
      name={field.key}
      options={field.options.map(option => option.id)}
      getOptionLabel={optionId => field.options.find(option => option.id === optionId).name}
      getOptionOnClick={optionId => field.options.find(option => option.id === optionId).onClick}
      value={field.value}
      onChange={(event, newValue) => handleChange(newValue)}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          label={field.label}
        />
      )}
    />
  );
}

module.exports = TagsInput;
