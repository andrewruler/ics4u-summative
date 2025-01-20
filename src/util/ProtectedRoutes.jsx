import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const ProtectedRoutes = () => {
  const { user, loading } = useUserContext();
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowUnauthorized(true);
      const timer = setTimeout(() => setRedirect(true), 3000);

      return () => clearTimeout(timer);
    } else {
      setShowUnauthorized(false);
      setRedirect(false);
    }
  }, [loading, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (redirect) {
    return <Navigate to="/Login" />;
  }

  if (showUnauthorized) {
    return (
      <div>
        <h1>Unauthorized Access</h1>
        <p>You will be redirected to the login page shortly.</p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoutes;
