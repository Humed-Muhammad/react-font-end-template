import { Wand2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-16 px-4 bg-slate-900 text-white">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Wand2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Autofaceless</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Create stunning videos with AI technology. No face required, just
              pure creativity.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Status
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 mb-4 md:mb-0">
            © 2024 Autofaceless. All rights reserved.
          </p>
          <div className="flex space-x-6 text-slate-400">
            <Link to="/legal" className="hover:text-white transition-colors">
              Terms & Privacy
            </Link>

            <Link to="#" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
