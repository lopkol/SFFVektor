'use strict';

const React = require('react');
const { 
  Button,
  Dialog,
  makeStyles
} = require('@material-ui/core');
const DialogActions = require('../../common/dialog-window/dialog-actions');
const DialogContent = require('../../common/dialog-window/dialog-content');
const DialogTitle = require('../../common/dialog-window/dialog-title');
const DataDisplayPage = require('../../common/data-edit/data-display-page');
const DataEditPage = require('../../common/data-edit/data-edit-page');

const UserInterface = require('../../../lib/ui-context');

const { getBookList, updateBookList, saveBookList } = require('../../../services/api/book-lists/book-lists');
const { getUsers } = require('../../../services/api/users/users');
const { genreOptions } = require('../../../../options');

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  },
}));

function BookListDetails({ handleClose, open, bookListId }) {
  const classes = useStyles();
  const { changeUIData } = React.useContext(UserInterface);
  
  const [editMode, setEditMode] = React.useState(false);
  const [bookListData, setBookListData] = React.useState({});
  const [users, setUsers] = React.useState([]);
  const [emptyBookListFields, setEmptyBookListFields] = React.useState([]);
  const [bookListFields, setBookListFields] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const allUsers = await getUsers();
      setUsers(allUsers);

      setEmptyBookListFields([
        {
          key: 'year',
          value: '',
          label: 'Év',
          type: 'text',
          immutable: true
        },
        {
          key: 'genre',
          value: 'scifi',
          label: 'Műfaj',
          type: 'select',
          options: genreOptions,
          immutable: true
        },
        {
          key: 'url',
          value: '',
          label: 'Moly lista link',
          type: 'text'
        },
        {
          key: 'pendingUrl',
          value: '',
          label: 'Besorolásra váró polc link',
          type: 'text'
        },
        {
          key: 'juryIds',
          value: [],
          label: 'Zsűritagok',
          type: 'tags',
          options: allUsers.map(user => ({
            id: user.id,
            name: user.molyUsername
          }))
        },
        /*{
          key: 'bookIds',
          value: [],
          label: 'Könyvek',
          type: 'tags',
          options: []
        }*/
      ]);
    })();
  }, []);

  const getJuryIdsOfBookList = bookList => {
    const juryIds = bookList.juryIds;
    const juryMembers = juryIds.map(id => users.find(user => user.id === id));
    const sortedJuryMembers = juryMembers
      .slice()
      .sort((a,b) => a.molyUsername.localeCompare(b.molyUsername, 'en', { ignorePunctuation: true }));
    return sortedJuryMembers.map(user => user.id);
  };
  
  const createFieldsFromBookList = bookList => {
    return emptyBookListFields.map(field => {
      if (field.key === 'juryIds') {
        return {
          ...field,
          value: getJuryIdsOfBookList(bookList)
        };
      } else {
        return {
          ...field,
          value: bookList[field.key]
        };
      }
    });
  };

  React.useEffect(() => {
    if (open) {
      if (bookListId === null) {
        setEditMode(true);
        setBookListData({});
        setBookListFields(emptyBookListFields);
      } else {
        (async () => {
          setEditMode(false);
          const { bookList: bookListToEdit } = await getBookList(bookListId);
          setBookListData(bookListToEdit);
  
          const newBookListFields = createFieldsFromBookList(bookListToEdit);
          setBookListFields(newBookListFields);
        })();
      }
    }
  }, [open]);

  function exitEditMode() {
    setEditMode(false);
    
    if (bookListId === null) {
      handleClose();
    } else {
      const oldBookListFields = createFieldsFromBookList(bookListData);
      setBookListFields(oldBookListFields);
    }
  }

  async function saveData() {
    //TODO: error handling..
    let bookListDataToSave = {};
    bookListFields.forEach(field => {
      bookListDataToSave[field.key] = field.value;
    });

    if (bookListId === null) {
      await saveBookList(bookListDataToSave);
    } else {
      await updateBookList(bookListId, bookListDataToSave);
    }
    changeUIData();
    handleClose();
  }

  return (
    <Dialog 
      onClose={handleClose} 
      aria-labelledby="customized-dialog-title" 
      open={open} 
      disableBackdropClick
    >
      <DialogTitle id="user-details-title" onClose={handleClose}>
        Jelöltlista adatai
      </DialogTitle>
      <DialogContent dividers>
        { editMode ?
          <DataEditPage data={bookListFields} handleChange={(newBookListFields) => setBookListFields(newBookListFields)}/>
          :
          <DataDisplayPage data={bookListFields}/>
        }
      </DialogContent>
      <DialogActions>
        { editMode ? 
          <div>
            <Button 
              className={classes.button} 
              onClick={exitEditMode} 
              color="primary" 
              variant="contained"
            >
              Elvetés
            </Button>
            <Button 
              className={classes.button} 
              autoFocus 
              onClick={saveData} 
              color="primary" 
              variant="contained"
            >
              Mentés
            </Button> 
          </div>
          :
          <Button 
            className={classes.button} 
            autoFocus 
            onClick={() => setEditMode(true)} 
            color="primary" 
            variant="contained"
          >
            Szerkesztés
          </Button>
        } 
      </DialogActions>
    </Dialog>
  );
}

module.exports = BookListDetails;
