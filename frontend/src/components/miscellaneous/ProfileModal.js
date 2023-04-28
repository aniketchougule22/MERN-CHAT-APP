import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({user, children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
    {
        children ? (<span onClick={onOpen}>{children}</span>) : (<IconButton display={{base: 'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>)
    }

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           dhjhgjdh
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
