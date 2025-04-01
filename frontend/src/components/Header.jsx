import React from "react";
import "../styles/Header.css"; 


function Header() {
return (
    <header className="header">
        <div className="header-container">
            <div className="nba">
                <img src="/nba-logo.png" alt="NBA Accreditation" className="nba-logo" />
            </div>
            
            <div className="college-info">
                <br/>
                <h1>SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY</h1>
             
                <p style={{ fontWeight: "bold" }}>
                    Six Axis Robot
                </p>
            </div>
            
            <img src="/naac-logo.jpeg" alt="NAAC Accreditation" className="naac-logo" />
        </div>
    </header>
);
}

export default Header;
