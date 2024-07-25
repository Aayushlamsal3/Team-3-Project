import React from "react";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Text,
  VStack,
  HStack,
  IconButton,
  Button,
  Drawer,
  DrawerContent,
  useDisclosure,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Stack,
  Icon,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Input,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Progress,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Center,
  Heading,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiSearch,
} from "react-icons/fi";

const LinkItems = [
  { name: "Parentuser", icon: FiHome },
  { name: "Attendance", icon: FiTrendingUp },
  { name: "Fees information", icon: FiCompass },
  { name: "Assignment", icon: FiStar },
  { name: "Events", icon: FiSettings },
];

function SidebarContent({ onClose, ...rest }) {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          ISMT College
        </Text>
        <DrawerCloseButton
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
        />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
}

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const Parentuser = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Navigation</DrawerHeader>

            <DrawerBody>
              {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon}>
                  {link.name}
                </NavItem>
              ))}
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Flex justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Parentuser
          </Text>
          <HStack spacing="6">
            <IconButton
              size="lg"
              variant="ghost"
              aria-label="open menu"
              icon={<FiBell />}
            />
            <Flex alignItems="center">
              <HStack spacing="3">
                <Avatar size="sm" />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">Username</Text>
                  <Text fontSize="xs" color="gray.600">
                    Parent
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </Flex>
          </HStack>
        </Flex>

        <Box mt="4">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <StatCard title="Attendance" stat="46/48 Days" />
            <StatCard title="Overdue fees" stat="Rs 46,000 left" />
            <StatCard title="Assignment left" stat="3" />
          </SimpleGrid>
        </Box>

        <Box mt="4">
          <Heading size="md" mb="4">
            Assignment Details
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Semester</Th>
                <Th>Subject</Th>
                <Th>Due Date</Th>
                <Th>Submission Date</Th>
                <Th>Grade</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>1</Td>
                <Td>Programming</Td>
                <Td>2024/07/23</Td>
                <Td>----</Td>
                <Td>--</Td>
              </Tr>
              <Tr>
                <Td>1</Td>
                <Td>DBMS</Td>
                <Td>2024/07/22</Td>
                <Td>2024/07/14</Td>
                <Td>A</Td>
              </Tr>
              <Tr>
                <Td>1</Td>
                <Td>Networking</Td>
                <Td>2024/07/23</Td>
                <Td>2024/07/27</Td>
                <Td>B</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>

        <Box mt="4">
          <Heading size="md" mb="4">
            Fee Information
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Semester</Th>
                <Th>Total Fee</Th>
                <Th>Amount Paid</Th>
                <Th>Balance Due</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>1</Td>
                <Td>50000</Td>
                <Td>4000</Td>
                <Td>46000</Td>
                <Td>
                  <Button colorScheme="blue">Pay Now</Button>
                </Td>
              </Tr>
              <Tr>
                <Td>2</Td>
                <Td>50000</Td>
                <Td>4000</Td>
                <Td>46000</Td>
                <Td>
                  <Button colorScheme="blue">Pay Now</Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

const StatCard = ({ title, stat }) => {
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"xl"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.500", "gray.500")}
      rounded={"lg"}
      bg={useColorModeValue("white", "gray.900")}
    >
      <StatLabel fontWeight={"medium"} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
        {stat}
      </StatNumber>
    </Stat>
  );
};

export default Parentuser;
