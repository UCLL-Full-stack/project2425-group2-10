// src/domain/Job.ts

import { ApplicationStatus, JobStatus } from '../types';
import { Application } from './application';
import { Skill } from './skill';

export class Job {
  id: number;
  companyName: string;
  jobTitle: string;
  date: Date;
  status: JobStatus;
  description: string;
  skills: Skill[]; // Renamed from requiredSkills to skills
  applications: Application[];
  adminId: number; // Added as required
  createdAt: Date;
  updatedAt: Date;

  constructor(
      id: number,
      companyName: string,
      jobTitle: string,
      date: Date,
      status: JobStatus,
      description: string,
      skills: Skill[],
      applications: Application[],
      adminId: number,
      createdAt: Date,
      updatedAt: Date
  ) {
      this.id = id;
      this.companyName = companyName;
      this.jobTitle = jobTitle;
      this.date = date;
      this.status = status;
      this.description = description;
      this.skills = skills;
      this.applications = applications;
      this.adminId = adminId;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
  }

  /**
   * Maps a Prisma Job object to the domain Job class.
   * 
   * @param prismaJob - The Prisma Job object.
   * @returns The domain Job instance.
   */
  static fromPrisma(prismaJob: any): Job {
      const skills = prismaJob.jobSkills.map((js: any) => Skill.fromPrisma(js.skill));
      const applications = prismaJob.applications.map((app: any) => Application.fromPrisma(app));
      return new Job(
          prismaJob.id,
          prismaJob.companyName,
          prismaJob.jobTitle,
          prismaJob.date,
          prismaJob.status,
          prismaJob.description,
          skills,
          applications,
          prismaJob.adminId, // Ensure adminId is mapped
          prismaJob.createdAt,
          prismaJob.updatedAt
      );
  }
}