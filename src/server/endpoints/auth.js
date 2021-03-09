'use strict';

const { getUserInfo } = require('../adapters/google/google');
const { encode } = require('../adapters/jwt/jwt');
const { allowedUsers, appBaseUrl, cookieName } = require('../config');

const { getUsersWithProps } = require('../dao/users/users');

module.exports = async (req, res) => {
  try {
    const authorizationCode = req.query.code;
    if (!authorizationCode) {
      return res.sendStatus(401);
    }

    const { email } = await getUserInfo(authorizationCode);

    const [user] = await getUsersWithProps({ email });

    if (!user && !allowedUsers.includes(email)) {
      res.render('unauthorized.ejs');
      return;
    }

    const id = user ? user.id : email;
    const role = user ? user.role : 'admin';
    const jwtToken = encode({ id, role });

    res.cookie(cookieName, jwtToken, {
      expires: 0
    });

    res.redirect(appBaseUrl);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
};
