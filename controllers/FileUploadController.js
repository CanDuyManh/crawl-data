const path = require('path');
const fs = require('fs');
const multer = require('multer');
const logger = require('../commons/winston');
const express = require('express');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let idUser = req.user.id;
    let myPath = path.join(__dirname, "../storage/", idUser);
    fs.mkdir(myPath, { recursive: true }, (err) => {
    });
    cb(null, myPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

/** middleware upload of multer .
 */
module.exports.upload = multer({ storage: storage });

module.exports.Uploadfile = (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    next(error);
  }
  res.send(file);
};

/** show file on browser .
 * @param {express.Request} req - Request
 * @param {express.Response} res - Response
 */
module.exports.GetFile = (req, res, next) => {
  try {
    let imagePath = path.join(__dirname, '../storage/' + req.user.id + '/' + req.params.id);
    logger.info(imagePath);
    if (fs.existsSync(imagePath)){
      res.sendFile(imagePath);
    } else {
      next("File dose not exits");
    }
  } catch (error) {
    next("File dose not exits");
  }
};
