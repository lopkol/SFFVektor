'use strict';

const React = require('react');
const { Chip } = require('@mui/material');
const { Autocomplete } = require('@mui/lab');

function CustomAutocomplete(props) {
  const { getOptionLabel, getOptionOnClick, size, inputWidth, ChipProps, ...otherProps } = props;

  const renderTags = (value, getCustomizedTagProps) => (
    <div>
      {value.map((optionId, index) => (
        <Chip
          key={optionId}
          label={getOptionLabel(optionId)}
          size={size}
          onClick={getOptionOnClick(optionId)}
          {...getCustomizedTagProps({ index })}
          {...ChipProps}
        />
      ))}
    </div>
  );

  return (
    <Autocomplete
      renderTags={renderTags}
      noOptionsText="Nincs találat"
      getOptionLabel={getOptionLabel}
      sx={{ width: inputWidth }}
      {...otherProps}
    />
  );
}

module.exports = CustomAutocomplete;
