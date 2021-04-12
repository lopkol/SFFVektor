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

const { getUser, saveUser, updateUser } = require('../../../services/api/users/users');
const { roleOptions, genreOptions } = require('../../../../options');
const { sortBookLists } = require('../../../lib/useful-stuff');

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  },
}));

function UserDetails({ handleClose, open, userId }) {
  const classes = useStyles();
  const { user, bookLists, changeUIData } = React.useContext(UserInterface);
  
  const [editMode, setEditMode] = React.useState(false);
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
    }
  }, [open]);

  function exitEditMode() {
    setEditMode(false);
    
    if (userId === null) {
      handleClose();
    } else {
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
      await saveUser(userDataToSave);
    } else {
      await updateUser(userId, userDataToSave);
      if (user.id === userId) {
        changeUIData();
      }
    }
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
        Felhasználó adatai
      </DialogTitle>
      <DialogContent dividers>
        { editMode ?
          <DataEditPage data={userFields} handleChange={(newUserFields) => setUserFields(newUserFields)}/>
          :
          <DataDisplayPage data={userFields}/>
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

module.exports = UserDetails;
