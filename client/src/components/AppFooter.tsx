interface AppFooterProps {
  className?: string;
}

export default function AppFooter({ className }: AppFooterProps) {
  return (
    <footer className={`bg-gradient-to-r from-red-500 via-red-300 to-orange-500 text-white py-6 mt-auto ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-white font-semibold mb-2">SHEild</h3>
            <p className="text-white-400 text-sm">A wearable emergency alert device for women</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-white-400 text-sm mb-1">© {new Date().getFullYear()}  Safety Solutions</p>
            <p className="text-white-400 text-sm">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}