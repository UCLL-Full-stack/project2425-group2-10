import { Request, Response } from "express";
import prisma from "../prismaClient";

// Apply for a job (Candidate only)
export const applyForJob = async (req: Request, res: Response) => {
  const { fullName, email, resume, coverLetter, question } = req.body;
  const jobId = req.params.jobId;
  const userId = req.user?.id; // Access the user ID from the request (added by middleware)

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const application = await prisma.application.create({
      data: {
        fullName,
        email,
        resume,
        coverLetter,
        question,
        status: "Pending",
        jobId,
        userId,
      },
    });
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to apply for the job" });
  }
};

// Get all applications for a specific job (Admin/Recruiter only)
export const getJobApplications = async (req: Request, res: Response) => {
  const jobId = req.params.jobId;

  try {
    const applications = await prisma.application.findMany({
      where: { jobId },
      include: { user: true, job: true }, // Include additional data if needed
    });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch applications for the job" });
  }
};

// Get applications submitted by the logged-in user (Candidate only)
export const getMyApplications = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const applications = await prisma.application.findMany({
      where: { userId },
      include: { job: true }, // Include job details in the response
    });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user applications" });
  }
};

// Update the status of an application (Admin/Recruiter only)
export const updateApplicationStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Pending", "Screening", "Interviewing", "Rejected", "Accepted"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const application = await prisma.application.update({
      where: { id },
      data: { status },
    });
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update application status" });
  }
};