import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  // let obj = {fetchAgain: fetchAgain, setFetchAgain: setFetchAgain};
  // console.log('obj', obj)
  const host = process.env.REACT_APP_BASE_URL;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [renameLoading, setRenameLoading] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(`${host}/api/chat/rename`, {
        chatId: selectedChat._id,
        chatName: groupChatName
      }, config);

      // console.log('handleRename data', data);
      setSelectedChat(data.data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      onClose();
      setGroupChatName("");
    } catch (error) {
        toast({
            title: "Something went wrong..!",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "bottom",
        });
        setRenameLoading(false);
        setGroupChatName("");
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${host}/api/user?search=${search}`, config);

      // console.log('handleSearch data', data);
      setLoading(false);
      setSearchResult(data.data);
      // onClose();
    } catch (error) {
        toast({
            title: "Something went wrong..!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "bottom-left",
        });
        setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already in group..!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user.data._id) {
      // console.log('user._id', user._id)
      toast({
        title: "Only admin can add someone..!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(`${host}/api/chat/groupadd`, {
        chatId: selectedChat._id,
        userId: user1._id
    }, config);
// console.log('handleAddUser data', data);
    setSelectedChat(data.data);
    setFetchAgain(!fetchAgain);
    setLoading(false);
    } catch (error) {
      toast({
        title: "Something went wrong..!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleRemoveUser = async (user1) => {
    // console.log('upper user1', user1);
    if (selectedChat.groupAdmin._id !== user.data._id && user1._id !== user.data._id) {
      toast({
        title: "Only admin can remove someone..!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(`${host}/api/chat/removegroup`, {
        chatId: selectedChat._id,
        userId: user1._id
    }, config);

    user1._id === user.data._id ? setSelectedChat() : setSelectedChat(data.data);
    // console.log('user.data._id', user.data._id)
    // console.log('user1._id', user1._id)

    setFetchAgain(!fetchAgain);
    fetchMessages();
    setLoading(false);
    } catch (error) {
      // console.log('error', error);
      toast({
        title: "Something went wrong..!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((user) => {
                return (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>{
                      // console.log('userbadge user', user);
                      handleRemoveUser(user)}}
                  />
                );
              })}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Group Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                autoComplete="off"
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                autoComplete="off"
              />
            </FormControl>
            {
              loading ? (
                <Spinner size='lg'/>
              ) : (
                searchResult?.map((user) => {
                  return <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=> handleAddUser(user)}
                  />
                })
              )
            }
            
          </ModalBody>

          <ModalFooter>
            <Button onClick={()=> {
              // console.log('onClick leave user', user);
              handleRemoveUser(user.data)
              }} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
