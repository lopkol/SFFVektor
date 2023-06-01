'use strict';

const { cloneDeep } = require('lodash');
const React = require('react');
const { Button, Dialog, DialogActions, DialogContent, makeStyles } = require('@material-ui/core');

const DialogTitle = require('../../common/dialogs/dialog-title');
const UnsavedDataAlert = require('../../common/dialogs/unsaved-data-alert');
const DataDisplayPage = require('../../common/data-display/data-display-page');
const DataEditPage = require('../../common/form/data-edit-page');

const AuthorDetails = require('../authors/author-details');

const UserInterface = require('../../../lib/ui-context');
const { sortAuthors, equalAsSets } = require('../../../lib/useful-stuff');

const { getBook, updateBook } = require('../../../services/api/books/books');
const { getAuthors } = require('../../../services/api/authors/authors');

const useStyles = makeStyles(theme => ({
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
  const [authorDetailsOpen, setAuthorDetailsOpen] = React.useState(false);
  const [selectedAuthor, setSelectedAuthor] = React.useState(null);
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
        const sortedAuthors = sortAuthors(allAuthors);

        const bookToEdit = await getBook(bookId);
        setBookData(bookToEdit);

        const emptyFields = [
          {
            key: 'authorIds',
            value: [],
            label: 'Szerzők',
            type: 'tags',
            options: sortedAuthors.map(createAuthorOption),
            onNew: () => {
              setSelectedAuthor(null);
              setAuthorDetailsOpen(true);
            },
            newButtonLabel: 'Új szerző létrehozása'
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
            key: 'alternatives',
            value: [],
            label: 'Alternatívák',
            type: 'alternatives'
          }
        ];
        setEmptyBookFields(emptyFields);

        const newBookFields = createFieldsFromBook(emptyFields, bookToEdit);
        setBookFields(newBookFields);
        setEditMode(false);
      })();
      setReloadData(false);
    }
  }, [reloadData]);

  const createFieldsFromBook = (fieldArray, book) =>
    fieldArray.map(field => ({ ...field, value: book[field.key] }));

  function hasUnsavedData() {
    if (!editMode) {
      return false;
    }
    const savedFields = emptyBookFields.map(field => bookData[field.key]);
    const currentFields = bookFields.map(field => field.value);

    for (let i = 0; i < savedFields.length; i++) {
      if (Array.isArray(savedFields[i])) {
        const shallowArray1 = savedFields[i].map(fieldEntry => JSON.stringify(fieldEntry));
        const shallowArray2 = currentFields[i].map(fieldEntry => JSON.stringify(fieldEntry));
        if (!equalAsSets(shallowArray1, shallowArray2)) {
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
    let bookDataToSave = {};
    bookFields.forEach(field => {
      bookDataToSave[field.key] = field.value;
    });

    const newAlternativeIds = bookDataToSave.alternatives.map(alt => alt.id).filter(alt => alt);
    bookDataToSave.alternativeIds = newAlternativeIds;
    bookDataToSave.isApproved = true;

    const previousAlternativeIds = bookData.alternativeIds;

    await updateBook(bookId, bookDataToSave, previousAlternativeIds);
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

  const createAuthorOption = author => ({
    id: author.id,
    name: author.isApproved ? author.name : `\u26A0\uFE0F ${author.name}`,
    onClick: () => {
      setSelectedAuthor(author.id);
      setAuthorDetailsOpen(true);
    }
  });

  async function updateAuthorOptions(newId = null) {
    const allAuthors = await getAuthors();
    const sortedAuthors = sortAuthors(allAuthors);
    const newAuthorOptions = sortedAuthors.map(createAuthorOption);

    const emptyFields = cloneDeep(emptyBookFields);
    emptyFields.find(field => field.key === 'authorIds').options = newAuthorOptions;
    setEmptyBookFields(emptyFields);

    const newBookFields = cloneDeep(bookFields);
    const authorField = newBookFields.find(field => field.key === 'authorIds');
    authorField.options = newAuthorOptions;
    if (newId) {
      authorField.value.push(newId);
    }
    setBookFields(newBookFields);
  }

  async function addNewAuthor(newId) {
    setSelectedAuthor(newId);
    await updateAuthorOptions(newId);
  }

  async function handleCloseAuthorDetails() {
    setAuthorDetailsOpen(false);
    await updateAuthorOptions();
    setSelectedAuthor(null);
  }

  return (
    <Dialog onClose={triggerClose} aria-labelledby="book-details" open={open}>
      <DialogTitle id="book-details-title" onClose={triggerClose}>
        Könyv adatai
      </DialogTitle>
      <DialogContent className={classes.dialogContent} dividers>
        {editMode ? (
          <DataEditPage
            data={bookFields}
            handleChange={newBookFields => setBookFields(newBookFields)}
          />
        ) : (
          <DataDisplayPage data={bookFields} />
        )}
      </DialogContent>
      {user.role === 'admin' && (
        <DialogActions className={classes.dialogActions}>
          {editMode ? (
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
          ) : (
            <Button
              className={classes.button}
              autoFocus
              onClick={() => setEditMode(true)}
              color="primary"
              variant="contained"
            >
              Szerkesztés
            </Button>
          )}
        </DialogActions>
      )}
      <UnsavedDataAlert
        open={unsavedAlertOpen}
        handleCancel={handleAlertCancel}
        handleOk={handleAlertContinue}
      />
      <AuthorDetails
        open={authorDetailsOpen}
        handleClose={handleCloseAuthorDetails}
        authorId={selectedAuthor}
        changeAuthorId={newId => addNewAuthor(newId)}
      />
    </Dialog>
  );
}

module.exports = BookDetails;
