import React from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Navbar from "../../common/Layout/Navbar.js";

const Layout = ({ children }) => {
  const location = useLocation();

  // List of public paths where navbar should be visible
  const publicPaths = ["/", "/login", "/register", "/events"];
  const shouldShowNavbar = publicPaths.includes(location.pathname);

  return (
    <Box>
      {shouldShowNavbar && <Navbar />}
      <Box component="main">{children}</Box>
    </Box>
  );
};

export default Layout;
