// back-end/src/repository/jobRepository.ts

import { PrismaClient, Job as PrismaJob, Skill as PrismaSkill } from '@prisma/client';
import { Job, NewJob } from '../types';
import { Job as JobModel } from '../model/job'; // Domain model

const prisma = new PrismaClient();

export const jobRepository = {
    /**
     * Adds a new job to the database along with its required skills.
     * It connects existing skills or creates new ones if they don't exist.
     * 
     * @param newJob - The job data to add, including skill names.
     * @returns The created Job object.
     */
    addJob: async (newJob: NewJob): Promise<Job> => {
        try {
            // Prepare the skills: connect existing or create new
            const skills = newJob.skills.map(skillName => ({
                where: { name: skillName },
                create: { name: skillName },
            }));

            const prismaJob: PrismaJob & { jobSkills: { skill: PrismaSkill }[] } = await prisma.job.create({
                data: {
                    companyName: newJob.companyName,
                    jobTitle: newJob.jobTitle,
                    date: newJob.date,
                    status: newJob.status,
                    description: newJob.description,
                    adminId: newJob.adminId,
                    jobSkills: {
                        create: skills.map(skill => ({
                            skill: {
                                connectOrCreate: skill,
                            },
                        })),
                    },
                },
                include: {
                    jobSkills: {
                        include: {
                            skill: true,
                        },
                    },
                    applications: true, // Include relations if needed
                },
            });

            // Map PrismaJob to domain Job
            const domainJob = JobModel.fromPrisma(prismaJob);

            return domainJob;
        } catch (error: unknown) {
            console.error('Error in addJob:', error);
            throw new Error('Failed to add job.');
        }
    },

    /**
     * Retrieves all jobs from the database along with their associated skills.
     * 
     * @returns An array of Job objects.
     */
    getAllJobs: async (): Promise<Job[]> => {
        try {
            const prismaJobs: (PrismaJob & {
                jobSkills: { skill: PrismaSkill }[];
                applications: any[]; // Replace 'any' with your Application type if defined
            })[] = await prisma.job.findMany({
                include: {
                    jobSkills: {
                        include: {
                            skill: true,
                        },
                    },
                    applications: true, // Include relations if needed
                },
            });

            // Map each PrismaJob to domain Job
            const domainJobs = prismaJobs.map(prismaJob => JobModel.fromPrisma(prismaJob));

            return domainJobs;
        } catch (error: unknown) {
            console.error('Error in getAllJobs:', error);
            throw new Error('Failed to retrieve jobs.');
        }
    },

    /**
     * Retrieves a single job by its ID along with its associated skills.
     * 
     * @param jobId - The ID of the job to retrieve.
     * @returns The Job object or null if not found.
     */
    getJobById: async (jobId: number): Promise<Job | null> => {
        try {
            const prismaJob: PrismaJob & {
                jobSkills: { skill: PrismaSkill }[];
                applications: any[]; // Replace 'any' with your Application type if defined
            } | null = await prisma.job.findUnique({
                where: { id: jobId },
                include: {
                    jobSkills: {
                        include: {
                            skill: true,
                        },
                    },
                    applications: true, // Include relations if needed
                },
            });

            if (!prismaJob) {
                return null;
            }

            // Map PrismaJob to domain Job
            const domainJob = JobModel.fromPrisma(prismaJob);

            return domainJob;
        } catch (error: unknown) {
            console.error('Error in getJobById:', error);
            throw new Error('Failed to retrieve job.');
        }
    },

    /**
     * Deletes a job by its ID from the database.
     * Also deletes associated JobSkill entries due to cascading deletes.
     * 
     * @param jobId - The ID of the job to delete.
     * @returns A boolean indicating whether the deletion was successful.
     */
    deleteJob: async (jobId: number): Promise<boolean> => {
        try {
            await prisma.job.delete({
                where: { id: jobId },
            });
            return true;
        } catch (error: unknown) {
            console.error('Error in deleteJob:', error);
            throw new Error('Failed to delete job.');
        }
    },

    // ... Other repository methods as needed
};