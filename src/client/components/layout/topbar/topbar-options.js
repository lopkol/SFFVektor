'use strict';

const { ImBooks: BookListIcon } = require('react-icons/im');
const { GiWhiteBook: BookIcon } = require('react-icons/gi');
const { IoMdList: ListIcon, IoMdGrid: TableIcon, IoMdPeople: PeopleIcon } = require('react-icons/io');
const { AiOutlineRead: ReadingIcon } = require('react-icons/ai');

const { genreOptions } = require('../../../../options'); 

function getTitle(type, year = null, genre = null) {
  if (type === 'home') {
    return '';
  }
  if (type === 'bookList') {
    const genreName = genreOptions.find(option => option.id === genre).name;
    return `${year} ${genreName}`;
  }

  if (type === 'yearAdmin') {
    return `${year} admin`;
  }

  if (type === 'admin') {
    return 'Admin';
  }
}

const topNavbar = [
  {
    type: 'home',
    buttons: []
  },
  {
    type: 'admin',
    buttons: [
      {
        id: 'users',
        name: 'Felhasználók',
        to: 'users',
        icon: PeopleIcon,
      },
      {
        id: 'bookLists',
        name: 'Jelöltlisták',
        to: 'book-lists',
        icon: BookListIcon
      }
    ]
  },
  {
    type: 'yearAdmin',
    buttons: [
      {
        id: 'bookLists',
        name: 'Jelöltlisták',
        to: 'book-lists',
        icon: BookListIcon
      },
      {
        id: 'books',
        name: 'Könyvek',
        to: 'books',
        icon: BookIcon
      }
    ]
  },
  {
    type: 'bookList',
    buttons: [
      {
        id: 'list',
        name: 'Lista nézet',
        to: 'list',
        icon: ListIcon
      },
      {
        id: 'reading',
        name: 'Olvasás szerint',
        to: 'reading',
        icon: ReadingIcon
      },
      {
        id: 'table',
        name: 'Táblázat nézet',
        to: 'table',
        icon: TableIcon
      }
    ]
  }
];

module.exports = {
  getTitle,
  topNavbar
};
