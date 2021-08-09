const express = require('express');
const router = express.Router();

const MessengerController = require('../controllers/MessengerController');

router.get('/', MessengerController.GetMessenger);

router.get('/:id', MessengerController.GetMessengerById);

router.delete('/:id', MessengerController.DeleteMessengerById);

module.exports = router;
