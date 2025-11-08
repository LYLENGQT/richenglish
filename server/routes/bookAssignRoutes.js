const express = require("express");
const router = express.Router();
const {
  getAllBookAssignments,
  getBookAssignment,
  createBookAssignment,
  updateBookAssignment,
  deleteBookAssignment,
} = require("../controller/bookAssignController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);
/**
 * @swagger
 * tags:
 *   name: BookAssignments
 *   description: API for managing book assignments
 *
 * components:
 *   schemas:
 *     BookAssignment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Book assignment ID
 *         student_id:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *             email: { type: string }
 *           description: Reference to the student
 *         teacher_id:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *             email: { type: string }
 *           description: Reference to the teacher
 *         book_id:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             title: { type: string }
 *           description: Reference to the book
 *         assigned_by:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *             role: { type: string }
 *           description: Admin or super-admin who assigned the book
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Assignment creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Assignment update timestamp
 */

/**
 * @swagger
 * /book-assignments:
 *   get:
 *     summary: Get all book assignments
 *     tags: [BookAssignments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of book assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookAssignment'
 *
 *   post:
 *     summary: Create a new book assignment
 *     tags: [BookAssignments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - teacher_id
 *               - book_id
 *             properties:
 *               student_id: { type: string }
 *               teacher_id: { type: string }
 *               book_id: { type: string }
 *     responses:
 *       201:
 *         description: Book assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookAssignment'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /book-assignments/{id}:
 *   get:
 *     summary: Get a single book assignment
 *     tags: [BookAssignments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Book assignment ID
 *     responses:
 *       200:
 *         description: Book assignment retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookAssignment'
 *       404:
 *         description: Not found
 *
 *   patch:
 *     summary: Update a book assignment
 *     tags: [BookAssignments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Book assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id: { type: string }
 *               teacher_id: { type: string }
 *               book_id: { type: string }
 *     responses:
 *       200:
 *         description: Book assignment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookAssignment'
 *       404:
 *         description: Not found
 *
 *   delete:
 *     summary: Delete a book assignment
 *     tags: [BookAssignments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Book assignment ID
 *     responses:
 *       200:
 *         description: Book assignment deleted successfully
 *       404:
 *         description: Not found
 */

router
  .route("/")
  .get(getAllBookAssignments)
  .post(requireAdmin("super-admin", "admin"), createBookAssignment);
router
  .route("/:id")
  .get(getBookAssignment)
  .patch(requireAdmin("super-admin", "admin"), updateBookAssignment)
  .delete(requireAdmin("super-admin", "admin"), deleteBookAssignment);

module.exports = router;
