import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import Dashboard from "./Components/Dashboard";
import Account from "./Components/Account";
import Assignment from "./Components/Assignment";
import Attendance from "./Components/Attendance";
import Events from "./Components/Events";
import Layout from "./Components/Layout";
import Login from "./Components/Login";
import ProtectedRoute from "./ProtectedRoute";
import AuthProvider from "./AuthContext";
import Parentuser from "./pages/Parentuser";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/account" element={<Account />} />
                <Route path="/assignment" element={<Assignment />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/events" element={<Events />} />
                <Route path="/parents" element={<Parentuser />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
