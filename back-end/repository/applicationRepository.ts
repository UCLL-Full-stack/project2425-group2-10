import prisma from "../prismaClient";
import { Prisma } from "@prisma/client";  // Import from Prisma namespace

// Updated to use Prisma.ApplicationCreateInput for the correct type
export const createApplication = async (applicationData: Prisma.ApplicationCreateInput) => {
  return await prisma.application.create({
    data: applicationData,
  });
};

export const getApplicationsByUserId = async (userId: string) => {
  return await prisma.application.findMany({ where: { userId } });
};

export const getApplicationsByJobId = async (jobId: string) => {
  return await prisma.application.findMany({ where: { jobId } });
};

export const updateApplicationStatus = async (id: string, status: string) => {
  return await prisma.application.update({
    where: { id },
    data: { status },
  });
};