const users = [];

function userJoin(room_uid, studid_fld, user, room){
  const username = {room_uid, studid_fld, user, room};
  users.push(username);
  console.log('All Username: ', users)

  return user;
}

function userLeave(room_uid){
  const index = users.findIndex(user => user.room_uid === room_uid);

  if( index !== -1){
    return users.splice(index, 1)[0]
  }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
  }

module.exports = {getRoomUsers,userJoin, userLeave};