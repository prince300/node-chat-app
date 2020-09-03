const users=[]

//addUsers,removeUsers,getUsers,getUSersinroom
const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()//trim isliye kiya hai jisse ki uske pheel ka space aur baad ka space hatt jaye aur to lowercase sare letter lowercase me aajaye

    room=room.trim().toLowerCase()

    //validate teh dATA
    if(!username || !room)
    {
        return 
        {
            error:'usrname and room are required'
        }
    }

    //check for existing user
const existingUser=users.find((user)=>{
    return user.room===room && user.username===username
})

//validate username
if(existingUser)
{
    return {
        error:'username is in use!'
    }
}
//sstoreuser
const user={id,username,room}
users.push(user)
return {user}
}
/*
*/

const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!=-1)
    {
        return users.splice(index,1)[0]
    }
}
//console.log(users)
const getUser=(id)=>{
return users.find((user)=>user.id===id)

}

const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)

}

module.exports={
   addUser,
   removeUser,
   getUsersInRoom,
   getUser 
}
/*addUser({id:22,
    username: 'prince',
    room:'delhi'})
    
//console.log(getUser(22))
//console.log(getUsersInRoom('delhi'))*/