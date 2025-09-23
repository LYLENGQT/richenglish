const express = require('express')
const router = express.Router();
const {teacherApplication, dashboardStats} = require('../controller/functionsController')
const {
  authenticateToken,
} = require('../middleware/authMiddleware');

router.post('/teacher-applications', teacherApplication)
router.get('/dashboard/stats', authenticateToken, dashboardStats)

module.exports = router