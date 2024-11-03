import Link from "next/link";
import Header from "@components/header";
import JobCard from "@components/JobCard";
import JobService from "@services/JobService";
import { Job } from "@types";
import { useEffect, useState } from "react";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";

export const getServerSideProps = async () => {
  const jobs = await JobService.getAll();
  return {
    props: {
      jobs,
    },
  };
};

const Jobs: React.FC = ({
  jobs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [jobCards, setJobCards] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const cards = jobs.map((job: Job) => <JobCard job={job}/>);
    setJobCards(cards);
  }, []);

  return (
    <>
      <Header />
      <main className="flex-wrap w-full flex justify-center items-center">
        <Link
          className="flex justify-center items-center w-full hover:bg-yellow-400 duration-100"
          href="/createJob"
        >
          <img
            src="/images/plusSign.svg"
            alt="add job"
            width={100}
            height={150}
          />
        </Link>
        <div className="py-7 grid grid-cols-3 gap-4">
          {jobCards.length > 0 ? jobCards : <p>No jobs to show</p>}
        </div>
      </main>
    </>
  );
};

export default Jobs;