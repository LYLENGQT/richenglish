const express = require('express');
const router = express.Router();
const {getAttendance, addAttendace} = require('../controller/attendanceController')

router.route('/').get(getAttendance).post(addAttendace)

module.exports = router;
