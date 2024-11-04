// back-end/model/admin.ts

export interface Admin {
    id: number;
    name: string;
    email: string;
    password: string; // Hashed password
  }
  
  export interface AdminInfo {
    id: number;
    name: string;
    email: string;
  }
  