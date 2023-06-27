'use strict';

const React = require('react');
const TagsInput = require('./input-types/tags-input');
const TextInput = require('./input-types/text-input');
const BookAlternativeInput = require('./input-types/book-alternative-input');
const { styled } = require('@mui/material/styles');

const inputWidth = '400px';

const InputWrapper = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  marginTop: theme.spacing(2),
  minWidth: inputWidth
}));

function DataInput({ field, handleChange }) {
  return (
    <InputWrapper>
      {['text', 'select', 'url'].includes(field.type) && (
        <TextInput field={field} handleChange={handleChange} inputWidth={inputWidth} />
      )}
      {field.type === 'tags' && (
        <TagsInput field={field} handleChange={handleChange} inputWidth={inputWidth} />
      )}
      {field.type === 'alternatives' && (
        <BookAlternativeInput field={field} handleChange={handleChange} />
      )}
    </InputWrapper>
  );
}

module.exports = DataInput;
