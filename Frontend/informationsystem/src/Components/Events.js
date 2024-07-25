// src/pages/Events.js
import React, { useState } from "react";
import {
  Box,
  Image,
  Text,
  SimpleGrid,
  Button,
  IconButton,
  useDisclosure,
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
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useDropzone } from "react-dropzone";

const Events = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    img: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleAddEvent = () => {
    if (newEvent.name && newEvent.date && newEvent.img) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setNewEvent({ name: "", date: "", img: "" });
      setImageFile(null);
      onClose();
    }
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleImageUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewEvent((prevEvent) => ({ ...prevEvent, img: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageUpload,
    accept: "image/*",
  });

  return (
    <Box p="4">
      <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen} mb="4">
        Add Event
      </Button>

      {events.length === 0 ? (
        <Text fontSize="2xl" textAlign="center" mt="20">
          No events available. Please add an event.
        </Text>
      ) : (
        <SimpleGrid columns={3} spacing={4}>
          {events.map((event) => (
            <Box
              key={event.id}
              p="4"
              bg="brand.white"
              boxShadow="md"
              borderRadius="md"
            >
              <Image
                src={event.img}
                alt={event.name}
                boxSize="300px"
                width={"400px"}
                objectFit="cover"
                mb="4"
              />
              <Text fontSize="xl" fontWeight="bold" color="brand.blue">
                {event.name}
              </Text>
              <Text fontSize="md" color="brand.grayText">
                {event.date}
              </Text>
              <IconButton
                aria-label="Delete event"
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => handleDeleteEvent(event.id)}
                mt="2"
              />
            </Box>
          ))}
        </SimpleGrid>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name" mb="4">
              <FormLabel>Event Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={newEvent.name}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
            </FormControl>
            <FormControl id="date" mb="4">
              <FormLabel>Event Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl id="img" mb="4">
              <FormLabel>Event Image</FormLabel>
              <Box
                {...getRootProps()}
                p="4"
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="md"
                textAlign="center"
                cursor="pointer"
                required
              >
                <input {...getInputProps()} />
                {imageFile ? (
                  <Text>{imageFile.name}</Text>
                ) : (
                  <Text>
                    Drag 'n' drop image here, or click to select image
                  </Text>
                )}
              </Box>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddEvent}>
              Add Event
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Events;
