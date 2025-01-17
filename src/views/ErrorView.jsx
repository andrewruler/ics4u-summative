import { useNavigate } from "react-router-dom";
import './ErrorView.css';

const ErrorView = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-view">
      <h1>Page not found</h1>
      <p>
        The page you are looking for could not be found. Please check if you are signed in and
        try again.
      </p>
      <button onClick={navigate('/')}>Go back</button>
    </div>
  );
};

export default ErrorView;
