'use strict';

const React = require('react');
const { Button, makeStyles } = require('@material-ui/core');
const TagsInput = require('./input-types/tags-input');
const TextInput = require('./input-types/text-input');
const BookAlternativeInput = require('./input-types/book-alternative-input');

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 400,
  },
  input: {
    margin: theme.spacing(2),
    width: '400px'
  },
  newButton: {
    //width: '400px',
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
}));

function DataInput({ field, handleChange }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      { (field.type === 'text' || field.type === 'select') && 
        <TextInput
          field={field}
          inputClass={classes.input}
          handleChange={handleChange}
        />
      }
      { field.type === 'tags' && 
        <TagsInput
          field={field}
          inputClass={classes.input}
          handleChange={handleChange}
        />
      }
      { field.type === 'alternatives' &&
        <BookAlternativeInput/>
      }
      { field.onNew && 
        <Button 
          className={classes.newButton}
          variant="outlined"
          size="small"
          color="primary"
          onClick={field.onNew}
        >
          { field.newButtonLabel }
        </Button>
      }
    </div>
  );
}

module.exports = DataInput;
