import React from "react";
import { Navigate } from "react-router-dom";

function RequireAuth(props) {
  if (!props.token) {
    return <Navigate to={"/login"} />;
  }
  return props.children;
};
export default RequireAuth;