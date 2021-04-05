'use strict';

const React = require('react');
const {
  MenuItem, 
  TextField, 
  makeStyles,
} = require('@material-ui/core');

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: theme.spacing(2),
    minWidth: '400px'
  }
}));

function DataEditPage(props) {
  const classes = useStyles();
  const { data, onDataChange } = props;

  function handleChange(event) {
    onDataChange({ key: event.target.name, value: event.target.value });
  }

  return (
    <form noValidate autoComplete="off">
      <div className={classes.container}>
        { data.map(field => (
          <TextField
            className={classes.input}
            name={field.key}
            key={field.key}
            label={field.label}
            value={field.value}
            select={field.select}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
          >
            { field.select && field.options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            )) }
          </TextField>
        )) }
      </div>
    </form>
  );
}

module.exports = DataEditPage;
