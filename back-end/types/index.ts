// back-end/types/index.ts

export interface Company {
    id: number;
    name: string;
    address: string;
    website: string;
  }
  
  export interface JobOpportunity {
    id: number;
    companyId: number;
    title: string;
    description: string;
    deadline: string; // ISO date string
    requiredSkills: string[];
  }
  