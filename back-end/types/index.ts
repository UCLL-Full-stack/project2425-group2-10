/**
 * User Roles
 */
export type UserRole = "admin" | "recruiter" | "candidate";

/**
 * Common Types for API Responses
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

/**
 * Authentication Request
 */
export interface AuthRequest {
  email: string;
  password: string;
}

/**
 * User Object
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

/**
 * Job Object
 */
export interface Job {
  id: string;
  companyName: string;
  title: string;
  experience: string;
  description: string;
  skills: string;
  status: "Open" | "Closed";
  createdAt: Date;
  postedById: string; // ID of the user who posted the job
}

/**
 * Application Object
 */
export interface Application {
  id: string;
  fullName: string;
  email: string;
  resume: string; // Path to the uploaded resume
  coverLetter: string; // Path to the uploaded cover letter
  question?: string;
  status: "Pending" | "Screening" | "Interviewing" | "Rejected" | "Accepted";
  createdAt: Date;
  jobId: string; // ID of the associated job
  userId: string; // ID of the candidate who applied
}

/**
 * Admin Object (extends User)
 */
export interface Admin extends User {}

/**
 * Recruiter Object (extends User)
 */
export interface Recruiter extends User {}

/**
 * Candidate Object (extends User)
 */
export interface Candidate extends User {}