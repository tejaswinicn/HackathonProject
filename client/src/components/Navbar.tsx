import { Link } from "wouter";

const Navbar = () => {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-semibold text-primary">Smart Safety Badge</div>
      <div className="space-x-4">
        <Link href="/">
          <button className="text-gray-700 hover:text-blue-500 font-medium">Dashboard</button>
        </Link>
        <Link href="/profile">
          <button className="text-gray-700 hover:text-blue-500 font-medium">Profile</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
