'use strict';

const { DialogContent: MuiDialogContent, withStyles } = require('@material-ui/core');

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}))(MuiDialogContent);

module.exports = DialogContent;
