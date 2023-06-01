'use strict';

const React = require('react');
const classNames = require('classnames');
const { Button, TextField, Typography, makeStyles } = require('@material-ui/core');
const { Delete: DeleteIcon } = require('@material-ui/icons');

const useStyles = makeStyles(theme => ({
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  altContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  altTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  altNameInput: {
    width: '250px',
    marginBottom: theme.spacing(1)
  },
  urlListContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2)
  },
  urlFieldContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  urlInput: {
    width: '320px',
    marginBottom: theme.spacing(1)
  },
  label: {
    marginTop: theme.spacing(1.5)
  },
  button: {
    marginBottom: theme.spacing(1)
  },
  deleteButton: {
    marginBottom: theme.spacing(1),
    borderRadius: '20px',
    minWidth: '40px'
  }
}));

function BookAlternativeInput({ className, field, handleChange, labelClass }) {
  const classes = useStyles();

  function newAlternative() {
    let newValue = JSON.parse(JSON.stringify(field.value));
    newValue.push({
      id: null,
      name: '',
      urls: ['']
    });
    handleChange(newValue);
  }

  function deleteAlternative(index) {
    let newValue = JSON.parse(JSON.stringify(field.value));
    newValue.splice(index, 1);
    handleChange(newValue);
  }

  function handleNameChange({ index, value }) {
    let newValue = JSON.parse(JSON.stringify(field.value));
    newValue[index].name = value;
    handleChange(newValue);
  }

  function newUrl(altIndex) {
    let newValue = JSON.parse(JSON.stringify(field.value));
    newValue[altIndex].urls.push('');
    handleChange(newValue);
  }

  function deleteUrl({ altIndex, index }) {
    let newValue = JSON.parse(JSON.stringify(field.value));
    newValue[altIndex].urls.splice(index, 1);
    handleChange(newValue);
  }

  function handleUrlChange({ altIndex, index, value }) {
    let newValue = JSON.parse(JSON.stringify(field.value));
    newValue[altIndex].urls[index] = value;
    handleChange(newValue);
  }

  return (
    <div className={className}>
      <div className={classes.titleContainer}>
        <Typography variant="subtitle2" className={classNames(labelClass, classes.label)}>
          Alternatívák
        </Typography>
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          size="small"
          onClick={newAlternative}
        >
          Új alternatíva
        </Button>
      </div>
      {field.value.map((alternative, altIndex) => (
        <div className={classes.altContainer} key={altIndex}>
          <div className={classes.altTitleContainer}>
            <TextField
              className={classes.altNameInput}
              variant="outlined"
              size="small"
              name={altIndex}
              value={alternative.name}
              onChange={event => handleNameChange({ index: altIndex, value: event.target.value })}
            />
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => newUrl(altIndex)}
            >
              Új link
            </Button>
            <Button
              onClick={() => deleteAlternative(altIndex)}
              variant="outlined"
              size="small"
              color="primary"
              className={classes.deleteButton}
            >
              <DeleteIcon size={20} />
            </Button>
          </div>
          <div className={classes.urlListContainer}>
            {alternative.urls.map((url, urlIndex) => (
              <div className={classes.urlFieldContainer} key={urlIndex}>
                <TextField
                  className={classes.urlInput}
                  variant="outlined"
                  size="small"
                  name={urlIndex}
                  value={url}
                  onChange={event =>
                    handleUrlChange({ altIndex, index: urlIndex, value: event.target.value })
                  }
                />
                <Button
                  onClick={() => deleteUrl({ altIndex, index: urlIndex })}
                  variant="outlined"
                  size="small"
                  color="primary"
                  className={classes.deleteButton}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

module.exports = BookAlternativeInput;
