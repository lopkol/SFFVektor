'use strict';

const React = require('react');
const { styled } = require('@mui/material/styles');
const CustomTable = require('./custom-table');
const { capitalize } = require('../../../lib/useful-stuff');
const { readingLimit } = require('../../../../options');

const columns = [
  { field: 'header', headerName: '', orderable: false },
  { field: 'book', headerName: 'Könyvek', orderable: false, align: 'center' },
  { field: 'plan', headerName: 'Tervezett', orderable: false, align: 'center' },
  { field: 'read', headerName: 'Olvasott', orderable: false, align: 'center' }
];

const StyledTable = styled(CustomTable)({ maxWidth: '410px' });

function ReadingPlanStats(props) {
  const { min, max } = props;

  const computeRow = (type, row) => ({
    id: type,
    fields: {
      header: capitalize(type),
      book: row.book,
      read: <font color={row.read >= readingLimit(row.book) ? 'green' : 'red'}>{row.read}</font>,
      plan: <font color={row.plan >= readingLimit(row.book) ? 'green' : 'red'}>{row.plan}</font>
    }
  });

  return (
    <StyledTable
      columns={columns}
      rows={[computeRow('min', min), computeRow('max', max)]}
      rowSelection="none"
      noToolbar={true}
      noPagination={true}
    />
  );
}

module.exports = ReadingPlanStats;
