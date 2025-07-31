import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-16 px-4 bg-slate-900 text-white">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">OrderMe</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Streamline your order management with intelligent automation and
              real-time tracking for businesses of all sizes.
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
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Mobile App
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Retail Stores
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  E-commerce
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Service Business
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Enterprise
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
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  System Status
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
            © 2024 OrderMe. All rights reserved.
          </p>
          <div className="flex space-x-6 text-slate-400">
            <Link to="/legal" className="hover:text-white transition-colors">
              Terms & Privacy
            </Link>
            <Link to="#" className="hover:text-white transition-colors">
              Security
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
