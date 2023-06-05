'use strict';

const React = require('react');
const { makeStyles } = require('@mui/styles');
const TagsInput = require('./input-types/tags-input');
const TextInput = require('./input-types/text-input');
const BookAlternativeInput = require('./input-types/book-alternative-input');

const useStyles = makeStyles(theme => ({
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
    <div style={{ minWidth: '400px' }}>
      {['text', 'select', 'url'].includes(field.type) && (
        <TextInput
          className={classes.fieldContainer}
          field={field}
          handleChange={handleChange}
          inputClass={classes.input}
          labelClass={classes.label}
        />
      )}
      {field.type === 'tags' && (
        <TagsInput
          className={classes.fieldContainer}
          field={field}
          handleChange={handleChange}
          inputClass={classes.input}
          labelClass={classes.label}
        />
      )}
      {field.type === 'alternatives' && (
        <BookAlternativeInput
          className={classes.fieldContainer}
          field={field}
          handleChange={handleChange}
          labelClass={classes.label}
        />
      )}
    </div>
  );
}

module.exports = DataInput;
