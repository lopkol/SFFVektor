'use strict';

const React = require('react');
const { Button, Dialog, DialogActions, DialogContent } = require('@mui/material');
const DialogTitle = require('../../common/dialogs/dialog-title');
const UnsavedDataAlert = require('../../common/dialogs/unsaved-data-alert');
const DataDisplayPage = require('../../common/data-display/data-display-page');
const DataEditPage = require('../../common/form/data-edit-page');

const { equalAsSets } = require('../../../lib/useful-stuff');

const { getAuthor, updateAuthor, saveAuthor } = require('../../../services/api/authors/authors');

function AuthorDetails({ handleClose, open, authorId, changeAuthorId }) {
  const [reloadData, setReloadData] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [unsavedAlertOpen, setUnsavedAlertOpen] = React.useState(false);
  const [authorData, setAuthorData] = React.useState({});

  const emptyAuthorFields = [
    {
      key: 'name',
      value: '',
      label: 'Megjelenítendő név',
      type: 'text'
    },
    {
      key: 'sortName',
      value: '',
      label: 'Vezetéknév, keresztnév',
      type: 'text'
    }
  ];
  const [authorFields, setAuthorFields] = React.useState(emptyAuthorFields);

  React.useEffect(() => {
    if (open) {
      setReloadData(true);
    } else {
      setAuthorData({});
      setAuthorFields(emptyAuthorFields);
    }
  }, [open]);

  const createFieldsFromAuthor = author => {
    return emptyAuthorFields.map(field => ({
      ...field,
      value: author[field.key]
    }));
  };

  React.useEffect(() => {
    if (reloadData) {
      if (authorId === null) {
        setEditMode(true);
        setAuthorData({});
        setAuthorFields(emptyAuthorFields);
      } else {
        (async () => {
          const author = await getAuthor(authorId);
          setAuthorData(author);

          if (author.isApproved) {
            setEditMode(false);
          } else {
            setEditMode(true);
          }

          const newAuthorFields = createFieldsFromAuthor(author);
          setAuthorFields(newAuthorFields);
        })();
      }
      setReloadData(false);
    }
  }, [reloadData]);

  function hasUnsavedData() {
    if (!editMode) {
      return false;
    }
    let savedFields = emptyAuthorFields.map(field => field.value);
    if (authorId) {
      savedFields = emptyAuthorFields.map(field => authorData[field.key]);
    }
    const currentFields = authorFields.map(field => field.value);

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
    if (authorId === null) {
      triggerClose();
    } else {
      setEditMode(false);
      const oldAuthorFields = createFieldsFromAuthor(authorData);
      setAuthorFields(oldAuthorFields);
    }
  }

  async function saveData() {
    //TODO: error handling..
    let authorDataToSave = {};
    authorFields.forEach(field => {
      authorDataToSave[field.key] = field.value;
    });
    authorDataToSave['isApproved'] = true;

    if (authorId === null) {
      const newId = await saveAuthor(authorDataToSave);
      changeAuthorId(newId);
    } else {
      await updateAuthor(authorId, authorDataToSave);
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
    <Dialog onClose={triggerClose} aria-labelledby="author-details" open={open}>
      <DialogTitle id="author-details-title" onClose={triggerClose}>
        Szerző adatai
      </DialogTitle>
      <DialogContent sx={{ padding: 1 }} dividers>
        {editMode ? (
          <DataEditPage
            data={authorFields}
            handleChange={newAuthorFields => setAuthorFields(newAuthorFields)}
          />
        ) : (
          <DataDisplayPage data={authorFields} />
        )}
      </DialogContent>
      <DialogActions sx={{ padding: 1 }}>
        {editMode ? (
          <div>
            <Button sx={{ margin: 1 }} onClick={exitEditMode} color="primary" variant="contained">
              Elvetés
            </Button>
            <Button
              sx={{ margin: 1 }}
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
            sx={{ margin: 1 }}
            autoFocus
            onClick={() => setEditMode(true)}
            color="primary"
            variant="contained"
          >
            Szerkesztés
          </Button>
        )}
      </DialogActions>
      <UnsavedDataAlert
        open={unsavedAlertOpen}
        handleCancel={handleAlertCancel}
        handleOk={handleAlertContinue}
      />
    </Dialog>
  );
}

module.exports = AuthorDetails;
