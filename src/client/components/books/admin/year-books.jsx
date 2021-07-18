'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');

const BookDetails = require('../../admin/books/book-details');
const BookWithMolyLinks = require('../book-with-moly-links');
const CustomTable = require('../../common/data-display/custom-table');

const { sortBooks } = require('../../../lib/useful-stuff');
const { getBooks } = require('../../../services/api/books/books');

const columns = [
  { field: 'authorAndTitle', headerName: '', orderable: false }
];

function YearBooks() {

  const { year } = useParams();
  const [reloadData, setReloadData] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [bookDetailsOpen, setBookDetailsOpen] = React.useState(false);
  const [selectedBookId, setSelectedBookId] = React.useState(null);

  React.useEffect(() => {
    if (reloadData) {
      (async () => {
        const books = await getBooks(year);
        const sortedBooks = sortBooks(books);
        
        setRows(sortedBooks.map(createRow));
        setReloadData(false);
      })();
    }
  }, [reloadData, year]);

  const createRow = (book) => {
    return {
      id: book.id,
      fields: {
        authorAndTitle: <BookWithMolyLinks book={book}/>
      },
      onClick: () => handleOpenBookDetails(book.id)
    };
  };

  const handleOpenBookDetails = (bookId) => {
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
      <CustomTable title={ `Könyvek ${year}` } rows={ rows } columns={ columns } rowSelection="click">
      </CustomTable>
      <BookDetails
        open={bookDetailsOpen}
        handleClose={handleCloseBookDetails}
        bookId={selectedBookId}
      />
    </div>
  );
}

module.exports = YearBooks;

