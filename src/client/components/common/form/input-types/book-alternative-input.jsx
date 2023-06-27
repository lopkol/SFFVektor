'use strict';

const React = require('react');
const { Box, Button, TextField, Typography } = require('@mui/material');
const { Delete: DeleteIcon } = require('@mui/icons-material');

function BookAlternativeInput({ className, field, handleChange }) {
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between'
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ marginTop: 1.5, color: theme => theme.palette.grey[500] }}
        >
          Alternatívák
        </Typography>
        <Button
          sx={{ marginBottom: 1 }}
          variant="outlined"
          color="primary"
          size="small"
          onClick={newAlternative}
        >
          Új alternatíva
        </Button>
      </div>
      {field.value.map((alternative, altIndex) => (
        <div style={{ display: 'flex', flexDirection: 'column' }} key={altIndex}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextField
              sx={{ width: '250px', marginBottom: 1 }}
              variant="outlined"
              size="small"
              name={altIndex}
              value={alternative.name}
              onChange={event => handleNameChange({ index: altIndex, value: event.target.value })}
            />
            <Button
              sx={{ marginBottom: 1 }}
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
              sx={{ marginBottom: 1, borderRadius: '20px', minWidth: '40px' }}
            >
              <DeleteIcon size={20} />
            </Button>
          </div>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: 2 }}>
            {alternative.urls.map((url, urlIndex) => (
              <div
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                key={urlIndex}
              >
                <TextField
                  sx={{ width: '320px', marginBottom: 1 }}
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
                  sx={{ marginBottom: 1, borderRadius: '20px', minWidth: '40px' }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </Box>
        </div>
      ))}
    </div>
  );
}

module.exports = BookAlternativeInput;
