import { JobSkill, Skill } from "@types";
import { useEffect, useState } from "react";

type Props = {
   jobSkill: JobSkill; 
   removeSkill: (id: number) => void;
};

const SkillSlider = ({jobSkill, removeSkill}: Props) => {

    const [weight, setWeight] = useState<number>(0);

    useEffect(()=>{
        jobSkill.weight = weight; 
    },[weight]);

    return(
        <div className="p-3 mb-8 border-2 rounded-md border-yellow-400">
            <div className="grid grid-cols-3">
                <label className="text-l w-full font-bold mb-1">{jobSkill.skill.name}</label>
                <p className="text-xl flex items-center justify-center w-1/3 font-bold mb-1">{weight}</p>
                <input
                    type="range"
                    value={weight}
                    onChange={(e) => {setWeight(Number(e.target.value))}}
                    min="0"
                    max="100"
                    className="w-full"
                />
            </div>
            <div className="p-4">{jobSkill.skill.description}</div>
            <div className="flex justify-center">
                <button
                type="button"
                className="bg-gray-200 w-1/2 text-black px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={()=>{removeSkill(jobSkill.skill.id)}}
                >
                    remove
                </button>
            </div>
        </div> 
    )
};

export default SkillSlider;