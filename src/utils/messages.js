const users = [];

function userJoin(id, user, room){
  const username = {id, user, room};
  users.push(username);
  console.log('usersss: ', users)

  return user;
}

function userLeave(id){
  const index = users.findIndex(user => user.id === id);

  if( index !== -1){
    return users.splice(index, 1)[0]
  }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
  }

module.exports = {getRoomUsers,userJoin, userLeave};