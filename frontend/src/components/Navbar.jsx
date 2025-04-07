import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        {["Dashboard", "Graph", "Settings", "About",  "Help", "Logout","Log"].map((item) => (
          <Link key={item} to={`/${item.toLowerCase()}/`} className="nav-item">
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
