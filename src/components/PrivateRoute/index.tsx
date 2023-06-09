import React, { useContext } from "react";
import {Navigate, Outlet} from "react-router-dom";
import { AuthContext } from "../../contexts";

interface PrivateRouteProps {
  restricted?: boolean;
}

export const PrivateRoute = ({ restricted = false }: PrivateRouteProps) => {
  const { token } = useContext(AuthContext);

  if (restricted) return token ? <Navigate to="/" replace /> : <Outlet />;

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};