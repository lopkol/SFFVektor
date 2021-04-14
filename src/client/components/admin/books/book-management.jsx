'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');

const { Button, CircularProgress, makeStyles } = require('@material-ui/core');
const BookListDetails = require('../book-lists/book-list-details');
const CustomTable = require('../../common/custom-table');

const { sortBooks, getAuthorAndTitle, nameOfBookList } = require('../../../lib/useful-stuff');
const { getBookList, updateBookListFromMoly } = require('../../../services/api/book-lists/book-lists');

const columns = [
  { field: 'authorAndTitle', headerName: '', orderable: false }
];

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2)
  },
  circularProgress: {
    marginRight: theme.spacing(2.5),
    marginLeft: theme.spacing(4),
    color: theme.palette.grey[600]
  }
}));

function BookManagement() {
  const classes = useStyles();

  const { bookListId } = useParams();
  const [reloadData, setReloadData] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [bookListDetailsOpen, setBookListDetailsOpen] = React.useState(false);
  //const [bookDetailsOpen, setBookDetailsOpen] = React.useState(false);

  React.useEffect(() => {
    if (reloadData) {
      (async () => {
        const { books } = await getBookList(bookListId);
        const sortedBooks = sortBooks(books);
        console.log(sortedBooks);
        setRows(sortedBooks.map(createRow));
        setReloadData(false);
      })();
    }
  }, [reloadData, bookListId]);

  const createRow = (book) => {
    return {
      id: book.id,
      fields: {
        authorAndTitle: getAuthorAndTitle(book)
      },
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

  const handleOpenBookDetails = (bookId) => {
    console.log(`book id: ${bookId}`);
  };

  /*const handleCloseBookDetails = () => {

  };*/

  return (
    <div>
      <CustomTable title={nameOfBookList(bookListId)} rows={ rows } columns={ columns } rowSelection="click">
        <Button className={classes.button} variant="contained" color="primary" onClick={ () => handleOpenBookListDetails(bookListId) }>
          Részletek
        </Button>
        { updating ?
          <Button className={classes.button} variant="contained" color="primary" disabled>
            Frissítés 
            <CircularProgress className={classes.circularProgress} size={20}/>
          </Button>
          :
          <Button className={classes.button} variant="contained" color="primary" onClick={triggerUpdateFromMoly} >
            Frissítés Molyról
          </Button> 
        }
      </CustomTable>
      <BookListDetails 
        open={bookListDetailsOpen} 
        handleClose={handleCloseBookListDetails} 
        bookListId={bookListId} 
      />
    </div>
  );
}

module.exports = BookManagement;
