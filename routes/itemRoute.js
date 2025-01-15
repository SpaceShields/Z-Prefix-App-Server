const router = require('express').Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.readItems);
router.post('/', itemController.createItem);

module.exports = router;