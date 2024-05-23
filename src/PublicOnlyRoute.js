import { useAuth } from "./firebase/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicOnlyRoute() {
    const { authUser } = useAuth();
  
    return (
      (authUser) ?
      <Navigate to='/' />
      :
      <Outlet />
    );
}