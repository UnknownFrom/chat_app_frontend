let name, _event, id, status;
const chatEl = document.getElementById("chat");
const ws = new WebSocket("ws://127.0.0.1:8000");

ws.onopen = () => {
    if (!localStorage.getItem('token')) {
        ws.close();
        document.location.href = 'http://chat.loc/'
        return;
    }
    ws.send(JSON.stringify({token: localStorage.getItem('token'), _event: 'check_token'}))
}

ws.onmessage = (message) => {
    const messages = JSON.parse(message.data, reviver);
    console.log(messages);
    let messageEl;
    for (const message of messages) {
        if (!message.event) {
            message.event = "send_message";
        }
        switch (message.event) {
            case 'add_user':
                id = message.id;
                name = message.fullName;
                printUsers(message.usersList);
                messageEl = document.createElement('div');
                messageEl.appendChild(document.createTextNode(`${message.fullName} ${message.message}`));
                messageEl.style.textAlign = 'center';
                messageEl.style.marginBottom = '5px';
                chatEl.appendChild(messageEl);
                chatEl.scrollTo(0, chatEl.scrollHeight);
                break;
            case 'disconnect':
                ws.send(JSON.stringify({token: localStorage.getItem('token'), _event: 'check_token'}))
                //window.localStorage.clear();
                printUsers(message.usersList);
                messageEl = document.createElement('div');
                messageEl.appendChild(document.createTextNode(`${message.fullName} ${message.message}`));
                messageEl.style.textAlign = 'center';
                messageEl.style.marginBottom = '5px';
                chatEl.appendChild(messageEl);
                chatEl.scrollTo(0, chatEl.scrollHeight);
                break;
            case 'send_message':
                messageEl = document.createElement('div');
                messageEl.appendChild(document.createTextNode(`${message.fullName}: ${message.message}`));
                if (name === message.fullName) {
                    messageEl.style.textAlign = "right"
                }
                chatEl.appendChild(messageEl);
                chatEl.scrollTo(0, chatEl.scrollHeight);
                break;
        }
    }
}

window.onbeforeunload = function () {
    status = "offline";
    _event = "disconnect";
    const message = "отключается от чата";
    ws.send(JSON.stringify({
        id, message, _event
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
    console.log(message);
    ws.send(JSON.stringify({
        id, message, _event
    }))
}

const formEl = document.getElementById("chat-form");
formEl.addEventListener("submit", send);

const logoutEl = document.getElementById("listUsers");
logoutEl.addEventListener("submit", logout);

function logout(event) {
    event.preventDefault();
    status = "offline";
    _event = "disconnect";
    const message = "отключается от чата";
    ws.send(JSON.stringify({
        id, message, _event
    }))
    //console.log(window.localStorage.getItem('token'));
    //console.log(window.localStorage.getItem('token'));
    //localStorage.removeItem('token');
    ws.close();
    localStorage.removeItem('token');
    window.location.href = "http://chat.loc/";

    return true;
}

function removeUsers() {
    const usersListEl = document.getElementById("users")
    while (usersListEl.firstChild) {
        usersListEl.removeChild(usersListEl.firstChild);
    }
}

function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

function printUsers(data) {
    removeUsers();
    for (const val of data) {
        const usersListEl = document.getElementById("users")
        const userEl = document.createElement('div');
        userEl.style.marginBottom = '5px';
        if (val[1] === name) {
            userEl.style.fontWeight = 'bold';
        }
        userEl.appendChild(document.createTextNode('●' + val[1]));
        usersListEl.appendChild(userEl);
    }
}
