import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Text } from "@chakra-ui/layout";
import { FormControl, IconButton, Input, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  

  const host = process.env.REACT_APP_BASE_URL;
  let { user, selectedChat, setSelectedChat } = ChatState();
  // console.log('user', user)
  // console.log('selectedChat', selectedChat)
  // console.log('singleChat user', user)
  // user = user.data;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      }
      // console.log('user.token', config.headers.Authorization)
      setLoading(true);

      // console.log('selectedChat._id', selectedChat._id)
      const { data } = await axios.get(`${host}/api/message/${selectedChat._id}`, config);
      // console.log('fetchMessages data', data);
      // console.log('messages', messages);

      setMessages(data.data);
      setLoading(false);

    } catch (error) {
      console.log('error', error)
      toast({
        title: "Something went wrong..!",
        description: "Failed to Load the messages",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [selectedChat]);

  const sendMessage = async (event) => {
    try {
      if (event.key === 'Enter' && newMessage) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        }

        setNewMessage("");
        const { data } = await axios.post(`${host}/api/message`, {
          content: newMessage,
          chatId: selectedChat._id
        }, config);
        // console.log('sendMessage data', data);

        setMessages([ ...messages, data.data ]);
      }
    } catch (error) {
      toast({
        title: "Something went wrong..!",
        description: "Failed to send the message",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ['websocket']
    });
    socket.emit('setup', user.data);
    socket.on("connection", () => setSocketConnected(true));
    // eslint-disable-next-line
  }, []);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing indicator logic

  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            padding={3}
            bg='#E8E8E8'
            width='100%'
            height='89%'
            borderRadius='lg'
            overflowY='hidden'
          >
            {
              loading ? (
                <Spinner 
                  size='xl'
                  w={20}
                  h={20}
                  alignSelf='center'
                  margin='auto'
                />
              ) : (
                <div className="msg">
                  <ScrollableChat messages={messages}/>
                </div>
              )
            }

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
              variant='filled'
              bg='#E0E0E0'
              placeholder="Message"
              onChange={typingHandler}
              value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
