import { Skill } from "@types";

const getAll = async (): Promise<Skill[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const skillsJson = await fetch(apiUrl + "/skills", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await skillsJson.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const createSkill = async (skill: Skill): Promise<Skill[]> => {
  try {
    const skillsJson = await fetch("/api/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skill),
    });
    return await skillsJson.json();
  } catch (error) {
    console.error("Error handling request:", error);
    return null;
  }
};

const SkillService = {
  getAll,
  createSkill,
};

export default SkillService;