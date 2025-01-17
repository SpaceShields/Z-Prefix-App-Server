const router = require('express').Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.readItems);
router.post('/', itemController.createItem);
router.get('/user', itemController.readItemsByUser);
router.get('/user/:id', itemController.readItemsByUserId);
router.get('/:id', itemController.readItemById);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;