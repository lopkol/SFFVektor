'use strict';

const React = require('react');
const { Button, Dialog, DialogActions, DialogTitle } = require('@material-ui/core');

function UnsavedDataAlert({ open, handleCancel, handleOk }) {
  return (
    <Dialog open={open} onClose={handleCancel} aria-labelledby="unsaved-data-alert">
      <DialogTitle id="unsaved-data-dialog-title">
        El nem mentett változtatásaid vannak. Biztos elhagyod az oldalt?
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Mégse
        </Button>
        <Button onClick={handleOk} color="primary" autoFocus>
          Igen
        </Button>
      </DialogActions>
    </Dialog>
  );
}

module.exports = UnsavedDataAlert;
