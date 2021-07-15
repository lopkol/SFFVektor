'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');
const { DataGrid } = require('@material-ui/data-grid');

const { getBookList } = require('../../../services/api/book-lists/book-lists');

const bookTableColumns = [
  { field: 'id', headerName: 'ID', width: 300 },
  { field: 'authors', headerName: 'Szerző(k)', width: 400 },
  { field: 'title', headerName: 'Cím', width: 500 }
];

const juryTableColumns = [
  { field: 'id', headerName: 'ID', width: 300 },
  { field: 'name', headerName: 'Név', width: 300 },
  { field: 'molyUsername', headerName: 'Moly felhasználónév', width: 300 }
];

function BookList() {
  const { bookListId } = useParams();
  const [bookList, setBookList] = React.useState([]);
  const [books, setBooks] = React.useState([]);
  const [jury, setJury] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const bookListData = await getBookList(bookListId);
      console.log(bookListData);
      setBookList(bookListData.bookList);
      setBooks(bookListData.books);
      setJury(bookListData.jury);
    })();
  }, []);

  return (
    <div>
      <p>jelöltlista (a felhasználó olvasásaival)</p>
    </div>
  );
}

module.exports = BookList;
