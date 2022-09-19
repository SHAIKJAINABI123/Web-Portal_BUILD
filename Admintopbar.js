import "./admintopbar.css";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Admintopbar() {
  const { adminDispatch } = useContext(AuthContext);

  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("admin");
    adminDispatch({
      type: "ADMIN_LOGOUT",
    });
    navigate("/adminlogin");
  };
  return (
    <header className="header" id="header">
      <nav className="nav navcontainer">
        <div className="navlogo">
          <img
            className="navimg"
            src={require("../../assets/Modified Logo.png")}
            alt="Logo"
          />
        </div>

        <div className="nav__menu" id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item">
              <Link to="/adminrequests" className="nav__link active-link">
                Requests
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/userloginrequests" className="nav__link active-link">
                User Login Requests
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/mentorloginrequests" className="nav__link">
                Mentor Login Requests
              </Link>
            </li>
          </ul>
        </div>

        <button onClick={() => logOut()} className="navbutton button__header">
          Sign out
        </button>
      </nav>
    </header>
  );
}
