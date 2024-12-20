import express from "express";
import { getJobs, createJob, updateJob, deleteJob } from "../controllers/jobController";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRole } from "../middleware/authorizeRole";

const router = express.Router();

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all job listings
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   companyName:
 *                     type: string
 *                   title:
 *                     type: string
 *                   experience:
 *                     type: string
 *                   description:
 *                     type: string
 *                   skills:
 *                     type: string
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   postedById:
 *                     type: string
 */
router.get("/", authenticateUser, getJobs);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               title:
 *                 type: string
 *               experience:
 *                 type: string
 *               description:
 *                 type: string
 *               skills:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.post("/", authenticateUser, authorizeRole(["admin", "recruiter"]), createJob);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update an existing job
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               title:
 *                 type: string
 *               experience:
 *                 type: string
 *               description:
 *                 type: string
 *               skills:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 */
router.put("/:id", authenticateUser, authorizeRole(["admin", "recruiter"]), updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 */
router.delete("/:id", authenticateUser, authorizeRole(["admin", "recruiter"]), deleteJob);

export default router;