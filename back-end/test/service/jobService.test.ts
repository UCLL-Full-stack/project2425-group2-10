// back-end/tests/jobService.test.ts

import { jobService } from '../../service/jobService';
import { jobRepository } from '../../repository/jobRepository';
import { NewJob, JobStatus, Job } from '../../types';
import { Job as JobModel } from '../../model/job';

// Mock the jobRepository
jest.mock('../../repository/jobRepository');

describe('Job Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createJob', () => {
        it('should create a new job successfully', async () => {
            const newJob: NewJob = {
                companyName: 'Tech Corp',
                jobTitle: 'Software Engineer',
                date: new Date('2024-12-01T00:00:00.000Z'),
                status: JobStatus.Open,
                description: 'Develop and maintain software applications.',
                skills: ['JavaScript', 'TypeScript', 'Node.js'],
                adminId: 1,
            };

            const createdJob: Job = new JobModel(
                1,
                newJob.companyName,
                newJob.jobTitle,
                newJob.date,
                newJob.status,
                newJob.description,
                [], // Assuming no skills for simplicity
                [], // Assuming no applications for simplicity
                newJob.adminId,
                new Date(),
                new Date()
            );

            (jobRepository.addJob as jest.Mock).mockResolvedValue(createdJob);

            const result = await jobService.createJob(newJob);

            expect(jobRepository.addJob).toHaveBeenCalledWith(newJob);
            expect(result).toBe(createdJob);
        });

        it('should throw a validation error if data is invalid', async () => {
            const invalidJob: any = {
                jobTitle: 'Software Engineer',
                date: 'invalid-date',
                status: 'UnknownStatus',
                skills: [],
                adminId: -1,
            };

            await expect(jobService.createJob(invalidJob)).rejects.toThrow('Validation Error');
        });

        it('should propagate repository errors', async () => {
            const newJob: NewJob = {
                companyName: 'Tech Corp',
                jobTitle: 'Software Engineer',
                date: new Date('2024-12-01T00:00:00.000Z'),
                status: JobStatus.Open,
                description: 'Develop and maintain software applications.',
                skills: ['JavaScript', 'TypeScript', 'Node.js'],
                adminId: 1,
            };

            (jobRepository.addJob as jest.Mock).mockRejectedValue(new Error('Repository error'));

            await expect(jobService.createJob(newJob)).rejects.toThrow('Repository error');
        });
    });

    describe('getAllJobs', () => {
        it('should retrieve all jobs successfully', async () => {
            const jobs: Job[] = [
                new JobModel(
                    1,
                    'Tech Corp',
                    'Software Engineer',
                    new Date('2024-12-01T00:00:00.000Z'),
                    JobStatus.Open,
                    'Develop and maintain software applications.',
                    [],
                    [],
                    1,
                    new Date(),
                    new Date()
                ),
                // ... other jobs
            ];

            (jobRepository.getAllJobs as jest.Mock).mockResolvedValue(jobs);

            const result = await jobService.getAllJobs();

            expect(jobRepository.getAllJobs).toHaveBeenCalled();
            expect(result).toBe(jobs);
        });

        it('should propagate repository errors', async () => {
            (jobRepository.getAllJobs as jest.Mock).mockRejectedValue(new Error('Repository error'));

            await expect(jobService.getAllJobs()).rejects.toThrow('Failed to retrieve jobs.');

            expect(jobRepository.getAllJobs).toHaveBeenCalled();
        });
    });

    describe('getJobById', () => {
        it('should retrieve a job by ID successfully', async () => {
            const jobId = 1;
            const job: Job = new JobModel(
                jobId,
                'Tech Corp',
                'Software Engineer',
                new Date('2024-12-01T00:00:00.000Z'),
                JobStatus.Open,
                'Develop and maintain software applications.',
                [],
                [],
                1,
                new Date(),
                new Date()
            );

            (jobRepository.getJobById as jest.Mock).mockResolvedValue(job);

            const result = await jobService.getJobById(jobId);

            expect(jobRepository.getJobById).toHaveBeenCalledWith(jobId);
            expect(result).toBe(job);
        });

        it('should throw an error if job ID is invalid', async () => {
            await expect(jobService.getJobById(-1)).rejects.toThrow('Invalid job ID.');
        });

        it('should throw an error if job is not found', async () => {
            const jobId = 999;
            (jobRepository.getJobById as jest.Mock).mockResolvedValue(null);

            await expect(jobService.getJobById(jobId)).rejects.toThrow('Job not found.');
        });

        it('should propagate repository errors', async () => {
            const jobId = 1;
            (jobRepository.getJobById as jest.Mock).mockRejectedValue(new Error('Repository error'));

            await expect(jobService.getJobById(jobId)).rejects.toThrow('Repository error');
        });
    });

    describe('deleteJob', () => {
        it('should delete a job successfully', async () => {
            const jobId = 1;
            (jobRepository.deleteJob as jest.Mock).mockResolvedValue(true);

            const result = await jobService.deleteJob(jobId);

            expect(jobRepository.deleteJob).toHaveBeenCalledWith(jobId);
            expect(result).toBe(true);
        });

        it('should throw an error if job ID is invalid', async () => {
            await expect(jobService.deleteJob(-1)).rejects.toThrow('Invalid job ID.');
        });

        it('should throw an error if deletion fails', async () => {
            const jobId = 1;
            (jobRepository.deleteJob as jest.Mock).mockResolvedValue(false);

            await expect(jobService.deleteJob(jobId)).rejects.toThrow('Failed to delete the job.');
        });

        it('should propagate repository errors', async () => {
            const jobId = 1;
            (jobRepository.deleteJob as jest.Mock).mockRejectedValue(new Error('Repository error'));

            await expect(jobService.deleteJob(jobId)).rejects.toThrow('Repository error');
        });
    });
});