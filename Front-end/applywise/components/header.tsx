import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-white p-4 shadow"> 
      <nav className="flex justify-end container mx-auto space-x-4">

        <Link
          href="/home"
          className="flex items-center text-xl text-black hover:bg-gray-200 rounded-lg"
        >
          Home
        </Link>

        <Link
          href="/jobs"
          className="flex items-center text-xl text-black hover:bg-gray-200 rounded-lg"
        >
          Jobs
        </Link>

        <Link
          href="/user"
          className="flex items-center text-xl text-black hover:bg-gray-200 rounded-lg"
        >
          <img src="/images/user.svg" alt="User" width={30} height={30} />
        </Link>
      </nav>
    </header> 
  );
};

export default Header;
