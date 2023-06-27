'use strict';

const React = require('react');
const { Button, TextField, Typography } = require('@mui/material');
const CustomAutocomplete = require('../custom-autocomplete');

function TagsInput({ className, field, handleChange, inputWidth }) {
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
          sx={{ marginTop: 1, color: theme => theme.palette.grey[500] }}
        >
          {field.label}
        </Typography>
        {field.onNew && (
          <Button
            sx={{ marginBottom: 0.5 }}
            variant="outlined"
            size="small"
            color="primary"
            onClick={field.onNew}
          >
            {field.newButtonLabel}
          </Button>
        )}
      </div>
      <CustomAutocomplete
        inputWidth={inputWidth}
        multiple
        name={field.key}
        options={field.options.map(option => option.id)}
        getOptionLabel={optionId => field.options.find(option => option.id === optionId).name}
        getOptionOnClick={optionId => field.options.find(option => option.id === optionId).onClick}
        value={field.value}
        onChange={(event, newValue) => handleChange(newValue)}
        filterSelectedOptions
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </div>
  );
}

module.exports = TagsInput;
