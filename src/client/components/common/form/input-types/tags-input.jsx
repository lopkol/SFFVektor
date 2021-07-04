'use strict';

const React = require('react');
const classNames = require('classnames');
const { Button, TextField, Typography, makeStyles } = require('@material-ui/core');
const CustomAutocomplete = require('../custom-autocomplete');

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  button: {
    marginBottom: theme.spacing(0.5)
  },
  label: {
    marginTop: theme.spacing(1)
  }
}));

function TagsInput({ className, field, handleChange, inputClass, labelClass }) {
  const classes = useStyles();

  return (
    <div className={className}>
      <div className={classes.titleContainer}>
        <Typography variant="subtitle2" className={classNames(labelClass, classes.label)}>
          {field.label}
        </Typography>
        { field.onNew && 
          <Button 
            className={classes.button}
            variant="outlined"
            size="small"
            color="primary"
            onClick={field.onNew}
          >
            { field.newButtonLabel }
          </Button>
        }
      </div>
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
            variant="outlined"
          />
        )}
      />
    </div>
  );
}

module.exports = TagsInput;
