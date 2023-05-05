export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[0].name : users[1].name;
}

export const getSenderFull = (loggedUser, users) => {
    let resp = users[0]._id === loggedUser._id ? users[0] : users[1];
    let obj = {data: resp};
    // console.log('return obj', obj);
    return obj
}