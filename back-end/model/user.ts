// back-end/model/user.ts

export interface User {
    id: number;
    name: string;
    email: string;
    password: string; // Hashed password
    role: 'user' | 'admin'; // 'user' is applicant, 'admin' is recruiter
  }
  