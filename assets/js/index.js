let name, _event, id, status;
const chatEl = document.getElementById('chat');
const ws = new WebSocket('ws://127.0.0.1:8000');

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
    for (const message of messages) {
        if (!message.event) {
            message.event = 'send_message';
        }
        switch (message.event) {
            case 'add_user':
                /* записываем данные текущего пользователя */
                id = message.id;
                name = message.fullName;
                /* вывод активных пользователей и сообщения о входе */
                printUsers(message.usersList);
                printInfoMessage(message)
                break;
            case 'disconnect':
                /* закрытие соединения для дублированных вкладок */
                ws.send(JSON.stringify({token: localStorage.getItem('token'), _event: 'check_token'}))
                printUsers(message.usersList);
                printInfoMessage(message);
                break;
            case 'send_message':
                sendMessage(message);
                break;
        }
    }
}

function sendMessage(message)
{
    const timeEl = document.createElement('div');
    timeEl.appendChild(document.createTextNode(`${message.time}`));
    timeEl.classList.add('message_time');

    const messageEl = document.createElement('div');
    messageEl.appendChild(document.createTextNode(`${message.fullName}: ${message.message}`));

    const messageBlock = document.createElement('div');
    messageBlock.classList.add('message_block');
    messageBlock.appendChild(timeEl);
    messageBlock.appendChild(messageEl);
    if (name === message.fullName) {
        messageBlock.classList.add('message_self', 'message_color_self', 'message_block_self');
    }
    else{
        messageBlock.classList.add('message_another', 'message_color_another', 'message_block_another');
    }
    chatEl.appendChild(messageBlock);
    chatEl.scrollTo(0, chatEl.scrollHeight);
}


window.onbeforeunload = function () {
    status = 'offline';
    _event = 'disconnect';
    const message = 'отключается от чата';
    ws.send(JSON.stringify({
        id, message, _event
    }))
    ws.close();
};

const send = (event) => {
    event.preventDefault();
    _event = 'send_message';
    const message = document.getElementById('message-text').value;
    document.getElementById('message-text').value = '';
    if (message === '' || name === '') {
        return false;
    }
    console.log(message);
    ws.send(JSON.stringify({
        id, message, _event
    }))
}

const formEl = document.getElementById('chat-form');
formEl.addEventListener('submit', send);

const logoutEl = document.getElementById('listUsers');
logoutEl.addEventListener('submit', logout);

function logout(event) {
    event.preventDefault();
    status = 'offline';
    _event = 'disconnect';
    const message = 'отключается от чата';
    ws.send(JSON.stringify({
        id, message, _event
    }))
    //console.log(window.localStorage.getItem('token'));
    //console.log(window.localStorage.getItem('token'));
    //localStorage.removeItem('token');
    ws.close();
    localStorage.removeItem('token');
    window.location.href = 'http://chat.loc/';

    return true;
}

function printInfoMessage(message)
{
    const messageEl = document.createElement('div');
    messageEl.appendChild(document.createTextNode(`${message.fullName} ${message.message}`));
    messageEl.style.textAlign = 'center';
    messageEl.style.marginBottom = '5px';
    chatEl.appendChild(messageEl);
    chatEl.scrollTo(0, chatEl.scrollHeight);
}

function removeUsers() {
    const usersListEl = document.getElementById('users')
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
        const usersListEl = document.getElementById('users')
        const userEl = document.createElement('div');
        userEl.style.marginBottom = '5px';
        if (val[1] === name) {
            userEl.style.fontWeight = 'bold';
        }
        userEl.appendChild(document.createTextNode('●' + val[1]));
        usersListEl.appendChild(userEl);
    }
}
