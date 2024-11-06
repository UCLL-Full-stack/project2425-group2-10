// back-end/util/seed.ts

import { jobRepository } from '../repository/jobRepository';
import { applicationRepository } from '../repository/applicationRepository';
import { Job, Application } from '../types';

/**
 * Seeds the in-memory repositories with initial data.
 * This function adds predefined jobs and applications to the repositories.
 * It's intended to be run once at server startup.
 */
const seedJobs: Omit<Job, 'id'>[] = [
    {
        companyName: 'Tech Innovators Inc.',
        jobTitle: 'Frontend Developer',
        date: '2024-04-15',
        status: 'Open',
        description: 'Develop and maintain the user interface of our main product.',
        requiredSkills: ['JavaScript', 'TypeScript', 'React', 'CSS'],
        adminId: 1,
    },
    {
        companyName: 'HealthCare Solutions',
        jobTitle: 'Backend Developer',
        date: '2024-05-01',
        status: 'Open',
        description: 'Design and implement server-side logic for our healthcare platform.',
        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'Docker'],
        adminId: 1,
    },
    {
        companyName: 'Finance Gurus LLC',
        jobTitle: 'Data Analyst',
        date: '2024-06-10',
        status: 'Open',
        description: 'Analyze financial data to support business decisions.',
        requiredSkills: ['Python', 'SQL', 'Data Visualization', 'Excel'],
        adminId: 1,
    },
    // Add more jobs as needed
];

const seedApplications: Omit<Application, 'id'>[] = [
    {
        jobId: 1,
        applicantName: 'Alice Johnson',
        applicantEmail: 'alice.johnson@example.com',
        resumeUrl: '/uploads/resumes/alice_johnson_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/alice_johnson_cover_letter.docx',
        appliedAt: new Date('2024-04-16T10:30:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'Frontend Developer',
        companyName: 'Tech Innovators Inc.',
    },
    {
        jobId: 2,
        applicantName: 'Bob Smith',
        applicantEmail: 'bob.smith@example.com',
        resumeUrl: '/uploads/resumes/bob_smith_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/bob_smith_cover_letter.docx',
        appliedAt: new Date('2024-05-02T14:45:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'Backend Developer',
        companyName: 'HealthCare Solutions',
    },
    {
        jobId: 3,
        applicantName: 'Charlie Davis',
        applicantEmail: 'charlie.davis@example.com',
        resumeUrl: '/uploads/resumes/charlie_davis_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/charlie_davis_cover_letter.docx',
        appliedAt: new Date('2024-06-11T09:20:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'Data Analyst',
        companyName: 'Finance Gurus LLC',
    },
    // Add more applications as needed
];

/**
 * Seeds the job repository with predefined jobs.
 */
const seedJobRepository = () => {
    seedJobs.forEach(job => {
        // Since id is auto-incremented, simply add the job
        const addedJob = jobRepository.addJob(job);
        console.log(`Seeded Job: ${addedJob.jobTitle} at ${addedJob.companyName}`);
    });
};

/**
 * Seeds the application repository with predefined applications.
 */
const seedApplicationRepository = () => {
    seedApplications.forEach(application => {
        // Check if the job exists before adding the application
        const job = jobRepository.getJobById(application.jobId);
        if (job) {
            const addedApplication = applicationRepository.addApplication(application);
            console.log(`Seeded Application: ${addedApplication.applicantName} for ${addedApplication.jobTitle}`);
        } else {
            console.log(`Job ID ${application.jobId} not found. Skipping application for ${application.applicantName}.`);
        }
    });
};

/**
 * Main seed function to initialize repositories.
 */
export const seed = () => {
    console.log('Seeding the in-memory repositories with initial data...');
    seedJobRepository();
    seedApplicationRepository();
    console.log('Seeding completed.');
};

// Execute the seed function when this script is run
seed();
