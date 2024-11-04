// back-end/model/application.ts

export interface Application {
    id: number;
    jobId: number;
    userId: number;
    resumePath: string;
    coverLetterPath: string;
    status: 'Applied' | 'Reviewed' | 'Interviewed' | 'Rejected' | 'Accepted';
    appliedAt: Date;
  }
  