'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');
const { DataGrid } = require('@material-ui/data-grid');

const { getBookList } = require('../../../services/api/book-lists/book-lists');

function BookList() {
  const { year, genre } = useParams();
  const [bookList, setBookList] = React.useState([]);
  const [books, setBooks] = React.useState([]);

  React.useEffect(async () => {
    const bookListData = await getBookList({ year, genre });
    setBookList(bookListData);
    setBooks(bookListData.books);
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 400 },
    { field: 'author', headerName: 'Szerző', width: 150 },
    { field: 'title', headerName: 'Cím', width: 200 }
  ];

  return (
    <div>
      <p>Jelöltlista adatai:</p>
      <ul>
        <li>év: { year }</li>
        <li>műfaj: { genre }</li>
        <li>moly lista url: { bookList.url }</li>
        <li>besorolásra váró polc url: { bookList.pendingUrl }</li>
      </ul>
      <p>Könyvek:</p>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid 
          rows={ books.map(book => ({
            id: book.id,
            author: book.author.name,
            title: book.title
          })) } 
          columns={ columns } 
          pageSize={25} 
        />
      </div>
    </div>
  );
}

module.exports = BookList;
