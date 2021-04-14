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
      <p className="book-list larger-font">Jelöltlista adatai:</p>
      <ul>
        <li>év: { bookList.year }</li>
        <li>műfaj: { bookList.genre }</li>
        <li>moly lista url: 
          <a href={ bookList.url } target="_blank" rel="noopener noreferrer">
            { bookList.url }
          </a>
        </li>
        <li>besorolásra váró polc url: 
          <a href={ bookList.pendingUrl } target="_blank" rel="noopener noreferrer">
            { bookList.pendingUrl }
          </a>
        </li>
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
            molyUsername: juryMember.molyUsername
          })) }
          columns={ juryTableColumns }
          pageSize={20}
        />
      </div>
    </div>
  );
}

module.exports = BookList;
