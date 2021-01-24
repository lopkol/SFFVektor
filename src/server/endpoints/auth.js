'use strict';

module.exports = (req, res) => {
  if (!req.query.code) {
    return res.sendStatus(401);
  }

  res.cookie('beer', '42', {
    expires: 0,
  });

  res.redirect('http://localhost:9966');
};
