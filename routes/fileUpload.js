const express = require('express');
const router = express.Router();
const FileUploadController = require('../controllers/FileUploadController');

router.use((req, res, next) => {
  //  Middleware security handling
  try {
    if (req.user.id){
      next();
    } else {
      throw new Error("You do not have access token !");
    }
  } catch (error) {
    throw new Error("You do not have access token !");
  }
});

router.post('/uploadfile', FileUploadController.upload.single('myFile'), FileUploadController.Uploadfile);

/* GET home page. */
router.get('/:id/show', FileUploadController.GetFile);

module.exports = router;
