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

const { getUser, saveUser, updateUser } = require('../../../services/api/users/users');
const { roleOptions, genreOptions } = require('../../../../options');
const { sortBookLists } = require('../../../lib/useful-stuff');

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

function UserDetails({ handleClose, open, userId, changeUserId }) {
  const classes = useStyles();
  const { user, bookLists, changeUIData } = React.useContext(UserInterface);
  
  const [reloadData, setReloadData] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [unsavedAlertOpen, setUnsavedAlertOpen] = React.useState(false);
  const [userData, setUserData] = React.useState({});

  const emptyUserFields = [
    {
      key: 'role',
      value: 'inactive',
      label: 'Státusz',
      type: 'select',
      options: roleOptions
    },
    {
      key: 'molyUsername',
      value: '',
      label: 'Moly felhasználónév',
      type: 'text'
    },
    {
      key: 'molyUrl',
      value: '',
      label: 'Moly profil link',
      type: 'text'
    },
    {
      key: 'email',
      value: '',
      label: 'E-mail cím',
      type: 'text'
    },
    {
      key: 'bookListIds',
      value: [],
      label: 'Jelöltlisták',
      type: 'tags',
      options: bookLists.map(bookList => {
        const genreName = genreOptions.find(option => option.id === bookList.genre).name;
        return {
          id: bookList.id,
          name: `${bookList.year} ${genreName}`
        };
      })
    }
  ];

  const [userFields, setUserFields] = React.useState(emptyUserFields);

  const getBookListIdsOfUser = user => {
    return sortBookLists(user.bookLists).map(bookList => bookList.id);
  };
  
  const createFieldsFromUser = user => {
    return emptyUserFields.map(field => {
      if (field.key === 'bookListIds') {
        return {
          ...field,
          value: getBookListIdsOfUser(user)
        };
      } else {
        return {
          ...field,
          value: user[field.key]
        };
      }
    });
  };

  React.useEffect(() => {
    if (open) {
      setReloadData(true);
    }
  }, [open]);
  
  React.useEffect(() => {
    if (reloadData) {
      (async () => {
        if (userId === null) {
          setEditMode(true);
          setUserData({});
          setUserFields(emptyUserFields);
        } else {
          setEditMode(false);
          const userToEdit = await getUser(userId);
          setUserData(userToEdit);
  
          const newUserFields = createFieldsFromUser(userToEdit);
          setUserFields(newUserFields);
        }
      })();
      setReloadData(false);
    }
  }, [reloadData]);

  function hasUnsavedData() {
    if (!editMode) {
      return false;
    }
    let savedFields = [];
    if (userId === null) {
      savedFields = emptyUserFields.map(field => field.value);
    } else {
      savedFields = createFieldsFromUser(userData).map(field => field.value);
    }

    const currentFields = userFields.map(field => field.value);
    
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
    if (userId === null) {
      triggerClose();
    } else {
      setEditMode(false);
      const oldUserFields = createFieldsFromUser(userData);
      setUserFields(oldUserFields);
    }
  }

  async function saveData() {
    //TODO: error handling..
    let userDataToSave = {};
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
    setReloadData(true);
  }

  function triggerClose() {
    const unsavedData = hasUnsavedData();
    if (unsavedData) {
      setUnsavedAlertOpen(true);
    } else {
      setUserData({});
      setUserFields(emptyUserFields);
      handleClose();
    }
  }

  function handleAlertCancel() {
    setUnsavedAlertOpen(false);
  }

  function handleAlertContinue() {
    setUnsavedAlertOpen(false);
    setUserData({});
    setUserFields(emptyUserFields);
    handleClose();
  }

  return (
    <Dialog 
      onClose={triggerClose} 
      aria-labelledby="user-details" 
      open={open} 
    >
      <DialogTitle id="user-details-title" onClose={triggerClose}>
        Felhasználó adatai
      </DialogTitle>
      <DialogContent className={classes.dialogContent} dividers>
        { editMode ?
          <DataEditPage data={userFields} handleChange={(newUserFields) => setUserFields(newUserFields)}/>
          :
          <DataDisplayPage data={userFields}/>
        }
      </DialogContent>
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
      <UnsavedDataAlert open={unsavedAlertOpen} handleCancel={handleAlertCancel} handleOk={handleAlertContinue}/>
    </Dialog>
  );
}

module.exports = UserDetails;
