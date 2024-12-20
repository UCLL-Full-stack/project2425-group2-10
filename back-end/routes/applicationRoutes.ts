import express from "express";
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/applicationController";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRole } from "../middleware/authorizeRole";

const router = express.Router();

/**
 * @swagger
 * /applications/{jobId}:
 *   post:
 *     summary: Apply for a job
 *     parameters:
 *       - name: jobId
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
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               resume:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *               question:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Invalid application data
 */
router.post("/:jobId", authenticateUser, authorizeRole(["candidate"]), applyForJob);

/**
 * @swagger
 * /applications/my-applications:
 *   get:
 *     summary: Get all applications by the logged-in user
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   fullName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   resume:
 *                     type: string
 *                   coverLetter:
 *                     type: string
 *                   status:
 *                     type: string
 *                   jobId:
 *                     type: string
 *                   userId:
 *                     type: string
 */
router.get("/my-applications", authenticateUser, authorizeRole(["candidate"]), getMyApplications);

/**
 * @swagger
 * /applications/{jobId}:
 *   get:
 *     summary: Get all applications for a job (Admin/Recruiter only)
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of job applications
 */
router.get("/:jobId", authenticateUser, authorizeRole(["admin", "recruiter"]), getJobApplications);

/**
 * @swagger
 * /applications/{id}:
 *   patch:
 *     summary: Update the status of an application
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Application ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       404:
 *         description: Application not found
 */
router.patch("/:id", authenticateUser, authorizeRole(["admin", "recruiter"]), updateApplicationStatus);

export default router;