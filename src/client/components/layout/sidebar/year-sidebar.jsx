'use strict';

const React = require('react');
const { Box, Button, Collapse, List, makeStyles } = require('@material-ui/core');
const { ChevronRight: ChevronRightIcon, Settings: SettingsIcon, Today: CalendarIcon } = require('@material-ui/icons');
const { FaRobot: RobotIcon, FaDragon: DragonIcon } = require('react-icons/fa');

const UserInterface = require('../../../ui-context');
const NavItem = require('./nav-item');
const { genreOptions } = require('../../../../options');

const getIconOfGenre = (genre) => {
  switch (genre) {
    case 'scifi':
      return RobotIcon;
    case 'fantasy':
      return DragonIcon;
    default:
      return SettingsIcon;
  }
};

const capitalize = text => text[0].toUpperCase() + text.slice(1);

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1)
  },
  button: {
    fontSize: 'larger',
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%'
  },
  title: {
    marginRight: 'auto'
  }
}));

function YearSidebar({ year, drawerWidth }) {
  const classes = useStyles(drawerWidth);
  const [isOpen, setOpen] = React.useState(false);
  const { user, bookLists } = React.useContext(UserInterface);
  const bookListsInYear = bookLists.filter(bookList => bookList.year === year);

  const navItems = bookListsInYear.map(bookList => {
    const genre = bookList.genre;
    const genreDisplayName = genreOptions.find(option => option.id === genre).name;
    return {
      title: capitalize(genreDisplayName),
      href: `/${year}/${genre}`,
      icon: getIconOfGenre(genre)
    };
  });

  if (user.role === 'admin') {
    navItems.push(
      {
        title: 'Könyvek',
        href: `/${year}/books`,
        icon: SettingsIcon
      }
    );
  }

  return (
    <Box 
      display="flex"
      flexDirection="column"
    >
      <Box width="100%">
        <Button 
          className={ classes.button }
          onClick={ () => setOpen(!isOpen) }
        >
          <CalendarIcon
            className={classes.icon}
            style={{
              fontSize: '24'
            }}
          />
          <span className={classes.title}>
            {year}
          </span>
          <ChevronRightIcon 
            style={{
              padding: 0,
              transform: isOpen
                ? 'rotate(90deg)'
                : 'rotate(0deg)',
              transitionDuration: '0.3s',
              transitionProperty: 'transform',
            }}
          />
        </Button>
      </Box>
      <Collapse
        in={isOpen}
        timeout="auto"
      >
        <List disablePadding>
          {navItems.map((item) => (
            <NavItem 
              indented
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Collapse>
    </Box>
  );
}

module.exports = YearSidebar;
