import { useUserContext } from "../contexts/UserContext";
import "./Hero.css";
import { useNavigate } from "react-router-dom";

function Hero() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  console.log(user?.displayName);
  console.log(user);
  return (
    <div className = 'hero-container'>
      <video autoPlay muted loop id="background-video">
        <source src="src\assets\background.mp4" type="video/mp4"></source>
        Your browser does not support the video tag.
      </video>
      {/* <h1 className="signintext">
        Welcome back, {user.displayName ? userData.displayName : "Guest"}!
      </h1> */}

      <div className="hero">
        <h1 className="signintext">Endless movies, TV shows, and more</h1>
        <h2 className="signintext">
          Starting at $5.99. Cancel whenever you want.
        </h2>
        <p className="signintext">
          Ready to watch? Enter your email to create or restart your membership.
        </p>
      </div>

      <div className="offer">
        <h1>LIMITED OFFER</h1>
        <p>Sign up and get 110% off your first month</p>
        <button onClick = {() => navigate("/Register")}>Learn more</button>
      </div>
    </div>
  );
}

export default Hero;
