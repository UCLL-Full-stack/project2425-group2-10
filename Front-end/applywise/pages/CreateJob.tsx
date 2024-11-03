import Link from "next/link";
import Header from '@components/header';
import React, { useState } from 'react';
import SkillSlider from "@components/skill/SkillSlider";
import {Skill, JobSkill} from "@types"
import JobService from "@services/JobService";
import SkillService from "@services/SkillService";
import { InferGetServerSidePropsType } from "next";

export const getServerSideProps = async () => {
    const skills = await SkillService.getAll();
    return {
        props: {
            skills
        },
    };
};

const CreateJob: React.FC = (
        {skills}: InferGetServerSidePropsType<typeof getServerSideProps>
    ) => {

    const skillsOrEmpty = skills? skills[0].id: 0

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedSkillId, setSelectedSkillId] = useState<number>(skillsOrEmpty);
    const [jobSkills, setJobSkills] = useState<JobSkill[]>([]);
    const jobSkillExists = () => Boolean(jobSkills.find((jobSkill)=>jobSkill.skill.id == selectedSkillId));

    const handleAddJobSkill = () => {
        if (!skills){
            return;
        }

        const newSkill = skills.find((skill) => skill.id == selectedSkillId);
        if(!jobSkillExists()){
            setJobSkills([
                    ...jobSkills,
                    {skill: newSkill}
            ]);
        }
    };

    const handleRemoveJobSkill = (id: Number) => {
        const newJobSkills = jobSkills.filter((jobSkill)=> jobSkill.skill.id != id); 
        setJobSkills(newJobSkills); 
    };

    const handleCreateJob = async () => {
        //create a job with no skills and receive it with an id
        const newJob = await JobService.createJob({title, description});
        jobSkills.forEach((jobSkill: JobSkill)=>{
            jobSkill.job = newJob;      
        });
        //add the jobSkills to the db
        const newJobSkills = await JobService.addSkillsToJob(jobSkills);
        console.log(newJobSkills);
    };

    return (
        <>
            <Header/>
            <form className="max-w-xl my-11 mx-auto p-6 bg-white shadow-xl rounded-md">
                <h2 className="text-center text-2xl font-bold mb-4">Create Job</h2>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>

                <div className="mb-4 ">
                    <label htmlFor="title" className="w-full block text-sm font-medium mb-1">
                    New skill :
                    </label>
                    <div className="flex justify-between">
                        <select
                            value={selectedSkillId}
                            onChange={(e)=> {
                                setSelectedSkillId(Number(e.target.value))
                            }}
                            className="mr-4 border border-gray-300 rounded-md p-2"
                        >
                            {skills? 
                                (skills.map((skill: Skill) => <option key={skill.id} value={skill.id}> {skill.name} </option>)):
                                (<option key={0} >No Skills Available</option>)
                            }
                        </select>

                        <button
                            type="button"
                            className="bg-yellow-400 w-1/2 text-black px-4 py-2 rounded-md hover:bg-gray-300"
                            onClick={handleAddJobSkill}
                        >
                            add 
                        </button>
                    </div>
                </div>

                {jobSkills.map((jobSkill) => 
                    <SkillSlider key={jobSkill.id} jobSkill={jobSkill} removeSkill={handleRemoveJobSkill}/>
                )}

                <div className="flex justify-between">
                    <Link href='/jobs'>
                        <button
                            type="button"
                            className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </Link>
                    <button
                        type="button"
                        onClick={handleCreateJob}
                        className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                        Create
                    </button>
                </div>
            </form>
        </>
    );
};

export default CreateJob;