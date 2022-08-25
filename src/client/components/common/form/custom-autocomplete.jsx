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
  const { getOptionLabel, getOptionOnClick, size, ChipProps, ...otherProps } = props;

  const renderTags = (value, getCustomizedTagProps) => (
    <div>
      { value.map((optionId, index) => (
        <Chip
          key={optionId}
          label={getOptionLabel(optionId)}
          size={size}
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
      noOptionsText="Nincs találat"
      getOptionLabel={getOptionLabel}
      {...otherProps}
    />
  );
}

module.exports = CustomAutocomplete;
