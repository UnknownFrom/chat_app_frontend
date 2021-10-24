const searchString = new URLSearchParams(window.location.search);
let name;
let _event;
let id;
let status;
const chatEl = document.getElementById("chat");
const ws = new WebSocket("ws://127.0.0.1:8000");

ws.onopen = () => {
    /*let response = await fetch("http://users.api.loc/token",{
        mode: 'no-cors',
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({token: searchString.get('token')})
    });
    let json = await response.json();
    console.log(json);*/
    $.ajax({
        url: "http://users.api.loc/token",
        type: "POST",
        dataType: "JSON",
        data: {
            token: searchString.get('token')
        },
        success(data) {
            if (!data.status) {
                document.location.href = '/auth';
            }
            const message = " подключился к чату";
            name = data.fullName;
            id = data.id;
            status = 'online';
            _event = 'add_user';
            ws.send(JSON.stringify({
                id, name, message, status, _event
            }))
            /*const usersListEl = document.getElementById("users")
            const userEl = document.createElement('div');
            userEl.appendChild(document.createTextNode(`Вы: ${name}`));
            usersListEl.appendChild(userEl);*/
        },
        error: function () {
            document.location.href = '/auth'
        }
    });
}

ws.onmessage = (message) => {
    //console.log(message);
    const messages = JSON.parse(message.data, reviver);
    //console.log(messages);
    let messageEl;
    for(const message of messages){
        if(!message.event)
        {
            message.event = "send_message";
        }
        console.log(message);
        switch (message.event)
        {
            case 'add_user':
                //console.log("34g3");
                printUsers(message.usersList);
                break;
            case 'disconnect':
                printUsers(message.usersList);
                messageEl = document.createElement('div');
                messageEl.appendChild(document.createTextNode(`${message.fullName}: ${message.message}`));
                chatEl.appendChild(messageEl);
                chatEl.scrollTo(0, chatEl.scrollHeight);
                break;
            case 'send_message':
                messageEl = document.createElement('div');
                messageEl.appendChild(document.createTextNode(`${message.fullName}: ${message.message}`));
                chatEl.appendChild(messageEl);
                chatEl.scrollTo(0, chatEl.scrollHeight);
                break;
        }
    }
    /*console.log(messages);
    for(const val of messages)
    {
        const messageEl = document.createElement('div');
        messageEl.appendChild(document.createTextNode(`${val.fullName}: ${val.message}`));
        chatEl.appendChild(messageEl);
        chatEl.scrollTo(0, chatEl.scrollHeight);
    }*/

    //removeUsers();
/*    const json = JSON.parse(messages.usersList)
    console.log(json);*/
    //printUsers(messages[0].usersList)
}



window.onunload = function(){
    status = "offline";
    _event = "disconnect";
    const message = "отключается от чата";
    ws.send(JSON.stringify({
        id, name, message, status, _event
    }))
    ws.close();
};

const send = (event) => {
    event.preventDefault();
    _event = "send_message";
    const message = document.getElementById("message-text").value;
    document.getElementById("message-text").value = '';
    if (message === '' || name === '') {
        return false;
    }
    ws.send(JSON.stringify({
        id, name, message, status, _event
    }))
}

const formEl = document.getElementById("chat-form");
formEl.addEventListener("submit", send);

const logoutEl = document.getElementById("listUsers");
logoutEl.addEventListener("submit", logout);

function logout(event) {
    event.preventDefault();
    /*status = "offline";
    _event = 'disconnect';
    const message = "отключается от чата";
    ws.send(JSON.stringify({
        id, name, message, status, _event
    }))*/
    //ws.close();
    window.location.href = "/";
    return false;
}

function removeUsers() {
    const usersListEl = document.getElementById("users")
    while (usersListEl.firstChild) {
        usersListEl.removeChild(usersListEl.firstChild);
    }
}
function reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

function printUsers(data)
{
    removeUsers();
    //console.log(data);
    for(const val of data)
    {
        const usersListEl = document.getElementById("users")
        const userEl = document.createElement('div');
        userEl.appendChild(document.createTextNode(val[1]));
        usersListEl.appendChild(userEl);
    }
}
