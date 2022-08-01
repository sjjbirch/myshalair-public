import React from "react";
import { Navigate } from "react-router";

export function PrivateRoute({ children }: { children: React.ReactElement; }) {

  const admin = sessionStorage.getItem('admin');

  if (admin === 'true') {
    return children;
  } else {
    return <Navigate to={'/'} />;
  }
}