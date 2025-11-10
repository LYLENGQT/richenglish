const express = require("express");
const router = express.Router();
const {
  getPayouts,
  getPayout,
  addPayout,
  updatePayout,
  deletePayout,
} = require("../controller/payoutController");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");
const cache = require("../middleware/cacheMiddleware");

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Payouts
 *   description: API for managing teacher payouts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payout:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Payout ID
 *         teacher_id:
 *           type: string
 *           description: Teacher ID
 *         start_date:
 *           type: string
 *           format: date
 *           description: Payout start date
 *         end_date:
 *           type: string
 *           format: date
 *           description: Payout end date
 *         duration:
 *           type: number
 *           description: Total duration in hours
 *         total_class:
 *           type: number
 *           description: Total number of classes
 *         incentives:
 *           type: number
 *           description: Incentives for the teacher
 *         status:
 *           type: string
 *           enum: [pending, processing, completed]
 *           description: Payout status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Error message
 *             statusCode:
 *               type: integer
 *               description: HTTP status code
 *           required:
 *             - message
 *             - statusCode
 *       required:
 *         - error
 */

/**
 * @swagger
 * /payouts:
 *   get:
 *     summary: Get a paginated list of payouts
 *     tags: [Payouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: teacher_id
 *         schema:
 *           type: string
 *         description: Filter by teacher ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed]
 *         description: Filter by payout status
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
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
 *         description: List of payouts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payouts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payout'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     summary: Create a new payout
 *     tags: [Payouts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacher_id
 *               - start_date
 *               - end_date
 *               - duration
 *               - total_class
 *             properties:
 *               teacher_id:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               duration:
 *                 type: number
 *               total_class:
 *                 type: number
 *               incentives:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, processing, completed]
 *     responses:
 *       201:
 *         description: Payout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payout'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/")
  .get(requireAdmin("super-admin"), cache("payouts:"), getPayouts)
  .post(requireAdmin("super-admin"), addPayout);

/**
 * @swagger
 * /payouts/{id}:
 *   get:
 *     summary: Get a payout by ID
 *     tags: [Payouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payout ID
 *     responses:
 *       200:
 *         description: Payout details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payout'
 *       404:
 *         description: Payout not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   patch:
 *     summary: Update a payout
 *     tags: [Payouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacher_id:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               duration:
 *                 type: number
 *               total_class:
 *                 type: number
 *               incentives:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, processing, completed]
 *     responses:
 *       200:
 *         description: Payout updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payout'
 *       404:
 *         description: Payout not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Delete a payout
 *     tags: [Payouts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payout ID
 *     responses:
 *       200:
 *         description: Payout deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payout deleted successfully
 *       404:
 *         description: Payout not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:id")
  .get(cache("payout:"), getPayout)
  .patch(requireAdmin("super-admin"), updatePayout)
  .delete(requireAdmin("super-admin"), deletePayout);

module.exports = router;
