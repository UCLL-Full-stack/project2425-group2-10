// back-end/src/service/jobService.ts

import { Job, NewJob, JobStatus } from '../types';
import { jobRepository } from '../repository/jobRepository';
import Joi from 'joi';

/**
 * Validation schema for creating a new job.
 */
const createJobSchema = Joi.object({
    companyName: Joi.string().trim().min(1).required(),
    jobTitle: Joi.string().trim().min(1).required(),
    date: Joi.date().iso().required(),
    status: Joi.string().valid(...Object.values(JobStatus)).required(),
    description: Joi.string().trim().allow('', null),
    skills: Joi.array().items(Joi.string().trim().min(1)).min(1).required(),
    adminId: Joi.number().integer().positive().required(),
});

/**
 * Service layer for managing jobs.
 */
export const jobService = {
    /**
     * Creates a new job in the database.
     * @param newJobData - The data for the new job.
     * @returns The created Job object.
     * @throws Error if validation fails or repository operation fails.
     */
    createJob: async (newJobData: NewJob): Promise<Job> => {
        try {
            // Validate the new job data
            const { error, value } = createJobSchema.validate(newJobData);
            if (error) {
                throw new Error(`Validation Error: ${error.message}`);
            }

            // Create the job using the repository
            const createdJob = await jobRepository.addJob(value);
            return createdJob;
        } catch (error: unknown) {
            console.error('Error in createJob:', error);
            throw error;
        }
    },

    /**
     * Retrieves all jobs from the database.
     * @returns An array of Job objects.
     * @throws Error if repository operation fails.
     */
    getJobs: async (): Promise<Job[]> => {
        try {
            // Retrieve jobs using the repository
            const jobs = await jobRepository.getJobs();
            return jobs;
        } catch (error: unknown) {
            console.error('Error in getJobs:', error);
            throw new Error('Failed to retrieve jobs.');
        }
    },

    /**
     * Retrieves a job by its ID.
     * @param jobId - The ID of the job to retrieve.
     * @returns The Job object.
     * @throws Error if the job is not found or repository operation fails.
     */
    getJobById: async (jobId: number): Promise<Job> => {
        try {
            // Validate jobId
            if (!Number.isInteger(jobId) || jobId <= 0) {
                throw new Error('Invalid job ID.');
            }

            // Retrieve the job using the repository
            const job = await jobRepository.getJobById(jobId);
            if (!job) {
                throw new Error('Job not found.');
            }

            return job;
        } catch (error: unknown) {
            console.error('Error in getJobById:', error);
            throw error;
        }
    },

    /**
     * Deletes a job by its ID.
     * @param jobId - The ID of the job to delete.
     * @returns A boolean indicating whether the deletion was successful.
     * @throws Error if the job is not found or repository operation fails.
     */
    deleteJob: async (jobId: number): Promise<boolean> => {
        try {
            // Validate jobId
            if (!Number.isInteger(jobId) || jobId <= 0) {
                throw new Error('Invalid job ID.');
            }

            // Delete the job using the repository
            const success = await jobRepository.deleteJob(jobId);
            if (!success) {
                throw new Error('Failed to delete the job.');
            }

            return success;
        } catch (error: unknown) {
            console.error('Error in deleteJob:', error);
            throw error;
        }
    },
};