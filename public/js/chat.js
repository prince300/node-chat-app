var socket=io()
//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messageLocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix: true})

const autoscroll=()=>{
//new message elment
const $newMessage=$messages.lastElementChild

//height of the new message
const newMessageStyles=getComputedStyle($newMessage)
const newMessageMargin=parseInt(newMessageStyles.marginBottom)
const newMessageHeight=$newMessage.offsetHeight+newMessageMargin

//visible height
const visibleHeight=$messages.offsetHeight

//height of messages container
const conttainerHeight=$messages.scrollHeight

//how far i scrolled?
const scrollOffset=$messages.scrollTop+visibleHeight

if(conttainerHeight-newMessageHeight<=scrollOffset)
{
$messages.scrollTop=$messages.scrollHeight
}
}


socket.on('message',(message)=>{
    console.log(message)
    var html=Mustache.render(messageTemplate,{
        username:message.username,
    message:message.text,
    createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
autoscroll()
})

socket.on('locationMessage',(msg)=>{
    console.log(msg)
var html=Mustache.render(locationTemplate,{username:msg.username,url:msg.url,
createdAt:moment(msg.createdAt).format('h:mm a')})
$messages.insertAdjacentHTML('beforeend',html)
autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
       room,
       users 
    })
    document.querySelector('#sidebar').innerHTML=html
})
$messageForm.addEventListener('submit',(e)=>{
    
e.preventDefault()
//disable
$messageFormButton.setAttribute('disabled','disabled')

const message= e.target.elements.message.value
socket.emit('sendMessage',message,(error)=>{
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''
    $messageFormInput.focus( )
    if(error)
    {
        return console.log(error)
    }
    console.log('Mesaage  Delievered!')
})
})

/*socket.on('countUpdated',(count)=>{
    console.log('count has been updated', count)
})*/

/*document.querySelector('#increment').addEventListener('click',()=>{
    console.log('clicked')
    socket.emit('increment')
})*/
$messageLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('Your Browser Is not supoort to geolation!')
    }

    $messageLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        const latitud=position.coords.latitude
        const longitud=position.coords.longitude
        socket.emit('sendLocation',{
            latitude:latitud,
            longitude:longitud
        },()=>{
            $messageLocationButton.removeAttribute('disabled')
            console.log('Location  Shared!')
        })
    })
})
socket.emit('join',{username,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href='/'
    }
})