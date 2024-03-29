'use strict';

const React = require('react');
const classNames = require('classnames');
const {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  lighten
} = require('@mui/material');
const { styled } = require('@mui/material/styles');

function ascendingComparator(a, b, orderBy) {
  if (orderBy === null) {
    return 0;
  }
  return a.fields[orderBy].localeCompare(b.fields[orderBy]);
}

function getComparator(order, orderBy) {
  return order === 'asc'
    ? (a, b) => ascendingComparator(a, b, orderBy)
    : (a, b) => -ascendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function EnhancedTableHead(props) {
  const { columns, order, orderBy, onRequestSort, withCheckbox } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {withCheckbox && <TableCell padding="checkbox" />}
        {columns.map(column => (
          <TableCell
            sx={{ fontWeight: theme => theme.typography.fontWeightMedium, fontSize: '1.1rem' }}
            key={column.field}
            align={column.align}
            padding={column.padding}
            sortDirection={orderBy === column.field ? order : false}
          >
            {column.orderable ? (
              <TableSortLabel
                active={orderBy === column.field}
                direction={orderBy === column.field ? order : 'asc'}
                onClick={createSortHandler(column.field)}
              >
                {column.headerName}
              </TableSortLabel>
            ) : (
              <span>{column.headerName}</span>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  paddingX: 0,
  '&.highlighted':
    theme.palette.mode === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        }
}));

const Container = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
});

function TableToolbar({ title, numSelected, withCheckbox, children }) {
  const highlighted = withCheckbox && numSelected > 0;

  return (
    <StyledToolbar className={highlighted ? 'highlighted' : ''}>
      {withCheckbox && numSelected > 0 ? (
        <Typography sx={{ margin: 2 }} color="inherit" variant="subtitle1" component="div">
          {numSelected} kijelölt sor
        </Typography>
      ) : (
        <Container>
          <Typography sx={{ margin: 2 }} variant="h6" id="tableTitle" component="div">
            {title}
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'row' }}>{children}</div>
        </Container>
      )}
    </StyledToolbar>
  );
}

const columnDefaultProps = {
  component: 'td',
  align: 'left',
  padding: 'normal',
  orderable: false,
  hiddenButton: false
};

const CustomTableRoot = styled('div')(({ theme }) => ({
  width: '100%',
  '& .selectableRow': {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: lighten(theme.palette.secondary.light, 0.85)
    }
  },
  '& .darkerRow': {
    backgroundColor: theme.palette.action.hover
  },
  '& .visuallyHidden': {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}));

function CustomTable(props) {
  const { title, columns, rows, className, rowSelection, children, noPagination, noToolbar } =
    props;
  const columnsWithProps = columns.map(column => ({ ...columnDefaultProps, ...column }));

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(null);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(-1);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, id) => {
    if (rowSelection === 'click') {
      const currentRow = rows.find(row => row.id === id);
      currentRow.onClick();
      return;
    } else if (rowSelection === 'checkbox') {
      const selectedIndex = selectedRows.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedRows, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedRows.slice(1));
      } else if (selectedIndex === selectedRows.length - 1) {
        newSelected = newSelected.concat(selectedRows.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedRows.slice(0, selectedIndex),
          selectedRows.slice(selectedIndex + 1)
        );
      }

      setSelectedRows(newSelected);
      return;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = rowId => selectedRows.indexOf(rowId) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  const pageStart = page * rowsPerPage;
  const pageEnd = rowsPerPage === -1 ? rows.length : page * rowsPerPage + rowsPerPage;

  return (
    <CustomTableRoot style={{ width: '100%' }} className={className}>
      <Paper sx={{ width: '100%', marginBottom: 2 }}>
        {!noToolbar && (
          <TableToolbar
            title={title}
            withCheckbox={rowSelection === 'checkbox'}
            numSelected={selectedRows.length}
          >
            {children}
          </TableToolbar>
        )}
        <TableContainer>
          <Table
            sx={{ minWidth: '400px' }}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              columns={columnsWithProps}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              withCheckbox={rowSelection === 'checkbox'}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(pageStart, pageEnd)
                .map(row => {
                  const isItemSelected = isSelected(row.id);

                  return (
                    <TableRow
                      className={classNames(
                        rowSelection !== 'none' && 'selectableRow',
                        row.darkerBackground && 'darkerRow'
                      )}
                      onClick={event => handleClick(event, row.id)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      {rowSelection === 'checkbox' && (
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} />
                        </TableCell>
                      )}
                      {columnsWithProps.map(column => {
                        const cellProps = {
                          align: column.align,
                          padding: column.padding,
                          component: column.component
                        };
                        if (column.component === 'th') {
                          cellProps.scope = 'row';
                        }

                        return (
                          <TableCell key={`${row.id}_${column.field}`} {...cellProps}>
                            {row.fields[column.field]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!noPagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 30, 50, { value: -1, label: 'Összes' }]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Oldalméret:"
            labelDisplayedRows={({ from, to, count }) => {
              if (to !== -1) {
                return `${from}-${to} / ${count}`;
              } else {
                return `${from}-${count} / ${count}`;
              }
            }}
          />
        )}
      </Paper>
    </CustomTableRoot>
  );
}

module.exports = CustomTable;
