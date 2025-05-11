import { Link } from "wouter";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg px-6 py-4 flex justify-between items-center rounded-b-2xl h-16 z-50">
      <div className="text-2xl font-bold text-white drop-shadow-lg">SHEild</div>
      <div className="space-x-4">
        <Link href="/">
          <button className="px-4 py-2 rounded-full bg-white text-blue-800 font-semibold transition duration-300 hover:bg-gray-300 shadow-md">
            Dashboard
          </button>
        </Link>
        <Link href="/profile">
          <button className="px-4 py-2 rounded-full bg-white text-blue-800 font-semibold transition duration-300 hover:bg-gray-300 shadow-md">
            Profile
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
