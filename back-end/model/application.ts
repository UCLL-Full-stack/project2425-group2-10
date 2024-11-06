// back-end/model/application.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  jobId: number;
  applicantName: string;
  applicantEmail: string;
  resumeUrl: string;
  coverLetterUrl: string;
  appliedAt: string; // ISO date string
  jobTitle?: string;
  companyName?: string;
  status: 'Applied' | 'Pending' | 'Interviewing' | 'Rejected' | 'Accepted'; // Status with allowed values
  notes: string;
}

const ApplicationSchema: Schema = new Schema<IApplication>({
  jobId: { type: Number, required: true },
  applicantName: { type: String, required: true },
  applicantEmail: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  coverLetterUrl: { type: String, required: true },
  appliedAt: { type: String, required: true },
  jobTitle: { type: String },
  companyName: { type: String },
  status: {
    type: String,
    enum: ['Applied', 'Pending', 'Interviewing', 'Rejected', 'Accepted'],
    default: 'Applied',
  },
  notes: { type: String },
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);
