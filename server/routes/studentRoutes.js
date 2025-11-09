const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controller/studentsController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");
const cache = require("../middleware/cacheMiddleware");

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API for managing students
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get a paginated list of students
 *     tags: [Students]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by student name
 *       - in: query
 *         name: nationality
 *         schema:
 *           type: string
 *           enum: [KOREAN, CHINESE]
 *         description: Filter by nationality
 *       - in: query
 *         name: manager_type
 *         schema:
 *           type: string
 *           enum: [KM, CM]
 *         description: Filter by manager type
 *       - in: query
 *         name: category_level
 *         schema:
 *           type: string
 *       - in: query
 *         name: class_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           enum: [Zoom, Voov]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Add a new student
 *     tags: [Students]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad request
 */
router
  .route("/")
  .get(cache("students:"), getStudents)
  .post(requireAdmin("super-admin"), addStudent);

/**
 * @swagger
 * /students/{id}:
 *   patch:
 *     summary: Update a student
 *     tags: [Students]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router
  .route("/:id")
  .get(cache("student:"), getStudent)
  .patch(updateStudent)
  .delete(deleteStudent);

module.exports = router;
