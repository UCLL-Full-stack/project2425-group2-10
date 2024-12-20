import {
    createApplication as createApplicationRepo,
    getApplicationsByUserId,
    getApplicationsByJobId,
    updateApplicationStatus as updateApplicationStatusRepo,
  } from "../repository/applicationRepository";
  import { Prisma } from "@prisma/client"; // Import Prisma types
  
  export const applyForJob = async (applicationData: Prisma.ApplicationCreateInput) => {
    // Ensure required fields like jobId and userId are included in the data
    return await createApplicationRepo(applicationData);
  };
  
  export const getMyApplications = async (userId: string) => {
    return await getApplicationsByUserId(userId);
  };
  
  export const getJobApplications = async (jobId: string) => {
    return await getApplicationsByJobId(jobId);
  };
  
  export const updateApplicationStatus = async (id: string, status: string) => {
    return await updateApplicationStatusRepo(id, status);
  };