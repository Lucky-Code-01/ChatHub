const socket = io('https://chat-hub-nine.vercel.app', {
    transports: ['websocket', 'polling']
});
const userName = prompt("Enter your name :- ");
const msgbox = document.querySelector(".chat-box");
const input = document.querySelector(".msginput");
const form = document.querySelector(".send-form"); 
const msgSound = new Audio('./ImageAudio/Msg.mp3');

// notification function
function showNotification(message,position){
    const msg = document.createElement("div");
    msg.classList.add(position);
    msg.textContent = message;
    msgbox.append(msg);
    if(position == 'left'){
        msgSound.play();
    }
}


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    let msgtext = input.value;
    showNotification(msgtext,"right");
    socket.emit('send',msgtext);
    input.value = '';
    msgbox.scrollTo({ top:msgbox.scrollHeight,behavior: 'smooth' });
    
})


// event handle 
socket.emit('new-user-add',userName);
socket.on('user-joined',(name)=>{
    showNotification(`${name}: joined the chat`,"left");
    console.log(name);
})

socket.on('recive',(message)=>{
    showNotification(`${message.name}: ${message.message}`,"left");
})

// disconnect or left the chat
socket.on('left',(data)=>{
    showNotification(`${data}: Left the chat`,"left");
})


// function to send msg