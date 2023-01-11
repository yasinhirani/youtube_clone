import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ Component }: any) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage?.userEmail) {
      navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Component />;
};

export default ProtectedRoute;
