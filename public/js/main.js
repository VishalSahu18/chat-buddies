const chatForm = document.getElementById("chat-form");

const socket = io();

const chatMessages = document.querySelector(".chat-messages");

const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");


// get user name & roomname from url
const {username , room} = Qs.parse(location.search,{
  ignoreQueryPrefix : true
});


// Join chat room
socket.emit("joinRoom", {username, room});

//Get room and users
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//Message from server
socket.on("message", (position , message) => {

  outputMessage(message,position);

//scroll down automatically
    chatMessages.scrollTop = chatMessages.scrollHeight;

});


//Message submit

chatForm.addEventListener('submit', e => {

  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;

  //Emit message to server
  socket.emit('chatMessage', msg);

  //Clear  input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

});


//Output Message to DOM

function outputMessage(message,position) {

  const div = document.createElement('div');
  div.classList.add("message");
  div.classList.add(position);

  div.innerHTML = `<span class="username">~${message.username}</span>
                    <p class="content">
                       ${message.text}
                       <br>
                      <span class="time">${message.time}</span>
                    </p>`;
                

   chatMessages.appendChild(div);

}


// Add roomName to DOM
function outputRoomName(room) {
  roomName.innerHTML = `<b>${room}</b>`;
}


// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
      ${users.map((user) => `<li><b>${user.username}</b></li>`).join("")}
  `;
}

function check(){

  
}
