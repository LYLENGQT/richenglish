

const express = require('express')
const router = express.Router();
const {getMakeupClass, addMakeupClass, updateMakeupClass, deleteMakeupClass} = require('../controller/makeupClassesController')
const {
  authenticateToken,
} = require('../middleware/authMiddleware');

router.use(authenticateToken)

router.route('/').get(getMakeupClass).post(addMakeupClass);
router.route('/:id').put(updateMakeupClass).delete(deleteMakeupClass)

module.exports = router;