import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/layout'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    // console.log('UserBadgeItem user', user)
  return (
    <Box
        px={2}
        py={1}
        borderRadius='lg'
        m={1}
        mb={2}
        variant='solid'
        fontSize={12}
        backgroundColor='purple'
        // backgroundColor= 'rgb(20 184 166)'
        color='white'
        cursor='pointer'
        onClick={handleFunction}
    >
        <b>{user.name}</b>
        <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgeItem
