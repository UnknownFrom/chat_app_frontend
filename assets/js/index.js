const searchString = new URLSearchParams(window.location.search);
let name = '';
$.ajax({
    url:"http://users.api.loc/token",
    type: "POST",
    dataType: "JSON",
    data: {
        token: searchString.get('token')
    },
    success(data){
        if(!data.status)
        {
            document.location.href= '/auth';
        }
        name = data.fullName;
    },
    error: function ()
    {
        document.location.href= '/auth'
    }
});
const chatEl = document.getElementById("chat");
const ws = new WebSocket("ws://127.0.0.1:8000");
ws.onmessage = (message) => {
    const messages = JSON.parse(message.data);
    messages.forEach((val) => {
        const messageEl = document.createElement('div');
        messageEl.appendChild(document.createTextNode(`${val.name}: ${val.message}`));
        chat.appendChild(messageEl);
        chat.scrollTo(0, chat.scrollHeight);
    })
}
const send = (event) => {
    event.preventDefault();
    const message = document.getElementById("message-text").value;
    document.getElementById("message-text").value = '';
    if(message === '' || name === '')
    {
        return false;
    }
    ws.send(JSON.stringify({
        name, message
    }))
}
const formEl = document.getElementById("chat-form");
formEl.addEventListener("submit", send);
