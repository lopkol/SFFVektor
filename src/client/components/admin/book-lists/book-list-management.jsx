'use strict';

const React = require('react');
const { Button } = require('@mui/material');
const { makeStyles } = require('@mui/styles');
const BookListDetails = require('./book-list-details');
const CustomTable = require('../../common/data-display/custom-table');

const { genreOptions } = require('../../../../options');
const UserInterface = require('../../../lib/ui-context');

const columns = [
  { field: 'year', headerName: 'Év', orderable: true, component: 'th' },
  { field: 'genre', headerName: 'Műfaj', orderable: true },
  { field: 'url', headerName: 'Moly lista link', orderable: true }
];

const useStyles = makeStyles({
  molyLink: {
    '&:hover': {
      textDecoration: 'underline'
    }
  }
});

function BookListManagement() {
  const classes = useStyles();

  const [rows, setRows] = React.useState([]);
  const [bookListDetailsOpen, setBookListDetailsOpen] = React.useState(false);
  const [selectedBookListId, setSelectedBookListId] = React.useState(null);

  const { bookLists, changeUIData } = React.useContext(UserInterface);

  React.useEffect(() => {
    const createRow = bookList => {
      const genreName = genreOptions.find(option => option.id === bookList.genre).name;
      return {
        id: bookList.id,
        fields: {
          year: bookList.year,
          genre: genreName,
          url: (
            <a
              className={classes.molyLink}
              href={bookList.url}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
            >
              {bookList.url}
            </a>
          )
        },
        onClick: () => handleOpenBookListDetails(bookList.id)
      };
    };
    setRows(bookLists.map(createRow));
  }, [bookLists]);

  const handleOpenBookListDetails = bookListId => {
    setSelectedBookListId(bookListId);
    setBookListDetailsOpen(true);
  };

  const handleCloseBookListDetails = () => {
    setBookListDetailsOpen(false);
    setSelectedBookListId(null);
    changeUIData();
  };

  return (
    <div>
      <CustomTable title="Jelöltlisták" rows={rows} columns={columns} rowSelection="click">
        <Button
          sx={{ margin: 2 }}
          variant="contained"
          color="primary"
          onClick={() => handleOpenBookListDetails(null)}
        >
          Új jelöltlista
        </Button>
      </CustomTable>
      <BookListDetails
        open={bookListDetailsOpen}
        handleClose={handleCloseBookListDetails}
        bookListId={selectedBookListId}
        changeBookListId={newId => setSelectedBookListId(newId)}
      />
    </div>
  );
}

module.exports = BookListManagement;
