import React, { useState } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FaUserPlus, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student: {
      registrationId: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      enrollmentDate: "",
      facultyId: "",
      classId: "",
      batchId: "",
      gradeLevel: "",
    },
    parent: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    },
  });
  const [showTable, setShowTable] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleInputChange = (e, entity, field) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        [field]: value,
      },
    }));
  };

  const handleAddStudent = async () => {
    try {
      const response = await axios.post(
        "https://4829-202-166-207-29.ngrok-free.app/api/Student",
        formData
      );

      const { message, username, password } = response.data;

      // Update formData with the new username and password
      setFormData((prev) => ({
        ...prev,
        student: {
          ...prev.student,
          username,
          password,
        },
      }));

      toast({
        title: "New student added successfully",
        description: `${message}. Username: ${username}, Password: ${password}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      // Fetch updated student list
      await fetchStudents();
      onClose();
    } catch (error) {
      toast({
        title: "Error adding student",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "https://4829-202-166-207-29.ngrok-free.app/api/Student/all-students"
      );
      console.log(response.data); // Inspect the response data
      const studentData = response.data.$values || [];
      setStudents(studentData);
      setShowTable(true);
    } catch (error) {
      toast({
        title: "Error fetching students",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box>
      <Text fontSize="xl" mb="4">
        Welcome Admin
      </Text>
      <SimpleGrid columns={2} spacing={4} mb="4">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Box p="4" bg="brand.white" boxShadow="md">
            <Text fontSize="xl" color="brand.blue">
              Students
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="brand.orange">
              1000
            </Text>
          </Box>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Box p="4" bg="brand.white" boxShadow="md">
            <Text fontSize="xl" color="brand.blue">
              Staff
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="brand.orange">
              53
            </Text>
          </Box>
        </motion.div>
      </SimpleGrid>
      <Flex justifyContent="space-between" mb="6">
        <Button leftIcon={<FaUserPlus />} colorScheme="blue" onClick={onOpen}>
          Add New Student
        </Button>
        <Button leftIcon={<FaEye />} colorScheme="teal" onClick={fetchStudents}>
          View All Students
        </Button>
      </Flex>

      {showTable && (
        <Box bg="brand.white" boxShadow="md" borderRadius="lg" p="6">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Student ID</Th>
                <Th>Full Name</Th>
                <Th>Faculty Name</Th>
                <Th>Class Name</Th>
                <Th>Batch Name</Th>
                <Th>Grade Level</Th>
                <Th>Parent Full Name</Th>
                <Th>Parent Phone Number</Th>
                <Th>Parent Email</Th>
              </Tr>
            </Thead>
            <Tbody>
              {students.map((student, index) => (
                <Tr key={index}>
                  <Td>{student.studentId}</Td>
                  <Td>{student.fullName}</Td>
                  <Td>{student.facultyName}</Td>
                  <Td>{student.className}</Td>
                  <Td>{student.batchName}</Td>
                  <Td>{student.gradeLevel}</Td>
                  <Td>{student.parentFullName}</Td>
                  <Td>{student.parentPhoneNumber}</Td>
                  <Td>{student.parentEmail}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel>Registration ID</FormLabel>
                  <Input
                    type="text"
                    value={formData.student.registrationId}
                    onChange={(e) =>
                      handleInputChange(e, "student", "registrationId")
                    }
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    value={formData.student.firstName}
                    onChange={(e) =>
                      handleInputChange(e, "student", "firstName")
                    }
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    value={formData.student.lastName}
                    onChange={(e) =>
                      handleInputChange(e, "student", "lastName")
                    }
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={formData.student.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange(e, "student", "dateOfBirth")
                    }
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Enrollment Date</FormLabel>
                  <Input
                    type="date"
                    value={formData.student.enrollmentDate}
                    onChange={(e) =>
                      handleInputChange(e, "student", "enrollmentDate")
                    }
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Faculty ID</FormLabel>
                  <Input
                    type="text"
                    value={formData.student.facultyId}
                    onChange={(e) =>
                      handleInputChange(e, "student", "facultyId")
                    }
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Class ID</FormLabel>
                  <Input
                    type="text"
                    value={formData.student.classId}
                    onChange={(e) => handleInputChange(e, "student", "classId")}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Batch ID</FormLabel>
                  <Input
                    type="text"
                    value={formData.student.batchId}
                    onChange={(e) => handleInputChange(e, "student", "batchId")}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Grade Level</FormLabel>
                  <Input
                    type="text"
                    value={formData.student.gradeLevel}
                    onChange={(e) =>
                      handleInputChange(e, "student", "gradeLevel")
                    }
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Parent First Name</FormLabel>
                  <Input
                    type="text"
                    value={formData.parent.firstName}
                    onChange={(e) =>
                      handleInputChange(e, "parent", "firstName")
                    }
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Parent Last Name</FormLabel>
                  <Input
                    type="text"
                    value={formData.parent.lastName}
                    onChange={(e) => handleInputChange(e, "parent", "lastName")}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Parent Phone Number</FormLabel>
                  <Input
                    type="text"
                    value={formData.parent.phoneNumber}
                    onChange={(e) =>
                      handleInputChange(e, "parent", "phoneNumber")
                    }
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Parent Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.parent.email}
                    onChange={(e) => handleInputChange(e, "parent", "email")}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddStudent}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;
