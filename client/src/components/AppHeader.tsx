import { Link, useLocation } from "wouter";

interface AppHeaderProps {
  className?: string;
}

export default function AppHeader({ className }: AppHeaderProps) {
  const [location] = useLocation();

  return (
    <header className={`bg-white shadow-md ${className}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mr-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 text-white"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-neutral-800">Smart Safety Badge</h1>
          </div>
        </Link>
        <div>
          <Link href="/profile">
            <button 
              id="profileBtn" 
              className={`p-2 rounded-full ${location === "/profile" ? "bg-neutral-200" : "hover:bg-neutral-200"}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-6 h-6 text-neutral-600"
              >
                <path d="M18 20a6 6 0 0 0-12 0"/>
                <circle cx="12" cy="10" r="4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
