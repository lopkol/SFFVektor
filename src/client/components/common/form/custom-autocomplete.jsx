'use strict';

const React = require('react');
const { Chip } = require('@material-ui/core');
const { Autocomplete } = require('@material-ui/lab');

/*const useStyles = makeStyles(() => ({
  chips: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start'
  }
}));*/

function CustomAutocomplete(props) {
  //const classes = useStyles();
  const { getOptionLabel, size, ChipProps } = props;

  const renderTags = (value, getCustomizedTagProps) => (
    <div>
      { value.map((option, index) => (
        <Chip
          key={option.id}
          label={getOptionLabel(option)}
          size={size}
          color={option.color || 'default'}
          onClick={option.onClick}
          {...getCustomizedTagProps({ index })}
          {...ChipProps}
        />
      )) }
    </div>
  );

  return (
    <Autocomplete 
      renderTags={renderTags}
      {...props}
    />
  );
}

module.exports = CustomAutocomplete;
