'use strict';

const { assign } = require('lodash');
const React = require('react');
const { useParams } = require('react-router-dom');

const { Button, makeStyles } = require('@material-ui/core');
const BookListDetails = require('../../admin/book-lists/book-list-details');
const BookDetails = require('../../admin/books/book-details');
const BookWithMolyLinks = require('../../books/book-with-moly-links');
const CustomTable = require('../../common/data-display/custom-table');
const ReadingPlanStats = require('../../common/data-display/reading-plan-stats');

const { sortBooks, nameOfBookList } = require('../../../lib/useful-stuff');
const { getBookList } = require('../../../services/api/book-lists/book-lists');
const { getOwnReadingPlans, updateOwnReadingPlans } = require('../../../services/api/reading-plans/reading-plans');
const { readingPlanOptions } = require('../../../../options');

const columns = [
  { field: 'authorAndTitle', headerName: '', orderable: false },
  { field: 'readingPlan', headerName: 'Olvasási státusz', orderable: false }
];

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2)
  }
}));

function BookList() {
  const classes = useStyles();

  const { bookListId } = useParams();
  const [reloadData, setReloadData] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [bookListDetailsOpen, setBookListDetailsOpen] = React.useState(false);
  const [bookDetailsOpen, setBookDetailsOpen] = React.useState(false);
  const [selectedBookId, setSelectedBookId] = React.useState(null);
  const [isJuryMember, setIsJuryMember] = React.useState(false);

  React.useEffect(() => {
    setReloadData(true);
  }, [bookListId]);

  React.useEffect(() => {
    if (reloadData) {
      (async () => {
        const { books } = await getBookList(bookListId);
        const approvedBooks = books.filter(book => book.isApproved);
        const sortedBooks = sortBooks(approvedBooks);

        const readingPlans = await getOwnReadingPlans(bookListId);
        if (!readingPlans) {
          setIsJuryMember(false);
        } else {
          setIsJuryMember(true);
          const booksWithReadingPlans = sortedBooks.map(book => {
            const readingPlan = readingPlans.find(plan => plan.bookId === book.id);
            const readingPlanForBook = readingPlan ? readingPlan.status : 'noPlan';
            return assign(book, { readingPlan: readingPlanForBook });
          });
          setRows(booksWithReadingPlans.map(createRow));
        }
        setReloadData(false);
      })();
    }
  }, [reloadData]);

  const createRow = (book) => {
    return {
      id: book.id,
      fields: {
        authorAndTitle: <BookWithMolyLinks book={book}/>,
        readingPlan: readingPlanOptions.find(option => option.id === book.readingPlan).name
      },
      darkerBackground: book.isPending,
      onClick: () => handleOpenBookDetails(book.id)
    };
  };

  const handleOpenBookListDetails = () => {
    setBookListDetailsOpen(true);
  };

  const handleCloseBookListDetails = () => {
    setBookListDetailsOpen(false);
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
      { isJuryMember &&
        <ReadingPlanStats 
          min={{ book: 20, read: 10, plan: 15 }}
          max={{ book: 24, read: 13, plan: 16 }}
        />
      }
      <CustomTable title={nameOfBookList(bookListId)} rows={ rows } columns={ columns } rowSelection="click">
        <Button className={classes.button} variant="contained" color="primary" onClick={ () => handleOpenBookListDetails(bookListId) }>
          Részletek
        </Button>
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

module.exports = BookList;

