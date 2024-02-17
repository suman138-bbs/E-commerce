import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated, isModerator, requiredRoles } from "../api/helper";

const withAuth = (Component, accessibleRoles = []) => {
  return () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!isAuthenticated()) {
        toast.error("Please login to access this page");
        navigate(`/`, {
          replace: true,
        });
        return;
      }
      if (!requiredRoles(accessibleRoles)) {
        toast.error("You are not authorized to access this page");
        if (isModerator()) {
          navigate(`/dashboard/orders`, {
            replace: true,
          });
        } else {
          navigate(`/`, {
            replace: true,
          });
        }
      }
      setLoading(false);
    }, []);

    if (!loading) {
      return <Component />;
    }

    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center py-24">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>

        <h1 className="text-black text-2xl font-bold mt-4">Loading...</h1>

        <p className="text-black text-sm mt-2">
          Please wait while we are loading your page
        </p>
      </div>
    );
  };
};

export default withAuth;
