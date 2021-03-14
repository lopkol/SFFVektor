'use strict';

const base64 = require('base-64');
const { getUserInfo } = require('../../adapters/google/google');
const { encode } = require('../../adapters/jwt/jwt');
const { appBaseUrl, cookieName } = require('../../config');

const { getUsersWithProps } = require('../../dao/users/users');
const { isActiveUser } = require('../../lib/permissions');

module.exports = async (req, res) => {
  try {
    const authorizationCode = req.query.code;
    const { redirectPath } = JSON.parse(base64.decode(req.query.state));

    if (!authorizationCode) {
      return res.sendStatus(401);
    }

    const { email } = await getUserInfo(authorizationCode);
    const [user] = await getUsersWithProps({ email });

    if (!user) {
      res.render('unauthorized.ejs');
      return;
    }
    const canLogin = await isActiveUser(user.id);
    if (!canLogin) {
      res.render('unauthorized.ejs');
      return;
    }

    const jwtToken = encode({ id: user.id, role: user.role });

    res.cookie(cookieName, jwtToken, {
      expires: 0
    });

    res.redirect(`${appBaseUrl}${redirectPath}`);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
