import { Job } from "@types";

const getAll = async (): Promise<Job[]> => {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const jobsJson = await fetch(apiUrl + '/jobs', {
      method: 'GET',
      headers: { 
          'Content-Type': 'application/json' 
      }
    });

    return await jobsJson.json();
};

const JobService = {
    getAll
}

export default JobService