import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { useEffect, useState } from "react";

const CreateSkillModal = (props : any) => {
    const [skillName, setSkillName] = useState<string>("");
    const [skillDescription, setSkillDescription] = useState<string>("");
    const [skillLevel, setSkillLevel] = useState<string>("");
    const [skillCategory, setSkillCategory] = useState<string>("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const skill = {
            name: skillName,
            description: skillDescription,
            level: skillLevel,
            category: skillCategory
        };
        setSkillName("");
        setSkillDescription("");
        setSkillLevel("");
        setSkillCategory("");
        console.log(skill);
    };
    return (
        <Dialog>
            <DialogTrigger className="flex justify-center items-center w-full hover:bg-yellow-400 duration-100">
                <img
                    src="/images/plusSign.svg"
                    alt="add skill"
                    width={100}
                    height={150}
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Create Skill</DialogTitle>
                <DialogDescription>
                    Create a new skill to add to the system.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Name
                        </Label>
                        <Input
                        id="name"
                        className="col-span-3"
                        value={skillName}
                        onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setSkillName(event.target.value)
                          }
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                        Description
                        </Label>
                        <Input
                        id="description"
                        className="col-span-3"
                        value={skillDescription}
                        onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setSkillDescription(event.target.value)
                          }
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                        Category
                        </Label>
                        <div className="col-span-3 w-full">
                            <Select onValueChange={(value) => setSkillCategory(value)}> 
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LEADERSHIP">Leadership</SelectItem>
                                    <SelectItem value="CORE_FOUNDATIONAL">Core Foundational</SelectItem>
                                    <SelectItem value="CUSTOMER_FOCUSED">Customer Focused</SelectItem>
                                    <SelectItem value="MANAGERIAL">Managerial</SelectItem>
                                    <SelectItem value="EMOTIONAL_INTELLIGENCE">Emotional Intelligence</SelectItem>
                                    <SelectItem value="CROSS_CULTURAL">Cross Cultural</SelectItem>
                                    <SelectItem value="INNOVATION_CHANGE_ORIENTED">Innovation Change Oriented</SelectItem>
                                    <SelectItem value="TECHNICAL">Technical</SelectItem>
                                    <SelectItem value="RISK_MANAGEMENT">Risk Managment</SelectItem>
                                    <SelectItem value="LEARNING_AND_DEVELOPMENT">Learning and Development</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="level" className="text-right">
                        Level of Competency
                        </Label>
                        <RadioGroup value={skillLevel} onValueChange={(value) => setSkillLevel(value)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="FUNCTIONAL" id="FUNCTIONAL" />
                                <Label htmlFor="FUNCTIONAL">Functional</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="BEHAVIORAL" id="BEHAVIORAL" />
                                <Label htmlFor="BEHAVIORAL">Behavioral</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="COMPANY" id="COMPANY" />
                                <Label htmlFor="COMPANY">Company</Label>
                            </div>
                        </RadioGroup>

                    </div>
                </div>
                <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

export default CreateSkillModal;