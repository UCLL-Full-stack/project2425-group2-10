export interface Reminder {
    id: string;
    content: string;
    jobId: string; // ID of the related job
    applicationId: string; // ID of the related application
    createdAt: Date;
  }