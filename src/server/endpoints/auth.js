'use strict';

const { getUserInfo } = require('../adapters/google/google');
const { allowedUsers, appBaseUrl } = require('../config');

module.exports = async (req, res) => {
  try {
    const authorizationCode = req.query.code;
    if (!authorizationCode) {
      return res.sendStatus(401);
    }

    const { email } = await getUserInfo(authorizationCode);

    if (!allowedUsers.includes(email)) {
      res.render('unauthorized.ejs');
      return;
    }

    res.cookie('beer', '42', {
      expires: 0,
    });

    res.redirect(appBaseUrl);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
};
