import { Box, Text } from "@chakra-ui/layout";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import { Spinner } from "@chakra-ui/spinner";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {

  const host = process.env.REACT_APP_BASE_URL;

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats } = ChatState();
  // console.log("user SideDrawer", user);
  const navigate = useNavigate();

  const logouthandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Enter something in search..!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const {data} = await axios.get(`${host}/api/user/?search=${search}`, config);
      // console.log('search data', data.data)
      setLoading(false);
      setSearchResult(data.data);
      setSearch('');
    } catch (error) {
      toast({
        title: "Something went wrong..!",
        description: 'Failed to Load the Search Results',
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    // console.log('user_id', user_id)
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log('config', config.headers.Authorization)
      const {data} = await axios.post(`${host}/api/chat`, { userId }, config);
      console.log('post chat data', data)
      if (!chats.find((c) => c._id === data.data._id)) {
        setChats([data.data, ...chats]);
      }
      setSelectedChat(data.data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Something went wrong..!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        padding="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans" fontWeight="bold">
          <b>C h a t i f y</b>
        </Text>
        <div>
          <Menu>
            <MenuButton padding={1}>
              <BellIcon fontSize="2xl" margin={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.data.name}
                  src={user.data.pic}
                />
              </MenuButton>
              <MenuList>
                <ProfileModal user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logouthandler}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" paddingBottom={2}>
              <Input
                placeholder="Search by name or email"
                marginRight={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {
              loading ? ( <ChatLoading /> ) : (
                searchResult.map((user) => {
                  return <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                })
              )
            }
            {/* {loadingChat && <Spinner ml='auto' display='flex' />} */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
