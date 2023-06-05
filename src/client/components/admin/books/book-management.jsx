'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');

const { Button, CircularProgress } = require('@mui/material');
const BookListDetails = require('../book-lists/book-list-details');
const BookDetails = require('./book-details');
const BookWithMolyLinks = require('../../books/book-with-moly-links');
const CustomTable = require('../../common/data-display/custom-table');

const { sortBooks, nameOfBookList } = require('../../../lib/useful-stuff');
const {
  getBookList,
  updateBookListFromMoly
} = require('../../../services/api/book-lists/book-lists');

const columns = [{ field: 'authorAndTitle', headerName: '', orderable: false }];

function BookManagement() {
  const { bookListId } = useParams();
  const [reloadData, setReloadData] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [bookListDetailsOpen, setBookListDetailsOpen] = React.useState(false);
  const [bookDetailsOpen, setBookDetailsOpen] = React.useState(false);
  const [selectedBookId, setSelectedBookId] = React.useState(null);

  React.useEffect(() => {
    setReloadData(true);
  }, [bookListId]);

  React.useEffect(() => {
    if (reloadData) {
      (async () => {
        const { books } = await getBookList(bookListId);
        const sortedBooks = sortBooks(books);

        setRows(sortedBooks.map(createRow));
        setReloadData(false);
      })();
    }
  }, [reloadData]);

  const createRow = book => {
    return {
      id: book.id,
      fields: {
        authorAndTitle: <BookWithMolyLinks book={book} />
      },
      darkerBackground: book.isPending,
      onClick: () => handleOpenBookDetails(book.id)
    };
  };

  const triggerUpdateFromMoly = async () => {
    setUpdating(true);
    await updateBookListFromMoly(bookListId);
    setUpdating(false);
    setReloadData(true);
  };

  const handleOpenBookListDetails = () => {
    setBookListDetailsOpen(true);
  };

  const handleCloseBookListDetails = () => {
    setBookListDetailsOpen(false);
  };

  const handleOpenBookDetails = bookId => {
    setSelectedBookId(bookId);
    setBookDetailsOpen(true);
  };

  const handleCloseBookDetails = () => {
    setBookDetailsOpen(false);
    setSelectedBookId(null);
    setReloadData(true);
  };

  return (
    <div>
      <CustomTable
        title={nameOfBookList(bookListId)}
        rows={rows}
        columns={columns}
        rowSelection="click"
      >
        <Button
          sx={{ margin: 2 }}
          variant="contained"
          color="primary"
          onClick={() => handleOpenBookListDetails(bookListId)}
        >
          Részletek
        </Button>
        {updating ? (
          <Button sx={{ margin: 2 }} variant="contained" color="primary" disabled>
            Frissítés
            <CircularProgress
              sx={{
                marginRight: 2.5,
                marginLeft: 4,
                color: theme => theme.palette.grey[600]
              }}
              size={20}
            />
          </Button>
        ) : (
          <Button
            sx={{ margin: 2 }}
            variant="contained"
            color="primary"
            onClick={triggerUpdateFromMoly}
          >
            Frissítés Molyról
          </Button>
        )}
      </CustomTable>
      <BookListDetails
        open={bookListDetailsOpen}
        handleClose={handleCloseBookListDetails}
        bookListId={bookListId}
      />
      <BookDetails
        open={bookDetailsOpen}
        handleClose={handleCloseBookDetails}
        bookId={selectedBookId}
      />
    </div>
  );
}

module.exports = BookManagement;
