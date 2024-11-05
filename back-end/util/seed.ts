// back-end/util/seed.ts

import { adminRepository } from '../repository/adminRepository';
import { jobRepository } from '../repository/jobRepository';

// Seed initial admins
adminRepository.addAdmin({
    name: 'Admin One',
    email: 'admin1@example.com',
});

adminRepository.addAdmin({
    name: 'Admin Two',
    email: 'admin2@example.com',
});

// Seed initial jobs
jobRepository.addJob({
    companyName: 'Tech Corp',
    jobTitle: 'Software Engineer',
    date: '2024-11-15',
    status: 'Open',
    description: 'Develop and maintain web applications.',
    requiredSkills: ['JavaScript', 'React', 'Node.js'],
    adminId: 1,
});
