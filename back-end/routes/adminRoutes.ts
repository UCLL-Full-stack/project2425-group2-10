// back-end/routes/adminRoutes.ts

import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/authorizeRole';

const router = Router();

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Retrieve a list of all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all users without passwords.
 */
router.get('/users', authMiddleware, authorizeRole('admin'));

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.delete('/users/:id', authMiddleware, authorizeRole('admin'));

export default router;
