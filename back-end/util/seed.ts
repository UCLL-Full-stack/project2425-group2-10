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
    {
        companyName: 'Marketing Wizards Co',
        jobTitle: 'Digital Marketing Specialist',
        date: '2024-07-12',
        status: 'Open',
        description: 'Create and manage online marketing campaigns.',
        requiredSkills: ['SEO', 'Google Analytics', 'Content Creation', 'PPC Advertising'],
        adminId: 4,
    },
    {
        companyName: 'Green Energy Corp',
        jobTitle: 'Project Manager',
        date: '2024-06-20',
        status: 'Open',
        description: 'Oversee and manage renewable energy projects.',
        requiredSkills: ['Project Management', 'Budgeting', 'Leadership', 'Risk Management'],
        adminId: 5,
    },
    {
        companyName: 'E-commerce Pioneers',
        jobTitle: 'UI/UX Designer',
        date: '2024-06-25',
        status: 'Open',
        description: 'Design intuitive and visually appealing user interfaces.',
        requiredSkills: ['Figma', 'Adobe XD', 'Wireframing', 'User Research'],
        adminId: 1,
    },
    {
        companyName: 'Secure Tech Solutions',
        jobTitle: 'Cybersecurity Specialist',
        date: '2024-07-05',
        status: 'Open',
        description: 'Implement and monitor security protocols to protect company data.',
        requiredSkills: ['Cybersecurity', 'Firewalls', 'Incident Response', 'Ethical Hacking'],
        adminId: 2,
    },
    {
        companyName: 'Global Logistics Ltd',
        jobTitle: 'Supply Chain Manager',
        date: '2024-06-18',
        status: 'Open',
        description: 'Coordinate and oversee the supply chain process to ensure efficiency.',
        requiredSkills: ['Supply Chain Management', 'Logistics', 'ERP Systems', 'Negotiation'],
        adminId: 3,
    },
    {
        companyName: 'Startup Hub',
        jobTitle: 'Business Development Executive',
        date: '2024-07-10',
        status: 'Open',
        description: 'Identify new business opportunities and partnerships for growth.',
        requiredSkills: ['Sales', 'Networking', 'Market Research', 'Communication'],
        adminId: 4,
    },
    {
        companyName: 'Innovate Solutions',
        jobTitle: 'DevOps Engineer',
        date: '2024-07-20',
        status: 'Open',
        description: 'Maintain and enhance CI/CD pipelines and cloud infrastructure.',
        requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        adminId: 5,
    },
    {
        companyName: 'Finance Gurus LLC',
        jobTitle: 'Financial Analyst',
        date: '2024-07-15',
        status: 'Open',
        description: 'Evaluate financial data and prepare forecasts to guide business strategy.',
        requiredSkills: ['Excel', 'Financial Modelling', 'Data Analysis', 'Presentation Skills'],
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
    {
        jobId: 1,
        applicantName: 'Emily Johnson',
        applicantEmail: 'emily.johnson@example.com',
        resumeUrl: '/uploads/resumes/emily_johnson_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/emily_johnson_cover_letter.docx',
        appliedAt: new Date('2024-06-16T10:30:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'Software Engineer',
        companyName: 'Tech Innovators Inc',
    },
    {
        jobId: 2,
        applicantName: 'Michael Brown',
        applicantEmail: 'michael.brown@example.com',
        resumeUrl: '/uploads/resumes/michael_brown_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/michael_brown_cover_letter.docx',
        appliedAt: new Date('2024-07-02T11:00:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'Systems Analyst',
        companyName: 'Healthcare Solutions Ltd',
    },
    {
        jobId: 3,
        applicantName: 'Sarah Thompson',
        applicantEmail: 'sarah.thompson@example.com',
        resumeUrl: '/uploads/resumes/sarah_thompson_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/sarah_thompson_cover_letter.docx',
        appliedAt: new Date('2024-07-13T14:15:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'Digital Marketing Specialist',
        companyName: 'Marketing Wizards Co',
    },
    {
        jobId: 4,
        applicantName: 'David White',
        applicantEmail: 'david.white@example.com',
        resumeUrl: '/uploads/resumes/david_white_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/david_white_cover_letter.docx',
        appliedAt: new Date('2024-06-21T09:45:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'Project Manager',
        companyName: 'Green Energy Corp',
    },
    {
        jobId: 5,
        applicantName: 'Jessica Lee',
        applicantEmail: 'jessica.lee@example.com',
        resumeUrl: '/uploads/resumes/jessica_lee_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/jessica_lee_cover_letter.docx',
        appliedAt: new Date('2024-06-26T15:10:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'UI/UX Designer',
        companyName: 'E-commerce Pioneers',
    },
    {
        jobId: 6,
        applicantName: 'Christopher Adams',
        applicantEmail: 'christopher.adams@example.com',
        resumeUrl: '/uploads/resumes/christopher_adams_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/christopher_adams_cover_letter.docx',
        appliedAt: new Date('2024-07-06T08:50:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'Cybersecurity Specialist',
        companyName: 'Secure Tech Solutions',
    },
    {
        jobId: 7,
        applicantName: 'Sophia Martinez',
        applicantEmail: 'sophia.martinez@example.com',
        resumeUrl: '/uploads/resumes/sophia_martinez_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/sophia_martinez_cover_letter.docx',
        appliedAt: new Date('2024-06-19T13:25:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'Supply Chain Manager',
        companyName: 'Global Logistics Ltd',
    },
    {
        jobId: 8,
        applicantName: 'Daniel Walker',
        applicantEmail: 'daniel.walker@example.com',
        resumeUrl: '/uploads/resumes/daniel_walker_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/daniel_walker_cover_letter.docx',
        appliedAt: new Date('2024-07-11T12:40:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'Business Development Executive',
        companyName: 'Startup Hub',
    },
    {
        jobId: 9,
        applicantName: 'Olivia Gonzalez',
        applicantEmail: 'olivia.gonzalez@example.com',
        resumeUrl: '/uploads/resumes/olivia_gonzalez_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/olivia_gonzalez_cover_letter.docx',
        appliedAt: new Date('2024-07-21T16:30:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'DevOps Engineer',
        companyName: 'Innovate Solutions',
    },
    {
        jobId: 10,
        applicantName: 'William Carter',
        applicantEmail: 'william.carter@example.com',
        resumeUrl: '/uploads/resumes/william_carter_resume.pdf',
        coverLetterUrl: '/uploads/coverLetters/william_carter_cover_letter.docx',
        appliedAt: new Date('2024-07-16T10:05:00Z').toISOString(),
        status: 'Applied',
        jobTitle: 'Financial Analyst',
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
