'use strict';

const React = require('react');
const { Link, useParams } = require('react-router-dom');
const { IconButton, Box, Tooltip, Typography, makeStyles } = require('@material-ui/core');
const { ImBooks: BookListIcon } = require('react-icons/im');
const { GiWhiteBook: BookIcon } = require('react-icons/gi');
const { IoMdList: ListIcon, IoMdGrid: TableIcon, IoMdPeople: PeopleIcon } = require('react-icons/io');
const { AiOutlineRead: ReadingIcon } = require('react-icons/ai');

const { genreOptions } = require('../../../../options'); 

function getTitle(type, year = null, genre = null) {
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

const subpageNav = [
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  title: {
    margin: theme.spacing(2),
  },
  icon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
}));

function SubpageToolbar({ type }) {
  const { genre, year } = useParams();
  const title = getTitle(type, year, genre);
  console.log(title);
  
  const buttons = subpageNav.find(subpage => subpage.type === type).buttons;
  console.log(buttons);

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography
        align="center"
        className={classes.title}
        color="inherit"
        variant="h5"
      >
        { title }
      </Typography>
      { buttons.map(button => (
        <Tooltip title={ <p style={{ fontSize: '16px' }} >{ button.name }</p> } key={ button.id } className={classes.icon}>
          <IconButton component={ Link } to={ button.to } color="white">
            <button.icon style={{ fontSize: '24px' }} color="white"/>
          </IconButton>
        </Tooltip>
      )) }
    </Box>
  );

}

module.exports = SubpageToolbar;
