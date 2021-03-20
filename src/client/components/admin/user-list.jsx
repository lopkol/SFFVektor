'use strict';

const React = require('react');
const { DataGrid } = require('@material-ui/data-grid');
const { getUsers } = require('../../services/api/users/users');
const { roleOptions } = require('../../../options');

const columns = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'role', headerName: 'Jogosultság', width: 100 },
  { field: 'name', headerName: 'Név', width: 250 },
  { field: 'molyUserName', headerName: 'Moly név', width: 250 },
  { field: 'email', headerName: 'E-mail cím', width: 250 }
];

function UserList() {
  const [userList, setUserList] = React.useState([]);

  React.useEffect(async () => {
    const users = await getUsers();
    setUserList(users);
  }, []);

  const rows = userList.map(user => {
    const roleName = roleOptions.find(role => role.id === user.role).name;
    return {
      ...user,
      role: roleName
    };
  });

  return  (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid rows={ rows } columns={ columns } pageSize={25} />
    </div>
  );
}

module.exports = UserList;
