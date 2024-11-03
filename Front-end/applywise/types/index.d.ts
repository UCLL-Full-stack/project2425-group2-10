export type User = {
    id: number;
    name: string;
    age: number;
    email: string;
    password: string;
  };
  
  export type Team = {
    id: number;
    name: string;
    points: number;
  };
  
  export type Job = {
    id: number;
    title: string;
    description: string;
  };
  
  export type StatusMessage = {
    message: string;
    type: "error" | "success";
  };
  
  export type Skill = {
    id?: number;
    name?: string;
    description?: string;
    category?: string;
    level?: string;
  };