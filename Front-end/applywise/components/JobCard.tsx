const JobCard = (props : any) => {
    return (
        <div className="bg-gray-300 rounded-xl p-4 w-[30rem] h-25 flex items-center shadow-lg">
            <div className="text-center flex-grow">
                <h3 className="text-lg font-bold">{props.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{props.description}</p>
            </div>
            <button className="min-w-[8rem] max-h-10 mt-2 px-4 py-2 bg-white rounded-full text-gray-700 shadow-md hover:bg-yellow-400 duration-100 focus:outline-none">
                View more
            </button>
        </div>
    )
};

export default JobCard;