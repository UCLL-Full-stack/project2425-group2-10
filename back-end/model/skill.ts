// src/domain/Skill.ts

export class Skill {
    id: number;
    name: string;
    // To prevent circular dependencies, we omit the jobs array or handle it carefully

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromPrisma(prismaSkill: any): Skill {
        return new Skill(
            prismaSkill.id,
            prismaSkill.name
            // Omitting jobs to prevent circular dependencies
        );
    }
}