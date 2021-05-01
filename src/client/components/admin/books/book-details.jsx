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

const { getBook, updateBook } = require('../../../services/api/books/books');
const { getAuthors } = require('../../../services/api/authors/authors');
const { getBookAlternative } = require('../../../services/api/book-alternatives/book-alternatives');

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  },
  dialogActions: {
    padding: theme.spacing(1)
  },
  dialogContent: {
    padding: theme.spacing(1)
  }
}));

function BookDetails({ handleClose, open, bookId }) {
  const classes = useStyles();
  const { user } = React.useContext(UserInterface);
  
  const [reloadData, setReloadData] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [unsavedAlertOpen, setUnsavedAlertOpen] = React.useState(false);
  const [authors, setAuthors] = React.useState([]);
  const [reloadAuthors, setReloadAuthors] = React.useState(true);
  const [authorDetailsOpen, setAuthorDetailsOpen] = React.useState(false);
  const [selectedAuthor, setSelectedAuthor] = React.useState(null);
  const [alternatives, setAlternatives] = React.useState([]);
  const [reloadAlternatives, setReloadAlternatives] = React.useState(true);
  const [alternativeDetailsOpen, setAlternativeDetailsOpen] = React.useState(false);
  const [selectedAlternative, setSelectedAlternative] = React.useState(null);
  const [bookData, setBookData] = React.useState({});
  const [emptyBookFields, setEmptyBookFields] = React.useState([]);
  const [bookFields, setBookFields] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      setReloadData(true);
      setEditMode(false);
    } else {
      setBookData({});
      setBookFields(emptyBookFields);
    }
  }, [open]);

  React.useEffect(() => {
    if (reloadData) {
      (async () => {
        const allAuthors = await getAuthors();
        setAuthors(allAuthors);

        const bookToEdit = await getBook(bookId);
        setBookData(bookToEdit);

        setAlternatives(bookToEdit.alternatives);

        const emptyFields = [
          {
            key: 'authorIds',
            value: [],
            label: 'Szerzők',
            type: 'tags',
            options: allAuthors.map(author => ({
              id: author.id,
              name: author.name,
              color: author.isApproved ? 'default' : 'secondary',
              onClick: () => {
                console.log(author.id);
                setSelectedAuthor(author.id);
                setAuthorDetailsOpen(true);
              }
            }))
          },
          {
            key: 'title',
            value: '',
            label: 'Cím',
            type: 'text'
          },
          {
            key: 'series',
            value: '',
            label: 'Sorozat',
            type: 'text'
          },
          {
            key: 'seriesNum',
            value: '',
            label: 'Kötet sorszáma',
            type: 'text'
          },
          {
            key: 'alternativeIds',
            value: [],
            label: 'Alternatívák',
            type: 'tags',
            options: bookToEdit.alternatives.map(alternative => ({
              id: alternative.id,
              name: alternative.name,
              onClick: () => {
                console.log(alternative.id);
                setSelectedAlternative(alternative.id);
                setAlternativeDetailsOpen(true);
              }
            }))
          }
        ];
        setEmptyBookFields(emptyFields);

        console.log(emptyFields);
        const newBookFields = createFieldsFromBook(emptyFields, bookToEdit);
        console.log(newBookFields);
        setBookFields(newBookFields);
      })();
      setReloadData(false);
    }
  }, [reloadData]);

  
  const createFieldsFromBook = (fieldArray, book) => fieldArray.map(field => (
    { ...field, value: book[field.key] }
  ));

  function hasUnsavedData() {
    if (!editMode) {
      return false;
    }
    const savedFields = emptyBookFields.map(field => bookData[field.key]);
    const currentFields = bookFields.map(field => field.value);

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
    setEditMode(false);
    const oldBookFields = createFieldsFromBook(emptyBookFields, bookData);
    setBookFields(oldBookFields);
  }

  async function saveData() {
    //TODO: error handling..
    /*let userDataToSave = {};
    userFields.forEach(field => {
      userDataToSave[field.key] = field.value;
    });

    if (userId === null) {
      const newId = await saveUser(userDataToSave);
      changeUserId(newId);
    } else {
      await updateUser(userId, userDataToSave);
      if (user.id === userId) {
        changeUIData();
      }
    }
    setReloadData(true);*/
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
      aria-labelledby="book-details" 
      open={open} 
    >
      <DialogTitle id="book-details-title" onClose={triggerClose}>
        Könyv adatai
      </DialogTitle>
      <DialogContent className={classes.dialogContent} dividers>
        { editMode ?
          <DataEditPage data={bookFields} handleChange={(newBookFields) => setBookFields(newBookFields)}/>
          :
          <DataDisplayPage data={bookFields}/>
        }
      </DialogContent>
      { user.role === 'admin' && 
        <DialogActions className={classes.DialogActions}>
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

module.exports = BookDetails;
