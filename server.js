const path = require('path');
const express =  require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers,getUserList} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//Set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'chat buddies';

//Run when client connects 

io.on('connection',socket=>{

    socket.on('joinRoom',({username,room})=>{

    const user = userJoin(socket.id,username,room);

    socket.join(user.room);         

    //Welcome current user
    socket.emit('message','center',formatMessage(botName,`Welcome <b><i>${user.username}</b></i> to  chat buddies`));//broadcast to single client

    
    //Broadcast when user connects
    socket.broadcast.to(user.room).emit('message','center',formatMessage(botName,`<b><i>${user.username}</b></i> has joined the chat`)); 
    // braodcast all the client except itself;


    // io.emit() 
     // braodcast all the client including itself;

   
    //send users and room info 
     io.to(user.room).emit('roomUsers',{
         room : user.room,
         users : getRoomUsers(user.room)
     });

 });
   
    //Listen for chatMessage
//   socket.on('chatMessage',(msg) =>{
//       const user = getCurrentUser(socket.id);
//         io.to(user.room).emit('message','right',formatMessage(user.username,msg));

//     });


    //send chat message to the users
    
    socket.on('chatMessage',(msg) =>{

         
         const user = getCurrentUser(socket.id);
         socket.broadcast.to(user.room).emit('message','left',formatMessage(user.username,msg));
         socket.emit('message','right',formatMessage(user.username,msg));

    });

  
    //Runs when client disconnects

     socket.on('disconnect',()=>{

        const user = userLeave(socket.id);

        // console.log(user.id);


         if(user){

            io.to(user.room).emit('message',formatMessage(botName,`<b><i>${user.username}</b></i> has left the chat`));

            //send users and room info 
            io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
            });
         }
         
         const userList  = getUserList();

         delete userList[socket.id];
    });


});

const PORT = 3000 || process.env.POST;

server.listen(PORT,() =>console.log(`Server running on port ${PORT}`));





