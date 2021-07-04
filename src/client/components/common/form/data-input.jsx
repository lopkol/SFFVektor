'use strict';

const React = require('react');
const { makeStyles } = require('@material-ui/core');
const TagsInput = require('./input-types/tags-input');
const TextInput = require('./input-types/text-input');
const BookAlternativeInput = require('./input-types/book-alternative-input');

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 400,
  },
  input: {
    width: '400px'
  },
  label: {
    color: theme.palette.grey[500]
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    minWidth: '400px'
  }
}));

function DataInput({ field, handleChange }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      { (field.type === 'text' || field.type === 'select') && 
        <TextInput
          className={classes.fieldContainer}
          field={field}
          handleChange={handleChange}
          inputClass={classes.input}
          labelClass={classes.label}
        />
      }
      { field.type === 'tags' && 
        <TagsInput
          className={classes.fieldContainer}
          field={field}
          handleChange={handleChange}
          inputClass={classes.input}
          labelClass={classes.label}
        />
      }
      { field.type === 'alternatives' &&
        <BookAlternativeInput
          className={classes.fieldContainer}
          field={field}
          handleChange={handleChange}
          inputClass={classes.input}
          labelClass={classes.label}
        />
      }
    </div>
  );
}

module.exports = DataInput;
