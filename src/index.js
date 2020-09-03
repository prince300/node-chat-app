const express=require('express')
const path= require('path')
const http=require('http')
const socketio=require('socket.io')
const { Socket } = require('dgram')
const Filter=require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utilis/mesaages')
const{addUser,removeUser,getUsersInRoom,getUser}=require('./utilis/users')
const { get } = require('https')

const app = express()
const server=http.createServer(app)
const io=socketio(server)

const publicd=path.join(__dirname,'../public')

app.use(express.static(publicd))
const port= process.env.PORT || 3000
let count=0
io.on('connection',(socket)=>{
    console.log('New Web-Socket Connection')
    
   socket.on('join',(options,callback)=>{
        const {error,user}=addUser({id:socket.id,...options})
    if(error)
    {
        return callback(error)
    }
    
        socket.join(user.room)
    socket.emit('message',generateMessage('Admin','Welcome!'))
    socket.broadcast.to(user.room).emit('message',generateMessage('Admin',` ${user.username} Has Joined!`))
   io.to(user.room).emit('roomData',{
       room:user.room,
       users:getUsersInRoom(user.room)
   })
    
    callback()
})

   
    socket.on('sendMessage',(message,callback)=>{
       const user=getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(message))
        {return callback('profanity is not allowed')}
            io.to(user.room).emit('message',generateMessage(user.username,message))
    
        callback()
    })
    socket.on('disconnect',()=>{
       const user=removeUser(socket.id)

      if(user){
        io.to(user.room).emit('message',generateMessage('Admin',`${user.username} Has Left!`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })
      }

        })
/*socket.emit('countUpdated',count)
socket.on('increment',()=>{
    count++
    //socket.emit('countUpdated', count)
    io.emit('countUpdated', count)
})*/
socket.on('sendLocation',(coords,callback)=>{
    const user=getUser(socket.id)
    io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
     callback()
})
})
server.listen(port,()=>{
    console.log(`ur server is working on port ${port}!`)
})