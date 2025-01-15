const router = require('express').Router();
const itemController = require('../controllers/itemController');

router.post('/', itemController.createItem);

module.exports = router;