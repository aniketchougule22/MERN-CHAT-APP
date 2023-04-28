import { Box, Text } from '@chakra-ui/layout';
import { Avatar, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tooltip } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';

const SideDrawer = () => {

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const user = ChatState();
  console.log('user', user)

  return (
    <div>
      <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      bg='white'
      width='100%'
      padding='5px 10px 5px 10px'
      borderWidth='5px'
      >
        <Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
          <Button variant='ghost'>
          <i className="fa-solid fa-magnifying-glass"></i>
          <Text display={{base: 'none', md: 'flex'}} px='4'>
            Search User
          </Text>
          </Button>
        </Tooltip>
        <Text fontSize='2xl' fontFamily='Sigmar' fontWeight='bold'>
        Chatify
        </Text>
        <div>
        <Menu>
          <MenuButton padding={1}>
          <BellIcon fontSize='2xl' margin={1}/>
          </MenuButton>
          {/* <MenuList></MenuList> */}
          <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size='sm' cursor='pointer' name={user.user.data.name} src={user.user.data.pic} />
          </MenuButton>
          <MenuList>
          <ProfileModal>
            <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider/>
            <MenuItem>Logout</MenuItem>
          </MenuList>
          </Menu>
        </Menu>
        </div>
      </Box>
    </div>
  )
}

export default SideDrawer
