export interface Application {
    id: string;
    fullName: string;
    email: string;
    resume: string; // Path to the uploaded resume file
    coverLetter: string; // Path to the uploaded cover letter file
    question: string;
    status: 'Pending' | 'Screening' | 'Interviewing' | 'Rejected' | 'Accepted';
    createdAt: Date;
    jobId: string; // ID of the job being applied for
    userId: string; // ID of the candidate applying
  }