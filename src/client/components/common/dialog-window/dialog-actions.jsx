'use strict';

const { DialogActions: MuiDialogActions, withStyles } = require('@material-ui/core');

const DialogActions = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

module.exports = DialogActions;
