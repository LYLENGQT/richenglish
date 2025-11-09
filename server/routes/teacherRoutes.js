const express = require("express");
const router = express.Router();
const {
  teacherApplication,
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controller/teacherController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");
const cache = require("../middleware/cacheMiddleware");

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: API endpoints for managing teachers
 */

/**
 * @swagger
 * /teachers/application:
 *   post:
 *     summary: Submit a teacher application
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               degree:
 *                 type: string
 *               major:
 *                 type: string
 *               englishLevel:
 *                 type: string
 *               experience:
 *                 type: string
 *               motivation:
 *                 type: string
 *               availability:
 *                 type: string
 *               internetSpeed:
 *                 type: string
 *               compatcherSpecs:
 *                 type: string
 *               hasWebcam:
 *                 type: boolean
 *               hasHeadset:
 *                 type: boolean
 *               hasBackupInternet:
 *                 type: boolean
 *               hasBackupPower:
 *                 type: boolean
 *               teachingEnvironment:
 *                 type: string
 *               resume:
 *                 type: string
 *               introVideo:
 *                 type: string
 *               speedTestScreenshot:
 *                 type: string
 *     responses:
 *       201:
 *         description: Teacher application submitted successfully
 *       400:
 *         description: Email already registered
 */
router.post("/application", teacherApplication);

router.use(authenticateToken);

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Get a paginated list of teachers
 *     tags: [Teachers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
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
 *         description: List of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 teachers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Teacher'
 *
 *   post:
 *     summary: Create a new teacher (Admin only)
 *     tags: [Teachers]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       400:
 *         description: Email already exists
 */
router
  .route("/")
  .get(requireAdmin("super-admin", "admin"), cache("teachers:"), getTeachers)
  .post(requireAdmin("super-admin", "admin"), createTeacher);

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Get a single teacher by ID
 *     tags: [Teachers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Teacher not found
 *
 *   patch:
 *     summary: Update a teacher by ID
 *     tags: [Teachers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *       404:
 *         description: Teacher not found
 *
 *   delete:
 *     summary: Delete a teacher by ID (Super Admin only)
 *     tags: [Teachers]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       404:
 *         description: Teacher not found
 */
router
  .route("/:id")
  .patch(requireAdmin("super-admin", "admin"), updateTeacher)
  .delete(requireAdmin("super-admin"), deleteTeacher)
  .get(cache("teacher:"), getTeacher);

module.exports = router;
