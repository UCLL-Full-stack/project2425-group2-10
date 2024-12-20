import { Prisma } from "@prisma/client"; // Import Prisma types
import prisma from "../prismaClient"; // Import the Prisma client

// Fetch all jobs
export const getAllJobs = async () => {
  return await prisma.job.findMany();
};

// Create a new job
export const createJob = async (jobData: Prisma.JobCreateInput) => {
  return await prisma.job.create({
    data: jobData,
  });
};

// Find a job by its ID
export const findJobById = async (id: string) => {
  return await prisma.job.findUnique({ where: { id } });
};

// Update an existing job
export const updateJob = async (id: string, jobData: Prisma.JobUpdateInput) => {
  return await prisma.job.update({
    where: { id },
    data: jobData,
  });
};

// Delete a job
export const deleteJob = async (id: string) => {
  return await prisma.job.delete({
    where: { id },
  });
};