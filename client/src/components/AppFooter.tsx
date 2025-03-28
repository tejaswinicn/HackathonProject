interface AppFooterProps {
  className?: string;
}

export default function AppFooter({ className }: AppFooterProps) {
  return (
    <footer className={`bg-neutral-800 text-white py-6 mt-auto ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Smart Safety Badge</h3>
            <p className="text-neutral-400 text-sm">A wearable emergency alert device for women</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-neutral-400 text-sm mb-1">© {new Date().getFullYear()} Smart Safety Solutions</p>
            <p className="text-neutral-400 text-sm">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
