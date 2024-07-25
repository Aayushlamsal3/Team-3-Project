import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Flex flex="1">
        <Sidebar />
        <Box flex="1" p="4">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
