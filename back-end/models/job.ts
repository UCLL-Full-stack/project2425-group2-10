export interface Job {
  id: string;
  companyName: string;
  title: string;
  experience: string;
  description: string;
  skills: string;
  status: 'Open' | 'Closed';
  createdAt: Date;
  postedById: string; // ID of the recruiter or admin who posted the job
}