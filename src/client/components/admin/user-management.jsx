'use strict';

const React = require('react');
const { Button, makeStyles } = require('@material-ui/core');
const UserDetails = require('./user-details');
const CustomTable = require('../common/custom-table');

const { getUsers } = require('../../services/api/users/users');
const { roleOptions } = require('../../../options');

const columns = [
  { field: 'molyUsername', headerName: 'Moly felhasználónév', orderable: true, component: 'th' },
  { field: 'email', headerName: 'E-mail cím', orderable: true },
  { field: 'role', headerName: 'Státusz', orderable: true }
];

const useStyles = makeStyles(() => ({
  button: {
    //textTransform: 'none'
  },
}));

function UserManagement() {
  const classes = useStyles();
  const [rows, setRows] = React.useState([]);
  const [reloadData, setReloadData] = React.useState(false);
  const [userDetailsOpen, setUserDetailsOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  
  React.useEffect(async () => {
    const users = await getUsers();
    const sortedUsers = users.slice().sort((a,b) => a.molyUsername.localeCompare(b.molyUsername, 'en', { ignorePunctuation: true }));

    setRows(sortedUsers.map(user => createRow(user)));
    setReloadData(false);
  }, [reloadData]);

  const createRow = (userData) => {
    const roleName = roleOptions.find(role => role.id === userData.role).name;
    return {
      id: userData.id,
      fields: {
        molyUsername: userData.molyUsername,
        email: userData.email,
        role: roleName
      },
      onClick: () => handleOpenUserDetails(userData.id)
    };
  };

  const handleOpenUserDetails = (userId) => {
    setSelectedUserId(userId);
    setUserDetailsOpen(true);
  };

  const handleCloseUserDetails = () => {
    setUserDetailsOpen(false);
    setSelectedUserId(null);
    setReloadData(true);
  };

  return  (
    <div>
      <CustomTable title="Felhasználók" rows={ rows } columns={ columns } rowSelection="click">
        <Button className={classes.button} variant="contained" color="primary" onClick={ () => handleOpenUserDetails(null) }>
          Új felhasználó
        </Button>
      </CustomTable>
      <UserDetails 
        open={userDetailsOpen} 
        handleClose={handleCloseUserDetails} 
        userId={selectedUserId} 
      />
    </div>
  );
}

module.exports = UserManagement;
