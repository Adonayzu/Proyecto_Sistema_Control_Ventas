import React from "react";
import Sidebar from "../Sidebar/Sidebar"; 
import { Box } from "@mui/material";
import AppRoutes from "../../Routes/Routes";

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex"}}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          paddingTop: "85px",
          backgroundColor: "#fafafa",
          minHeight: "100vh",
        }}
      >
        <AppRoutes />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;