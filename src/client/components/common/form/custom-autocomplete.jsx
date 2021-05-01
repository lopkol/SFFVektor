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
  const { getOptionLabel, getOptionColor, getOptionOnClick, size, ChipProps } = props;

  const renderTags = (value, getCustomizedTagProps) => (
    <div>
      { value.map((optionId, index) => (
        <Chip
          key={optionId}
          label={getOptionLabel(optionId)}
          size={size}
          color={getOptionColor(optionId) || 'default'}
          onClick={getOptionOnClick(optionId)}
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
