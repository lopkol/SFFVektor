'use strict';

const { GiWhiteBook: BookIcon } = require('react-icons/gi');
const { VscChecklist: ListIcon } = require('react-icons/vsc');
const { IoMdGrid: TableIcon, IoMdPeople: PeopleIcon, IoMdSettings: SettingsIcon } = require('react-icons/io');
const { AiOutlineRead: ReadingIcon } = require('react-icons/ai');

const { genreOptions } = require('../../../../options'); 
const { yearWithSuffix } = require('../../../../../test-helpers/generate-data');

function getTitle(type, year = null, genre = null) {
  if (type === 'home') {
    return '';
  }
  if (type === 'bookList') {
    const genreName = genreOptions.find(option => option.id === genre).name;
    return `${year} ${genreName}`;
  }

  if (type === 'yearBooks') {
    return `${yearWithSuffix(year, 'es')} könyvek`;
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
        icon: BookIcon
      }
    ]
  },
  {
    type: 'yearBooks',
    buttons: []
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
      },
      {
        id: 'admin',
        name: 'Admin',
        to: 'admin',
        icon: SettingsIcon
      }
    ]
  }
];

module.exports = {
  getTitle,
  topNavbar
};