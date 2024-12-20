import {
    getAllJobs,
    createJob as createJobRepo,
    findJobById,
    updateJob as updateJobRepo,
    deleteJob as deleteJobRepo,
  } from "../repository/jobRepository";
  import { Prisma } from "@prisma/client"; // Import Prisma types
  
  export const getJobs = async () => {
    return await getAllJobs();
  };
  
  export const createJob = async (jobData: Prisma.JobCreateInput, postedById: string) => {
    return await createJobRepo({
      ...jobData,
      postedBy: { connect: { id: postedById } }, // Correctly reference the related User by ID
    });
  };
  
  export const updateJob = async (id: string, jobData: Prisma.JobUpdateInput) => {
    const job = await findJobById(id);
    if (!job) {
      throw new Error("Job not found");
    }
  
    return await updateJobRepo(id, jobData);
  };
  
  export const deleteJob = async (id: string) => {
    const job = await findJobById(id);
    if (!job) {
      throw new Error("Job not found");
    }
  
    return await deleteJobRepo(id);
  };