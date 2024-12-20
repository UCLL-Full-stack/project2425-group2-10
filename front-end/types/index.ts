// Type for a Job object
export interface Job {
  id: string; // Unique identifier for the job
  title: string; // Title of the job
  companyName: string; // Company offering the job
  description: string; // Detailed description of the job
  skills: string; // Required skills for the job
  experience: string; // Required experience level
  status: "Open" | "Closed"; // Status of the job (can be Open or Closed)
  createdAt: string; // Date when the job was created
}

// Type for an Application object
export interface Application {
  id: string; // Unique identifier for the application
  jobId: string; // The ID of the job this application is for
  userId: string; // The ID of the user applying for the job
  fullName: string; // Applicant's full name
  email: string; // Applicant's email address
  resume: string; // Resume file name or URL
  coverLetter: string; // Cover letter text
  question: string; // Question answered by the applicant
  status: "Pending" | "Screening" | "Interviewing" | "Rejected" | "Accepted"; // Current application status
  createdAt: string; // Date when the application was submitted
}

// Type for User (Job Seeker or Recruiter)
export interface User {
  id: string; // Unique identifier for the user
  email: string; // User's email address
  password: string; // User's password (hashed)
  fullName: string; // Full name of the user
  role: "candidate" | "recruiter" | "admin"; // Role of the user
  createdAt: string; // Date when the user registered
}

// Type for API Response when fetching jobs
export interface JobApiResponse {
  jobs: Job[]; // Array of job objects
  totalCount: number; // Total number of jobs available
}

// Type for API Response when fetching applications
export interface ApplicationApiResponse {
  applications: Application[]; // Array of application objects
  totalCount: number; // Total number of applications available
}

// Type for form input data when applying for a job
export interface ApplyJobFormData {
  fullName: string;
  email: string;
  resume: string;
  coverLetter: string;
  question: string;
}

// Type for context state (if used globally)
export interface AppContextState {
  user: User | null; // Current logged-in user or null if not logged in
  jobs: Job[]; // List of jobs
  applications: Application[]; // List of applications for the logged-in user
}

// Type for handling error responses from API
export interface ErrorResponse {
  message: string; // Error message returned from API
  statusCode: number; // HTTP status code
}

// Type for job filter options (if applying filters to job listings)
export interface JobFilterOptions {
  searchQuery: string; // Search query string for job title or company name
  status: "Open" | "Closed"; // Filter jobs by status
  experienceLevel: string; // Filter jobs by experience level
}