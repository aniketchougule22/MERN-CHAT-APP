import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const host = "http://localhost:5000";
  const [body, setBody] = useState({ email: "", password: "" });
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const toast = useToast();

  const handleHideShowClick = () => {
    setShow(!show);
  };

  const handleSubmitClick = async () => {
    setLoading(true);

    const response = await fetch(`${host}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });

    const json = await response.json();
    // console.log("loginJson", json);
    if (json.status === true) {
      // save the token & redirect
      localStorage.setItem('userInfo', JSON.stringify(json));
      toast({
        title: json.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      navigate("/chats");
    } else {
      toast({
        title: json.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setBody({ ...body, [e.target.name]: e.target.value });
  };

  const onChangeGuestUser = (e) => {
    setBody({ email: "guest@example.com", password: "123456" });
  };

  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          autoComplete="off"
          name="email"
          value={body.email}
          onChange={onChange}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            name="password"
            value={body.password}
            onChange={onChange}
          />

          <InputRightElement w="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleHideShowClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleSubmitClick}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={onChangeGuestUser}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
