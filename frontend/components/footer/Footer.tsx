import { Globe } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black bg-black bg-clip-text text-transparent">HxI</span>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-600">
                <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
              </div>
              <p className="text-sm text-gray-500">© 2024 HxI. All rights reserved.</p>
            </div>
          </div>
        </footer>
    );
}