import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Text,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import logo from "../assets/logo.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleBlur = (field) => {
    if (!formData[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`,
      }));
    }
  };

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const response = await axios.post(
          "https://4829-202-166-207-29.ngrok-free.app/api/Auth/login",
          {
            username: formData.username,
            password: formData.password,
          }
        );
        console.log("Response:", response); // Log the response
        if (response.data.role === 1) {
          login(1);
          navigate("/dashboard");
        } else {
          setErrors({ general: "Invalid credentials" });
        }
      } catch (error) {
        console.error("Error:", error); // Log the error
        setErrors({ general: "Invalid credentials" });
      }
    }
  };

  return (
    <Box
      className="login-container"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      background="gray.100"
    >
      <Box
        className="login-box"
        p={8}
        maxWidth="400px"
        width="100%"
        boxShadow="md"
        background="white"
        borderRadius="8px"
      >
        <VStack spacing={4}>
          <Image
            src={logo}
            alt="College Logo"
            height={"120px"}
            width={"250px"}
          />
          <Text fontSize="2xl">Admin Login</Text>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <FormControl isInvalid={errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={formData.username}
                onBlur={() => handleBlur("username")}
                onChange={(e) => handleChange("username", e.target.value)}
              />
              {errors.username && (
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={formData.password}
                onBlur={() => handleBlur("password")}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              {errors.password && (
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              )}
            </FormControl>
            {errors.general && <Text color="red.500">{errors.general}</Text>}
            <Button type="submit" colorScheme="blue" width="full" mt={4}>
              Login
            </Button>
          </form>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;

