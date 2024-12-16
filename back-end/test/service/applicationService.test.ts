// back-end/tests/applicationService.test.ts

import { applicationService } from '../../service/applicationService'; // Correct named import
import { applicationRepository } from '../../repository/applicationRepository';
import { jobRepository } from '../../repository/jobRepository'; // Import jobRepository
import { Application, NewApplication, ApplicationStatus, Reminder } from '../../types';
import { Application as ApplicationModel } from '../../model/application';
import { Reminder as ReminderModel } from '../../model/reminder';

// Mock the repositories
jest.mock('../../repository/applicationRepository');
jest.mock('../../repository/jobRepository');

describe('Application Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('applyForJob', () => {
        it('should apply for a job successfully', async () => {
            const jobId = 1;
            const applicantName = 'John Doe';
            const applicantEmail = 'john.doe@example.com';
            const resumeUrl = '/uploads/resumes/john_doe_resume.pdf';
            const coverLetterUrl = '/uploads/coverLetters/john_doe_cover_letter.pdf';

            const newApplication: NewApplication = {
                jobId,
                applicantName,
                applicantEmail,
                resumeUrl,
                coverLetterUrl,
                appliedAt: new Date(),
                status: ApplicationStatus.Applied,
                notes: '',
            };

            const createdApplication: Application = new ApplicationModel(
                1,
                jobId,
                applicantName,
                applicantEmail,
                resumeUrl,
                coverLetterUrl,
                newApplication.appliedAt,
                newApplication.status,
                newApplication.notes,
                [], // Assuming no reminders initially
                new Date(),
                new Date()
            );

            // Mock jobRepository.getJobById
            (jobRepository.getJobById as jest.Mock).mockResolvedValue({ id: jobId });

            // Mock applicationRepository.addApplication
            (applicationRepository.addApplication as jest.Mock).mockResolvedValue(createdApplication);

            const result = await applicationService.applyForJob(
                jobId,
                applicantName,
                applicantEmail,
                resumeUrl,
                coverLetterUrl
            );

            expect(jobRepository.getJobById).toHaveBeenCalledWith(jobId);
            expect(applicationRepository.addApplication).toHaveBeenCalledWith(newApplication);
            expect(result).toBe(createdApplication);
        });

        it('should throw an error if the job does not exist', async () => {
            const jobId = 999;
            const applicantName = 'Jane Doe';
            const applicantEmail = 'jane.doe@example.com';
            const resumeUrl = '/uploads/resumes/jane_doe_resume.pdf';
            const coverLetterUrl = '/uploads/coverLetters/jane_doe_cover_letter.pdf';

            // Mock jobRepository.getJobById to return null
            (jobRepository.getJobById as jest.Mock).mockResolvedValue(null);

            await expect(
                applicationService.applyForJob(
                    jobId,
                    applicantName,
                    applicantEmail,
                    resumeUrl,
                    coverLetterUrl
                )
            ).rejects.toThrow('Job not found.');

            expect(jobRepository.getJobById).toHaveBeenCalledWith(jobId);
            expect(applicationRepository.addApplication).not.toHaveBeenCalled();
        });

        it('should throw an error if repository fails during application creation', async () => {
            const jobId = 1;
            const applicantName = 'John Doe';
            const applicantEmail = 'john.doe@example.com';
            const resumeUrl = '/uploads/resumes/john_doe_resume.pdf';
            const coverLetterUrl = '/uploads/coverLetters/john_doe_cover_letter.pdf';

            const newApplication: NewApplication = {
                jobId,
                applicantName,
                applicantEmail,
                resumeUrl,
                coverLetterUrl,
                appliedAt: new Date(),
                status: ApplicationStatus.Applied,
                notes: '',
            };

            // Mock jobRepository.getJobById
            (jobRepository.getJobById as jest.Mock).mockResolvedValue({ id: jobId });

            // Mock applicationRepository.addApplication to throw an error
            (applicationRepository.addApplication as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                applicationService.applyForJob(
                    jobId,
                    applicantName,
                    applicantEmail,
                    resumeUrl,
                    coverLetterUrl
                )
            ).rejects.toThrow('Database error');

            expect(jobRepository.getJobById).toHaveBeenCalledWith(jobId);
            expect(applicationRepository.addApplication).toHaveBeenCalledWith(newApplication);
        });
    });

    describe('getAllApplications', () => {
        it('should retrieve all applications successfully', async () => {
            const applications: Application[] = [
                new ApplicationModel(
                    1,
                    1,
                    'John Doe',
                    'john.doe@example.com',
                    '/uploads/resumes/john_doe_resume.pdf',
                    '/uploads/coverLetters/john_doe_cover_letter.pdf',
                    new Date(),
                    ApplicationStatus.Applied,
                    'Initial application',
                    [],
                    new Date(),
                    new Date()
                ),
                // ... more applications
            ];

            (applicationRepository.getAllApplications as jest.Mock).mockResolvedValue(applications);

            const result = await applicationService.getAllApplications();

            expect(applicationRepository.getAllApplications).toHaveBeenCalledWith(undefined);
            expect(result).toBe(applications);
        });

        it('should retrieve applications filtered by status', async () => {
            const status = ApplicationStatus.Interviewing;
            const applications: Application[] = [
                new ApplicationModel(
                    2,
                    1,
                    'Jane Doe',
                    'jane.doe@example.com',
                    '/uploads/resumes/jane_doe_resume.pdf',
                    '/uploads/coverLetters/jane_doe_cover_letter.pdf',
                    new Date(),
                    status,
                    'Scheduled for interview',
                    [],
                    new Date(),
                    new Date()
                ),
                // ... more applications
            ];

            (applicationRepository.getAllApplications as jest.Mock).mockResolvedValue(applications);

            const result = await applicationService.getAllApplications(status);

            expect(applicationRepository.getAllApplications).toHaveBeenCalledWith(status);
            expect(result).toBe(applications);
        });

        it('should throw an error if repository fails', async () => {
            (applicationRepository.getAllApplications as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(applicationService.getAllApplications()).rejects.toThrow('Failed to retrieve applications.');

            expect(applicationRepository.getAllApplications).toHaveBeenCalledWith(undefined);
        });
    });

    describe('getApplicationsByStatus', () => {
        it('should retrieve applications by specific status successfully', async () => {
            const status = ApplicationStatus.Accepted; // Changed from 'Offered' to 'Accepted'
            const applications: Application[] = [
                new ApplicationModel(
                    3,
                    2,
                    'Alice Smith',
                    'alice.smith@example.com',
                    '/uploads/resumes/alice_smith_resume.pdf',
                    '/uploads/coverLetters/alice_smith_cover_letter.pdf',
                    new Date(),
                    status,
                    'Offer extended',
                    [],
                    new Date(),
                    new Date()
                ),
                // ... more applications
            ];

            (applicationRepository.getApplicationsByStatus as jest.Mock).mockResolvedValue(applications);

            const result = await applicationService.getApplicationsByStatus(status);

            expect(applicationRepository.getApplicationsByStatus).toHaveBeenCalledWith(status);
            expect(result).toBe(applications);
        });

        it('should throw an error if repository fails', async () => {
            const status = ApplicationStatus.Pending;

            (applicationRepository.getApplicationsByStatus as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(applicationService.getApplicationsByStatus(status)).rejects.toThrow('Failed to retrieve applications by status.');

            expect(applicationRepository.getApplicationsByStatus).toHaveBeenCalledWith(status);
        });
    });

    describe('updateApplicationStatus', () => {
        it('should update the status of an application successfully', async () => {
            const applicationId = 1;
            const newStatus = ApplicationStatus.Interviewing;

            const updatedApplication: Application = new ApplicationModel(
                applicationId,
                1,
                'John Doe',
                'john.doe@example.com',
                '/uploads/resumes/john_doe_resume.pdf',
                '/uploads/coverLetters/john_doe_cover_letter.pdf',
                new Date(),
                newStatus,
                'Moved to interviewing stage',
                [],
                new Date(),
                new Date()
            );

            (applicationRepository.updateApplicationStatus as jest.Mock).mockResolvedValue(updatedApplication);

            const result = await applicationService.updateApplicationStatus(applicationId, newStatus);

            expect(applicationRepository.updateApplicationStatus).toHaveBeenCalledWith(applicationId, newStatus);
            expect(result).toBe(updatedApplication);
        });

        it('should throw an error if an invalid status is provided', async () => {
            const applicationId = 1;
            const invalidStatus = 'Offered' as ApplicationStatus; // 'Offered' is not a valid enum value

            await expect(
                applicationService.updateApplicationStatus(applicationId, invalidStatus)
            ).rejects.toThrow('Invalid application status provided.');

            expect(applicationRepository.updateApplicationStatus).not.toHaveBeenCalled();
        });

        it('should throw an error if application is not found', async () => {
            const applicationId = 999;
            const newStatus = ApplicationStatus.Accepted;

            (applicationRepository.updateApplicationStatus as jest.Mock).mockResolvedValue(null);

            await expect(
                applicationService.updateApplicationStatus(applicationId, newStatus)
            ).rejects.toThrow('Application not found or failed to update.');

            expect(applicationRepository.updateApplicationStatus).toHaveBeenCalledWith(applicationId, newStatus);
        });

        it('should throw an error if repository fails', async () => {
            const applicationId = 1;
            const newStatus = ApplicationStatus.Rejected;

            (applicationRepository.updateApplicationStatus as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                applicationService.updateApplicationStatus(applicationId, newStatus)
            ).rejects.toThrow('Database error');

            expect(applicationRepository.updateApplicationStatus).toHaveBeenCalledWith(applicationId, newStatus);
        });
    });

    describe('updateApplicationNotes', () => {
        it('should update the notes of an application successfully', async () => {
            const applicationId = 1;
            const newNotes = 'Candidate has a strong portfolio.';

            const updatedApplication: Application = new ApplicationModel(
                applicationId,
                1,
                'John Doe',
                'john.doe@example.com',
                '/uploads/resumes/john_doe_resume.pdf',
                '/uploads/coverLetters/john_doe_cover_letter.pdf',
                new Date(),
                ApplicationStatus.Applied,
                newNotes,
                [],
                new Date(),
                new Date()
            );

            (applicationRepository.updateApplicationNotes as jest.Mock).mockResolvedValue(updatedApplication);

            const result = await applicationService.updateApplicationNotes(applicationId, newNotes);

            expect(applicationRepository.updateApplicationNotes).toHaveBeenCalledWith(applicationId, newNotes.trim());
            expect(result).toBe(updatedApplication);
        });

        it('should throw an error if notes are not a string', async () => {
            const applicationId = 1;
            const invalidNotes = 12345 as any;

            await expect(
                applicationService.updateApplicationNotes(applicationId, invalidNotes)
            ).rejects.toThrow('Notes must be a string.');

            expect(applicationRepository.updateApplicationNotes).not.toHaveBeenCalled();
        });

        it('should throw an error if application is not found', async () => {
            const applicationId = 999;
            const newNotes = 'Updated notes.';

            (applicationRepository.updateApplicationNotes as jest.Mock).mockResolvedValue(null);

            await expect(
                applicationService.updateApplicationNotes(applicationId, newNotes)
            ).rejects.toThrow('Application not found or failed to update notes.');

            expect(applicationRepository.updateApplicationNotes).toHaveBeenCalledWith(applicationId, newNotes.trim());
        });

        it('should throw an error if repository fails', async () => {
            const applicationId = 1;
            const newNotes = 'Updated notes.';

            (applicationRepository.updateApplicationNotes as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                applicationService.updateApplicationNotes(applicationId, newNotes)
            ).rejects.toThrow('Database error');

            expect(applicationRepository.updateApplicationNotes).toHaveBeenCalledWith(applicationId, newNotes.trim());
        });
    });

    describe('deleteApplication', () => {
        it('should delete an application successfully', async () => {
            const applicationId = 1;

            (applicationRepository.deleteApplication as jest.Mock).mockResolvedValue(true);

            const result = await applicationService.deleteApplication(applicationId);

            expect(applicationRepository.deleteApplication).toHaveBeenCalledWith(applicationId);
            expect(result).toBe(true);
        });

        it('should throw an error if deletion fails', async () => {
            const applicationId = 999;

            (applicationRepository.deleteApplication as jest.Mock).mockResolvedValue(false);

            await expect(
                applicationService.deleteApplication(applicationId)
            ).rejects.toThrow('Failed to delete the application.');

            expect(applicationRepository.deleteApplication).toHaveBeenCalledWith(applicationId);
        });

        it('should throw an error if repository fails', async () => {
            const applicationId = 1;

            (applicationRepository.deleteApplication as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                applicationService.deleteApplication(applicationId)
            ).rejects.toThrow('Database error');

            expect(applicationRepository.deleteApplication).toHaveBeenCalledWith(applicationId);
        });
    });

    describe('setReminder', () => {
        it('should set a reminder successfully', async () => {
            const applicationId = 1;
            const reminderDate = '2024-11-25T10:00:00.000Z';
            const message = 'Prepare for the technical interview.';

            const reminder: Reminder = new ReminderModel(
                1,
                applicationId,
                new Date(reminderDate),
                message,
                new Date(),
                new Date()
            );

            // Mock applicationRepository.setReminder
            (applicationRepository.setReminder as jest.Mock).mockResolvedValue(reminder);

            const result = await applicationService.setReminder(applicationId, reminderDate, message);

            expect(applicationRepository.setReminder).toHaveBeenCalledWith(
                applicationId,
                new Date(reminderDate),
                message.trim()
            );
            expect(result).toBe(reminder);
        });

        it('should throw an error if reminder date is invalid', async () => {
            const applicationId = 1;
            const invalidReminderDate = 'invalid-date';
            const message = 'Invalid reminder date.';

            await expect(
                applicationService.setReminder(applicationId, invalidReminderDate, message)
            ).rejects.toThrow('Invalid reminder date.');

            expect(applicationRepository.setReminder).not.toHaveBeenCalled();
        });

        it('should throw an error if reminder message is not a string', async () => {
            const applicationId = 1;
            const reminderDate = '2024-11-25T10:00:00.000Z';
            const invalidMessage = 12345 as any;

            await expect(
                applicationService.setReminder(applicationId, reminderDate, invalidMessage)
            ).rejects.toThrow('Reminder message must be a string.');

            expect(applicationRepository.setReminder).not.toHaveBeenCalled();
        });

        it('should throw an error if application does not exist', async () => {
            const applicationId = 999;
            const reminderDate = '2024-11-25T10:00:00.000Z';
            const message = 'Prepare for the technical interview.';

            (applicationRepository.setReminder as jest.Mock).mockResolvedValue(null);

            await expect(
                applicationService.setReminder(applicationId, reminderDate, message)
            ).rejects.toThrow('Failed to set reminder. Application may not exist.');

            expect(applicationRepository.setReminder).toHaveBeenCalledWith(
                applicationId,
                new Date(reminderDate),
                message.trim()
            );
        });

        it('should throw an error if repository fails', async () => {
            const applicationId = 1;
            const reminderDate = '2024-11-25T10:00:00.000Z';
            const message = 'Prepare for the technical interview.';

            (applicationRepository.setReminder as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                applicationService.setReminder(applicationId, reminderDate, message)
            ).rejects.toThrow('Database error');

            expect(applicationRepository.setReminder).toHaveBeenCalledWith(
                applicationId,
                new Date(reminderDate),
                message.trim()
            );
        });
    });

    describe('updateReminder', () => {
        it('should update a reminder successfully', async () => {
            const reminderId = 1;
            const newReminderDate = '2024-11-26T10:00:00.000Z';
            const newMessage = 'Final review before the interview.';

            const updatedReminder: Reminder = new ReminderModel(
                reminderId,
                1,
                new Date(newReminderDate),
                newMessage,
                new Date(),
                new Date()
            );

            (applicationRepository.updateReminder as jest.Mock).mockResolvedValue(updatedReminder);

            const result = await applicationService.updateReminder(reminderId, newReminderDate, newMessage);

            expect(applicationRepository.updateReminder).toHaveBeenCalledWith(
                reminderId,
                new Date(newReminderDate),
                newMessage.trim()
            );
            expect(result).toBe(updatedReminder);
        });

        it('should throw an error if reminder date is invalid', async () => {
            const reminderId = 1;
            const invalidReminderDate = 'invalid-date';
            const newMessage = 'Invalid reminder date.';

            await expect(
                applicationService.updateReminder(reminderId, invalidReminderDate, newMessage)
            ).rejects.toThrow('Invalid reminder date.');

            expect(applicationRepository.updateReminder).not.toHaveBeenCalled();
        });

        it('should throw an error if reminder message is not a string', async () => {
            const reminderId = 1;
            const newReminderDate = '2024-11-26T10:00:00.000Z';
            const invalidMessage = 67890 as any;

            await expect(
                applicationService.updateReminder(reminderId, newReminderDate, invalidMessage)
            ).rejects.toThrow('Reminder message must be a string.');

            expect(applicationRepository.updateReminder).not.toHaveBeenCalled();
        });

        it('should throw an error if reminder is not found', async () => {
            const reminderId = 999;
            const newReminderDate = '2024-11-26T10:00:00.000Z';
            const newMessage = 'Final review before the interview.';

            (applicationRepository.updateReminder as jest.Mock).mockResolvedValue(null);

            await expect(
                applicationService.updateReminder(reminderId, newReminderDate, newMessage)
            ).rejects.toThrow('Reminder not found or failed to update.');

            expect(applicationRepository.updateReminder).toHaveBeenCalledWith(
                reminderId,
                new Date(newReminderDate),
                newMessage.trim()
            );
        });

        it('should throw an error if repository fails', async () => {
            const reminderId = 1;
            const newReminderDate = '2024-11-26T10:00:00.000Z';
            const newMessage = 'Final review before the interview.';

            (applicationRepository.updateReminder as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                applicationService.updateReminder(reminderId, newReminderDate, newMessage)
            ).rejects.toThrow('Database error');

            expect(applicationRepository.updateReminder).toHaveBeenCalledWith(
                reminderId,
                new Date(newReminderDate),
                newMessage.trim()
            );
        });
    });

    describe('deleteReminder', () => {
        it('should delete a reminder successfully', async () => {
            const reminderId = 1;

            (applicationRepository.deleteReminder as jest.Mock).mockResolvedValue(true);

            const result = await applicationService.deleteReminder(reminderId);

            expect(applicationRepository.deleteReminder).toHaveBeenCalledWith(reminderId);
            expect(result).toBe(true);
        });

        it('should throw an error if deletion fails', async () => {
            const reminderId = 999;

            (applicationRepository.deleteReminder as jest.Mock).mockResolvedValue(false);

            await expect(
                applicationService.deleteReminder(reminderId)
            ).rejects.toThrow('Failed to delete the reminder.');

            expect(applicationRepository.deleteReminder).toHaveBeenCalledWith(reminderId);
        });

        it('should throw an error if repository fails', async () => {
            const reminderId = 1;

            (applicationRepository.deleteReminder as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(
                applicationService.deleteReminder(reminderId)
            ).rejects.toThrow('Database error');

            expect(applicationRepository.deleteReminder).toHaveBeenCalledWith(reminderId);
        });
    });
});