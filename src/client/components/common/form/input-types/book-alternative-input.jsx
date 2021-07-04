'use strict';

const React = require('react');
const {
  Button,
  List,
  ListItem,
  TextField,
  Typography,
  makeStyles
} = require('@material-ui/core');

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    minWidth: '400px'
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  altContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  altTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  urlListContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  urlFieldContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  label: {
    color: theme.palette.grey[500]
  }
}));

function BookAlternativeInput(props) {
  const classes = useStyles();

  function newAlternative () {
    console.log('new alt');
  }

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography variant="subtitle2" className={classes.label}>
          Alternatívák
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={newAlternative}
        >
          Új alternatíva
        </Button>
      </div>
    </div>
  );
}

module.exports = BookAlternativeInput;
