'use strict';

const React = require('react');
const { Button } = require('@mui/material');
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

function NoJuryMemberView({ bookListId, handleOpenBookListDetails }) {
  return (
    <CustomTable
      title={nameOfBookList(bookListId)}
      rows={rows}
      columns={columns}
      noPagination
      rowSelection="none"
    >
      <Button
        sx={{ margin: 2 }}
        variant="contained"
        color="primary"
        onClick={handleOpenBookListDetails}
      >
        Részletek
      </Button>
    </CustomTable>
  );
}

module.exports = NoJuryMemberView;
