const express = require('express');

/** set page access token by param
 * @param {express.Request} req - Request
 * @param {express.Response} res - Response
 */
module.exports.PostPageAccessTokenByParam = (req, res) => {
  try {
    if (req.query.token){
      let pageToken = req.query.token;
      res.cookie('token', pageToken);
      res.json(pageToken);
    } else {
      res.json('token does not exist');
    }
  } catch (error) {
    res.status.json(error);
  }
};

/** set page access token by request body
 * @param {express.Request} req - Request
 * @param {express.Response} res - Response
 */
module.exports.PostPageAccessTokenByBody = (req, res) => {
  try {
    if (req.body.token){
      let pageToken = req.body.token;
      res.cookie('token', pageToken);
      res.json(pageToken);
    } else {
      res.json('token does not exist');
    }
  } catch (error) {
    res.status.json(error);
  }
};
