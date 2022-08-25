'use strict';

const React = require('react');
const {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles
} = require('@material-ui/core');
const DialogTitle = require('../../common/dialogs/dialog-title');
const UnsavedDataAlert = require('../../common/dialogs/unsaved-data-alert');
const DataDisplayPage = require('../../common/data-display/data-display-page');
const DataEditPage = require('../../common/form/data-edit-page');

const UserInterface = require('../../../lib/ui-context');
const { equalAsSets } = require('../../../lib/useful-stuff');

const { getBookList, updateBookList, saveBookList } = require('../../../services/api/book-lists/book-lists');
const { getUsers } = require('../../../services/api/users/users');
const { genreOptions } = require('../../../../options');

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  },
  dialogActions: {
    padding: theme.spacing(1)
  },
  dialogContent: {
    padding: theme.spacing(1)
  },
}));

function BookListDetails({ handleClose, open, bookListId, changeBookListId }) {
  const classes = useStyles();
  const { user, changeUIData } = React.useContext(UserInterface);

  const [reloadData, setReloadData] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [unsavedAlertOpen, setUnsavedAlertOpen] = React.useState(false);
  const [bookListData, setBookListData] = React.useState({});
  const [users, setUsers] = React.useState([]);
  const [emptyBookListFields, setEmptyBookListFields] = React.useState([]);
  const [bookListFields, setBookListFields] = React.useState([]);

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
      } else if (field.key === 'year' || field.key === 'genre') {
        return {
          ...field,
          immutable: true,
          value: bookList[field.key]
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
      (async () => {
        const allUsers = await getUsers();
        setUsers(allUsers);

        setEmptyBookListFields([
          {
            key: 'year',
            value: '',
            label: 'Év',
            type: 'text'
          },
          {
            key: 'genre',
            value: 'scifi',
            label: 'Műfaj',
            type: 'select',
            options: genreOptions
          },
          {
            key: 'url',
            value: '',
            label: 'Moly lista link',
            type: 'url'
          },
          {
            key: 'pendingUrl',
            value: '',
            label: 'Besorolásra váró polc link',
            type: 'url'
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
          }
        ]);
        setReloadData(true);
      })();
    } else {
      setBookListData({});
      setBookListFields(emptyBookListFields);
    }
  }, [open]);

  React.useEffect(() => {
    if (reloadData) {
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
      setReloadData(false);
    }
  }, [reloadData]);

  function hasUnsavedData() {
    if (!editMode) {
      return false;
    }
    let savedFields = [];
    if (bookListId === null) {
      savedFields = emptyBookListFields.map(field => field.value);
    } else {
      savedFields = createFieldsFromBookList(bookListData).map(field => field.value);
    }
    const currentFields = bookListFields.map(field => field.value);

    for (let i = 0; i < savedFields.length; i++) {
      if (Array.isArray(savedFields[i])) {
        if (!equalAsSets(savedFields[i], currentFields[i])) {
          return true;
        }
      } else if (savedFields[i] !== currentFields[i]) {
        return true;
      }
    }
    return false;
  }

  function exitEditMode() {
    if (bookListId === null) {
      triggerClose();
    } else {
      setEditMode(false);
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
      const newId = await saveBookList(bookListDataToSave);
      changeUIData();
      changeBookListId(newId);
    } else {
      await updateBookList(bookListId, bookListDataToSave);
    }
    setReloadData(true);
  }

  function triggerClose() {
    const unsavedData = hasUnsavedData();
    if (unsavedData) {
      setUnsavedAlertOpen(true);
    } else {
      handleClose();
    }
  }

  function handleAlertCancel() {
    setUnsavedAlertOpen(false);
  }

  function handleAlertContinue() {
    setUnsavedAlertOpen(false);
    handleClose();
  }

  return (
    <Dialog
      onClose={triggerClose}
      aria-labelledby="book-list-details"
      open={open}
    >
      <DialogTitle id="book-list-details-title" onClose={triggerClose}>
        Jelöltlista adatai
      </DialogTitle>
      <DialogContent className={classes.dialogContent} dividers>
        { editMode ?
          <DataEditPage data={bookListFields} handleChange={(newBookListFields) => setBookListFields(newBookListFields)}/>
          :
          <DataDisplayPage data={bookListFields}/>
        }
      </DialogContent>
      { user.role === 'admin' &&
        <DialogActions className={classes.dialogActions}>
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
      }
      <UnsavedDataAlert open={unsavedAlertOpen} handleCancel={handleAlertCancel} handleOk={handleAlertContinue}/>
    </Dialog>
  );
}

module.exports = BookListDetails;
