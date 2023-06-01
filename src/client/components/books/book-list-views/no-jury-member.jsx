'use strict';

const React = require('react');
const { Button, makeStyles } = require('@material-ui/core');
const { nameOfBookList } = require('../../../lib/useful-stuff');
const CustomTable = require('../../common/data-display/custom-table');

const columns = [{ field: 'column', headerName: '', orderable: false }];
const rows = [
  {
    id: 1,
    fields: {
      column: 'Nem vagy zsűritag ennél a jelöltlistánál.'
    }
  }
];

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2)
  }
}));

function NoJuryMemberView({ bookListId, handleOpenBookListDetails }) {
  const classes = useStyles();
  return (
    <CustomTable title={nameOfBookList(bookListId)} rows={rows} columns={columns} noPagination rowSelection="none">
      <Button className={classes.button} variant="contained" color="primary" onClick={handleOpenBookListDetails}>
        Részletek
      </Button>
    </CustomTable>
  );
}

module.exports = NoJuryMemberView;
