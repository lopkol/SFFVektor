'use strict';

const React = require('react');
const {
  MenuItem, 
  TextField, 
  makeStyles,
} = require('@material-ui/core');
//const { Autocomplete } = require('@material-ui/lab');
const CustomAutocomplete = require('./custom-autocomplete');

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 400,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    margin: theme.spacing(2),
    width: '400px'
  }
}));

function DataInput({ field, handleChange }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      { (field.type === 'text' || field.type === 'select') && 
        <TextField
          className={classes.input}
          name={field.key}
          label={field.label}
          value={field.value}
          select={field.type === 'select'}
          onChange={(event, newValue) => handleChange(event, field.key, newValue)}
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
      }
      { field.type === 'tags' && 
        <CustomAutocomplete
          className={classes.input}
          multiple
          name={field.key}
          options={field.options.map(option => option.id)}
          getOptionLabel={optionId => field.options.find(option => option.id === optionId).name}
          getOptionColor={optionId => field.options.find(option => option.id === optionId).color}
          getOptionOnClick={optionId => field.options.find(option => option.id === optionId).onClick}
          value={field.value}
          onChange={(event, newValue) => handleChange(event, field.key, newValue)}
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
      }
    </div>
  );
}

module.exports = DataInput;
