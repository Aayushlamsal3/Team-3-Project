import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  useDisclosure,
  IconButton,
  Flex,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon, ViewIcon } from "@chakra-ui/icons";
import axios from "axios";

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [studentDetails, setStudentDetails] = useState([]);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [viewDetailsAssignmentId, setViewDetailsAssignmentId] = useState(null);
  const [updateStudentModalOpen, setUpdateStudentModalOpen] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        "https://4829-202-166-207-29.ngrok-free.app/api/Assignment/list"
      );
      console.log("API Response:", response.data); // Debugging line
      if (Array.isArray(response.data)) {
        setAssignments(response.data);
      } else {
        console.error("API response is not an array");
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const fetchAssignmentDetails = async (assignmentId) => {
    try {
      const response = await axios.get(
        `https://4829-202-166-207-29.ngrok-free.app/api/Assignment/assignment/${assignmentId}`
      );
      setStudentDetails(response.data);
    } catch (error) {
      console.error("Error fetching assignment details:", error);
    }
  };

  const handleCreateAssignment = async (newAssignment) => {
    try {
      // Send a request to create a new assignment
      await axios.post(
        "https://4829-202-166-207-29.ngrok-free.app/api/Assignment/create",
        {
          title: newAssignment.title,
          description: newAssignment.description,
          dueDate: newAssignment.dueDate,
          classId: newAssignment.classId,
        }
      );

      // Fetch the updated list of assignments after creation
      await fetchAssignments();

      onClose();
      toast({
        title: "Assignment Created",
        description: "New assignment has been successfully created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        title: "Error",
        description: "Failed to create assignment.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateStudentDetails = async () => {
    try {
      await axios.post(
        "https://4829-202-166-207-29.ngrok-free.app/api/Assignment/status",
        {
          assignmentId: viewDetailsAssignmentId,
          studentStatuses: studentDetails.map(
            ({ studentId, status, grade }) => ({ studentId, status, grade })
          ),
        }
      );
      setUpdateStudentModalOpen(false);
      toast({
        title: "Student Details Updated",
        description: "Student details have been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating student details:", error);
      toast({
        title: "Error",
        description: "Failed to update student details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAssignment = () => {
    if (deleteIndex !== null) {
      setAssignments(assignments.filter((_, i) => i !== deleteIndex));
      setDeleteOpen(false);
      toast({
        title: "Assignment Deleted",
        description: "Assignment has been successfully deleted.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setDeleteOpen(true);
  };

  return (
    <Box p={4}>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="green"
        onClick={() => {
          setSelectedAssignment(null);
          onOpen();
        }}
        mb={4}
      >
        Create New Assignment
      </Button>
      {assignments.length === 0 ? (
        <Flex direction="column" align="center" justify="center" mt={8}>
          <Text fontSize="xl" color="gray.500">
            No assignments tasked till now.
          </Text>
        </Flex>
      ) : (
        <VStack spacing={4} align="stretch">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Description</Th>
                  <Th>Due Date</Th>
                  <Th>Assigned Class</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {assignments.map((assignment, index) => (
                  <Tr key={index}>
                    <Td>{assignment.title}</Td>
                    <Td>{assignment.description}</Td>
                    <Td>{assignment.dueDate}</Td>
                    <Td>{assignment.classId === 1 ? "Class A" : "Class B"}</Td>
                    <Td>
                      <IconButton
                        icon={<ViewIcon />}
                        onClick={() => {
                          setViewDetailsAssignmentId(assignment.assignmentId);
                          fetchAssignmentDetails(assignment.assignmentId);
                          setUpdateStudentModalOpen(true);
                        }}
                      />
                      <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => {
                          setSelectedAssignment({ ...assignment, index });
                          onOpen();
                        }}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteClick(index)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      )}
      <AssignmentModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={
          selectedAssignment
            ? (index, updatedAssignment) =>
                handleCreateAssignment({ ...updatedAssignment, index })
            : handleCreateAssignment
        }
        assignment={selectedAssignment}
      />
      <AlertDialog isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Confirm Deletion</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete this assignment? This action cannot
            be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="red" onClick={handleDeleteAssignment}>
              Delete
            </Button>
            <Button
              variant="outline"
              ml={3}
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <StudentDetailsModal
        isOpen={updateStudentModalOpen}
        onClose={() => setUpdateStudentModalOpen(false)}
        studentDetails={studentDetails}
        setStudentDetails={setStudentDetails}
        onUpdate={handleUpdateStudentDetails}
      />
    </Box>
  );
};

const AssignmentModal = ({ isOpen, onClose, onSave, assignment }) => {
  const [title, setTitle] = useState(assignment ? assignment.title : "");
  const [description, setDescription] = useState(
    assignment ? assignment.description : ""
  );
  const [dueDate, setDueDate] = useState(assignment ? assignment.dueDate : "");
  const [classId, setClassId] = useState(assignment ? assignment.classId : 1);

  const handleSave = () => {
    onSave &&
      onSave(null, {
        title,
        description,
        dueDate,
        classId,
      });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {assignment ? "Edit Assignment" : "Create Assignment"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assignment Title"
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Assignment Description"
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Due Date</FormLabel>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>Class</FormLabel>
            <Select
              value={classId}
              onChange={(e) => setClassId(Number(e.target.value))}
            >
              <option value={1}>Class A</option>
              <option value={2}>Class B</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outline" ml={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const StudentDetailsModal = ({
  isOpen,
  onClose,
  studentDetails,
  setStudentDetails,
  onUpdate,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Student Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Student ID</Th>
                  <Th>Status</Th>
                  <Th>Grade</Th>
                </Tr>
              </Thead>
              <Tbody>
                {studentDetails.map((student, index) => (
                  <Tr key={index}>
                    <Td>{student.studentId}</Td>
                    <Td>
                      <Select
                        value={student.status}
                        onChange={(e) =>
                          setStudentDetails(
                            studentDetails.map((item, i) =>
                              i === index
                                ? { ...item, status: e.target.value }
                                : item
                            )
                          )
                        }
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </Select>
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        value={student.grade}
                        onChange={(e) =>
                          setStudentDetails(
                            studentDetails.map((item, i) =>
                              i === index
                                ? { ...item, grade: e.target.value }
                                : item
                            )
                          )
                        }
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onUpdate}>
            Update
          </Button>
          <Button variant="outline" ml={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Assignment;
