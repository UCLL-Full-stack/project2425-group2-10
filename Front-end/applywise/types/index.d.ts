// front-end/applywise/types/index.d.ts

export type User = {
  id?: number;
  name?: string;
  age?: number;
  email?: string;
  password?: string;
};

export type Team = {
  id?: number;
  name?: string;
  points?: number;
};

export type Job = {
  id?: number;
  companyId?: number;
  title?: string;
  description?: string;
  deadline?: string; // ISO date string
  requiredSkills?: string[];
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
