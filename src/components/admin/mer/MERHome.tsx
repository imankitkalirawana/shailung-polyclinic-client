import React from "react";
import { isLoggedIn } from "../../../utils/auth";
import SelfBook from "./SelfBook";
import AdminBook from "./AdminBook";

const MERHome = () => {
  const { user } = isLoggedIn();

  if (user?.role === "user") {
    return <SelfBook />;
  } else {
    return (
      <>
        <AdminBook />
      </>
    );
  }
};

export default MERHome;
