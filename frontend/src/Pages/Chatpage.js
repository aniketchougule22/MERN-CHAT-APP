import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/miscellaneous/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";
import {ChatState} from "../Context/ChatProvider";

const Chatpage = () => {
  const {user} = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  // console.log('user chatpage', user)

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display='flex' justifyContent="space-between" width="100%" height="91.5vh" padding="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default Chatpage;
