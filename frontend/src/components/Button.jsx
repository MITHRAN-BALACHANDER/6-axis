"use client"
import"../styles/Button.css"

const Button = ({ buttonText, onClick }) => {
    return (
        <button onClick={onClick}
        className="button">
          
            {buttonText}
        </button>
    );
};

export default Button;
