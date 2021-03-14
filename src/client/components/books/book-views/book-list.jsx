'use strict';

const React = require('react');
const { useParams } = require('react-router-dom');
const { DataGrid } = require('@material-ui/data-grid');

const { getBookList } = require('../../../services/api/book-lists/book-lists');

function authorsToString(authors) {
  if (authors) {
    return authors.slice(1).reduce((authorStr, newAuthor) => authorStr.concat(', ' + newAuthor.name), authors[0].name);
  }
} 

const bookTableColumns = [
  { field: 'id', headerName: 'ID', width: 300 },
  { field: 'authors', headerName: 'Szerző(k)', width: 400 },
  { field: 'title', headerName: 'Cím', width: 500 }
];

const juryTableColumns = [
  { field: 'id', headerName: 'ID', width: 300 },
  { field: 'name', headerName: 'Név', width: 300 },
  { field: 'molyUserName', headerName: 'Moly felhasználónév', width: 300 }
];

function BookList() {
  const { year, genre } = useParams();
  const [bookList, setBookList] = React.useState([]);
  const [books, setBooks] = React.useState([]);
  const [jury, setJury] = React.useState([]);

  React.useEffect(async () => {
    const bookListData = await getBookList({ year, genre });
    console.log(bookListData);
    setBookList(bookListData.bookList);
    setBooks(bookListData.books);
    setJury(bookListData.jury);
  }, []);

  return (
    <div>
      <p className="book-list larger-font">Jelöltlista adatai:</p>
      <ul>
        <li>év: { year }</li>
        <li>műfaj: { genre }</li>
        <li>moly lista url: { bookList.url }</li>
        <li>besorolásra váró polc url: { bookList.pendingUrl }</li>
      </ul>
      <p className="book-list larger-font">Könyvek:</p>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={ books.map(book => ({
            id: book.id,
            authors: authorsToString(book.authors),
            title: book.title
          })) }
          columns={ bookTableColumns }
          pageSize={25}
        />
      </div>
      <p className="book-list larger-font">Zsűritagok:</p>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid 
          rows={ jury.map(juryMember => ({
            id: juryMember.id,
            name: juryMember.name,
            molyUserName: juryMember.molyUserName
          })) }
          columns={ juryTableColumns }
          pageSize={20}
        />
      </div>
    </div>
  );
}

module.exports = BookList;
