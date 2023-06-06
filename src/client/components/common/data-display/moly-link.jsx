'use strict';

const React = require('react');
const { styled } = require('@mui/material/styles');

const StyledLink = styled('a')(({ theme }) => ({
  display: 'inline-block',
  backgroundColor: '#cfdfef',
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  marginLeft: theme.spacing(1),
  color: '#2f5f8f',
  fontWeight: 700,
  '&:hover': {
    backgroundColor: theme.palette.common.white
  }
}));

function MolyLink({ url }) {
  return (
    <StyledLink href={url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
      m
    </StyledLink>
  );
}

module.exports = MolyLink;
