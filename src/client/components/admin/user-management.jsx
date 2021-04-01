'use strict';

const React = require('react');
const { Button, makeStyles } = require('@material-ui/core');
const { getUsers } = require('../../services/api/users/users');
const { roleOptions } = require('../../../options');
const CustomTable = require('../common/custom-table');

const columns = [
  { field: 'molyUsername', headerName: 'Moly felhasználónév', orderable: true, component: 'th' },
  { field: 'email', headerName: 'E-mail cím', orderable: true },
  { field: 'role', headerName: 'Státusz', orderable: true }
];

function createRow(userData) {
  const roleName = roleOptions.find(role => role.id === userData.role).name;
  return {
    id: userData.id,
    fields: {
      molyUsername: userData.molyUsername,
      email: userData.email,
      role: roleName
    },
    onClick: () => console.log(`you clicked the row with id ${userData.id}`)
  };
}

const useStyles = makeStyles(() => ({
  button: {
    //textTransform: 'none'
  },
}));

function UserManagement() {
  const classes = useStyles();
  const [rows, setRows] = React.useState([]);

  React.useEffect(async () => {
    const users = await getUsers();
    const sortedUsers = users.slice().sort((a,b) => a.molyUsername.localeCompare(b.molyUsername));

    setRows(sortedUsers.map(user => createRow(user)));
  }, []);


  return  (
    <div>
      <CustomTable title="Felhasználók" rows={ rows } columns={ columns } rowSelection="click">
        <Button className={classes.button} variant="contained" color="primary" onClick={ () => console.log('új felhasználó hozzáadása') }>
          Új felhasználó
        </Button>
      </CustomTable>
    </div>
  );
}

module.exports = UserManagement;
