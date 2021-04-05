'use strict';

const React = require('react');
const { 
  Button,
  Dialog,
  makeStyles
} = require('@material-ui/core');
const DialogActions = require('../common/dialog-window/dialog-actions');
const DialogContent = require('../common/dialog-window/dialog-content');
const DialogTitle = require('../common/dialog-window/dialog-title');
const DataDisplayPage = require('../common/data-display-page');
const DataEditPage = require('../common/data-edit-page');

const { getUser, saveUser, updateUser } = require('../../services/api/users/users');
const { roleOptions } = require('../../../options');

const emptyUserFields = [
  {
    key: 'role',
    value: 'inactive',
    label: 'Státusz',
    select: true,
    options: roleOptions
  },
  {
    key: 'molyUsername',
    value: '',
    label: 'Moly felhasználónév',
    select: false
  },
  {
    key: 'molyUrl',
    value: '',
    label: 'Moly profil link',
    select: false
  },
  {
    key: 'email',
    value: '',
    label: 'E-mail cím',
    select: false
  },
  {
    key: 'name',
    value: '',
    label: 'Név',
    select: false
  }
];

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  },
}));

function UserDetails(props) {
  const classes = useStyles();
  const { handleClose, open, userId } = props;
  const [editMode, setEditMode] = React.useState(false);
  const [userData, setUserData] = React.useState({});
  const [userFields, setUserFields] = React.useState(emptyUserFields);

  React.useEffect(async () => {
    if (open) {
      if (userId === null) {
        setEditMode(true);
        setUserData({});
        setUserFields(emptyUserFields);
      } else {
        setEditMode(false);
        const user = await getUser(userId);
        setUserData(user);

        const newUserFields = emptyUserFields.map(field => ({ 
          ...field,
          value: user[field.key]
        }));
        setUserFields(newUserFields);
      }
    }
  }, [open]);

  function exitEditMode() {
    setEditMode(false);
    
    if (userId === null) {
      handleClose();
    } else {
      const oldUserFields = emptyUserFields.map(field => ({ 
        ...field,
        value: userData[field.key]
      }));
      setUserFields(oldUserFields);
    }
  }

  function handleFieldChange({ key, value }) {
    setUserFields(prevUserFields => prevUserFields.map(field => {
      if (field.key === key) {
        return {
          ...field,
          value: value
        };
      }
      return field;
    }));
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
          <DataEditPage data={userFields} onDataChange={handleFieldChange}/>
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
