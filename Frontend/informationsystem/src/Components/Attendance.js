// src/pages/Attendance.js
import React, { useState } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  useToast,
  Flex,
} from "@chakra-ui/react";

const Attendance = () => {
  const [className, setClassName] = useState("");
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const toast = useToast();

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(
        `https://4829-202-166-207-29.ngrok-free.app/api/Attendance/list?classId=1&batchId=1&date=${date}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      const data = await response.json();
      const processedData = data["$values"].map((student) => ({
        id: student.studentId,
        name: student.studentName,
        status: student.status || "Absent",
      }));
      setStudents(processedData);
      setIsTableVisible(true); // Show the table after fetching data
    } catch (error) {
      toast({
        title: "Error fetching attendance data",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const saveAttendance = async () => {
    try {
      const response = await fetch(
        "https://4829-202-166-207-29.ngrok-free.app/api/Attendance/bulk-record",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify({
            classId: 1,
            batchId: 1,
            date,
            attendances: students.map((student) => ({
              studentId: student.id,
              status: student.status,
            })),
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Today's Attendance is successfully saved.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        // Clear input fields and hide the table
        setClassName("");
        setBatchId("");
        setDate("");
        setStudents([]);
        setIsTableVisible(false);
      } else {
        toast({
          title: "Error saving attendance",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: "Error saving attendance",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box p={4} maxW="1200px" mx="auto">
      <Text fontSize="2xl" mb="4" fontWeight="bold">
        Attendance
      </Text>
      <Flex mb="4" align="center" direction="column">
        <Input
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          mb="2"
          bg="white"
          width="100%"
          maxW="400px"
          borderColor="gray.300"
          borderRadius="md"
          size="lg"
        />
        <Input
          placeholder="Batch ID"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          mb="2"
          bg="white"
          width="100%"
          maxW="400px"
          borderColor="gray.300"
          borderRadius="md"
          size="lg"
        />
        <Input
          placeholder="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          mb="4"
          bg="white"
          width="100%"
          maxW="400px"
          borderColor="gray.300"
          borderRadius="md"
          size="lg"
        />
        <Button onClick={fetchAttendanceData} colorScheme="blue" size="lg">
          Fetch Attendance
        </Button>
      </Flex>
      {isTableVisible && students.length > 0 && (
        <Box mt="4">
          <Table variant="simple" borderWidth="1px" borderRadius="md">
            <Thead>
              <Tr>
                <Th>Student ID</Th>
                <Th>Name</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {students.map((student, index) => (
                <Tr key={student.id}>
                  <Td>{student.id}</Td>
                  <Td>{student.name}</Td>
                  <Td>
                    <Select
                      value={student.status}
                      onChange={(e) => {
                        const updatedStudents = [...students];
                        updatedStudents[index].status = e.target.value;
                        setStudents(updatedStudents);
                      }}
                    >
                      <option value="Absent">Absent</option>
                      <option value="Present">Present</option>
                    </Select>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button mt="4" colorScheme="teal" size="lg" onClick={saveAttendance}>
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Attendance;
