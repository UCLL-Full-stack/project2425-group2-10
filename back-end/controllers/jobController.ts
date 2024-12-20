import { Request, Response } from "express";
import prisma from "../prismaClient";

// Fetch all jobs (accessible to all authenticated users)
export const getJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: "Open" }, // Fetch only open jobs
      orderBy: { createdAt: "desc" }, // Sort by newest first
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// Create a new job (only recruiters and admins)
export const createJob = async (req: Request, res: Response) => {
  const { companyName, title, experience, description, skills, status } = req.body;
  const postedById = req.user?.id; // Ensure `req.user` is set by authentication middleware

  if (!postedById) {
    return res.status(401).json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const newJob = await prisma.job.create({
      data: {
        companyName,
        title,
        experience,
        description,
        skills,
        status: status || "Open", // Default status to 'Open' if not provided
        postedById,
      },
    });
    res.status(201).json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create job" });
  }
};

// Update an existing job (only recruiters and admins)
export const updateJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { companyName, title, experience, description, skills, status } = req.body;

  try {
    // Check if the job exists
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Update the job details
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        companyName,
        title,
        experience,
        description,
        skills,
        status,
      },
    });
    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update job" });
  }
};

// Delete a job (only recruiters and admins)
export const deleteJob = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if the job exists
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Delete the job
    await prisma.job.delete({ where: { id } });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete job" });
  }
};