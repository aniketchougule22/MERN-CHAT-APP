export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[0].name : users[1].name;
}

export const getSenderFull = (loggedUser, users) => {
    let dataa = users[0]._id === loggedUser._id ? users[0] : users[1];
    let obj = {data: dataa};
    // console.log('return obj', obj);
    return obj
}