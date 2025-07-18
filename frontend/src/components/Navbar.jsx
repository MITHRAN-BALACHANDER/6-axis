import React from "react";
import { Link } from "react-router-dom";

const navItems = [
  "Dashboard",
  "Graph",
  "Settings",
  "About",
  "Help",
  "Logout",
  "Log",
];

export default function Navbar() {
  return (
    <nav className="w-full px-4 py-3 bg-white shadow">
      <div className="flex justify-end max-w-7xl mx-auto">
        {navItems.map((item) => (
          <div key={item} className="relative group mx-2">
            <Link
              to={`/${item.toLowerCase()}/`}
              className="text-green-800 font-bold no-underline px-2 py-1 transition-colors duration-200"
            >
              {item}
            </Link>
            {/* Left Animated Bar */}
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-green-800 transition-transform duration-300 origin-top scale-y-0 group-hover:scale-y-100"
              style={{ transformOrigin: "center top" }}
            ></span>
            {/* Right Animated Bar */}
            <span
              className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-green-800 transition-transform duration-300 origin-bottom scale-y-0 group-hover:scale-y-100"
              style={{ transformOrigin: "center bottom" }}
            ></span>
          </div>
        ))}
      </div>
    </nav>
  );
}
