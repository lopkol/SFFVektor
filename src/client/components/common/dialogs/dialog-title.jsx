'use strict';

const React = require('react');
const { DialogTitle: MuiDialogTitle, IconButton, Typography } = require('@mui/material');
const { Close: CloseIcon } = require('@mui/icons-material');

const DialogTitle = ({ children, onClose, ...otherProps }) => {
  return (
    <MuiDialogTitle sx={{ margin: 0, padding: 2 }} component="div" {...otherProps}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          sx={{ position: 'absolute', right: 1, top: 1, color: theme => theme.palette.grey[500] }}
          onClick={onClose}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

module.exports = DialogTitle;
