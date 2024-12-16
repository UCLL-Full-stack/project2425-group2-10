// back-end/src/repository/skillRepository.ts

import { PrismaClient, Skill as PrismaSkill } from '@prisma/client';
import { Skill } from '../model/skill';
import { Skill as SkillType } from '../types';

const prisma = new PrismaClient();

export const skillRepository = {
    /**
     * Adds a new skill to the database.
     * 
     * @param name - The name of the skill to add.
     * @returns The created Skill object.
     */
    addSkill: async (name: string): Promise<SkillType> => {
        try {
            const prismaSkill: PrismaSkill = await prisma.skill.create({
                data: { name },
            });

            const domainSkill = Skill.fromPrisma(prismaSkill);

            return {
                id: domainSkill.id,
                name: domainSkill.name,
            };
        } catch (error: unknown) {
            console.error('Error in addSkill:', error);
            throw new Error('Failed to add skill.');
        }
    },

    /**
     * Retrieves all skills from the database.
     * 
     * @returns An array of Skill objects.
     */
    getAllSkills: async (): Promise<SkillType[]> => {
        try {
            const prismaSkills: PrismaSkill[] = await prisma.skill.findMany();

            const domainSkills = prismaSkills.map(prismaSkill => Skill.fromPrisma(prismaSkill));

            return domainSkills.map(skill => ({
                id: skill.id,
                name: skill.name,
            }));
        } catch (error: unknown) {
            console.error('Error in getAllSkills:', error);
            throw new Error('Failed to retrieve skills.');
        }
    },

    /**
     * Retrieves a single skill by its ID.
     * 
     * @param skillId - The ID of the skill to retrieve.
     * @returns The Skill object or null if not found.
     */
    getSkillById: async (skillId: number): Promise<SkillType | null> => {
        try {
            const prismaSkill: PrismaSkill | null = await prisma.skill.findUnique({
                where: { id: skillId },
            });

            if (!prismaSkill) {
                return null;
            }

            const domainSkill = Skill.fromPrisma(prismaSkill);

            return {
                id: domainSkill.id,
                name: domainSkill.name,
            };
        } catch (error: unknown) {
            console.error('Error in getSkillById:', error);
            throw new Error('Failed to retrieve skill.');
        }
    },

    /**
     * Updates an existing skill's name by its ID.
     * 
     * @param skillId - The ID of the skill to update.
     * @param newName - The new name for the skill.
     * @returns The updated Skill object or null if not found.
     */
    updateSkill: async (skillId: number, newName: string): Promise<SkillType | null> => {
        try {
            const prismaSkill: PrismaSkill | null = await prisma.skill.update({
                where: { id: skillId },
                data: { name: newName },
            });

            if (!prismaSkill) {
                return null;
            }

            const domainSkill = Skill.fromPrisma(prismaSkill);

            return {
                id: domainSkill.id,
                name: domainSkill.name,
            };
        } catch (error: any) {
            console.error('Error in updateSkill:', error);
            if (error.code === 'P2025') { // Prisma error code for record not found
                return null;
            }
            throw new Error('Failed to update skill.');
        }
    },

    /**
     * Deletes a skill by its ID from the database.
     * 
     * @param skillId - The ID of the skill to delete.
     * @returns A boolean indicating whether the deletion was successful.
     */
    deleteSkill: async (skillId: number): Promise<boolean> => {
        try {
            await prisma.skill.delete({
                where: { id: skillId },
            });
            return true;
        } catch (error: any) {
            console.error('Error in deleteSkill:', error);
            if (error.code === 'P2025') { // Prisma error code for record not found
                return false;
            }
            throw new Error('Failed to delete skill.');
        }
    },
};