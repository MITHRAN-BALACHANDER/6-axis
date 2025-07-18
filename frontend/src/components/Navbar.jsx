import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  Settings,
  Info,
  HelpCircle,
  LogOut,
  FileText
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard/", icon: LayoutDashboard },
  { label: "Graph", to: "/graph/", icon: BarChart2 },
  { label: "Settings", to: "/settings/", icon: Settings },
  { label: "About", to: "/about/", icon: Info },
  { label: "Help", to: "/help/", icon: HelpCircle },
  { label: "Logout", to: "/logout/", icon: LogOut },
  { label: "Log", to: "/log/", icon: FileText },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="w-full bg-white shadow md:static fixed bottom-0 left-0 z-50 md:px-4 px-0 md:py-3 py-0">
      {/* Desktop: */}
      <div className="hidden md:flex justify-end max-w-7xl mx-auto">
        {navItems.map(({ label, to, icon: Icon }) => (
          <div key={label} className="relative group mx-2">
            <Link
              to={to}
              className={`text-green-800 font-bold no-underline px-2 py-2 flex items-center ${
                location.pathname === to ? "text-teal-800" : ""
              } transition-colors duration-200`}
            >
              <Icon className="w-5 h-5 mr-2" />
              <span>{label}</span>
            </Link>
            {/* Animated bars only on desktop */}
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-green-800 transition-transform duration-300 origin-top scale-y-0 group-hover:scale-y-100"
              style={{ transformOrigin: "center top" }}
            ></span>
            <span
              className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-green-800 transition-transform duration-300 origin-bottom scale-y-0 group-hover:scale-y-100"
              style={{ transformOrigin: "center bottom" }}
            ></span>
          </div>
        ))}
      </div>

      {/* Mobile bottom nav: */}
      <div className="md:hidden flex justify-between">
        {navItems.map(({ label, to, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            className={`flex flex-col items-center justify-center flex-1 py-1 ${
              location.pathname === to
                ? "text-teal-800"
                : "text-green-800"
            }`}
            aria-label={label}
          >
            <Icon className="w-6 h-6 mb-1" />
            {/* Optional: show label on mobile below the icon */}
            {/* <span className="text-xs">{label}</span> */}
          </Link>
        ))}
      </div>
    </nav>
  );
}
