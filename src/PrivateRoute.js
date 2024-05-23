import { useAuth } from "./firebase/auth";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
    const { authUser } = useAuth();
  
    return (
      (!authUser) ?
      <Navigate to='/login' />
      :
      <Outlet />
    ); 
}

export default PrivateRoute;
