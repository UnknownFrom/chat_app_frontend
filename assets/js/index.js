let name, _event, id, limit = 20, _offset = 0;
const chatEl = document.getElementById('chat');
const ws = new WebSocket('ws://127.0.0.1:8000');

ws.onopen = () => {
    if (!localStorage.getItem('token')) {
        ws.close();
        document.location.href = 'http://chat.loc/'
        return;
    }
    ws.send(JSON.stringify({token: localStorage.getItem('token'), limit, _offset, _event: 'check_token'}))
}

ws.onmessage = (message) => {
    const messages = JSON.parse(message.data, reviver);
    console.log(messages);
    if(messages.event === 'send_page')
    {
        sendPage(messages.data);
    }
    for (const message of messages.data) {
        switch (messages.event) {
            case 'add_user':
                /* вывод активных пользователей и сообщения о входе */
                printInfoMessage(message)
                printUsers(message.usersList);
                _event = 'send_page';
                ws.send(JSON.stringify({limit, _offset, _event}))
                break;
            case 'confirm_user':
                /* записываем данные текущего пользователя */
                id = message.id;
                name = message.fullName;
                _event = 'add_user';
                ws.send(JSON.stringify({
                    id, message, _event
                }))
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

window.onbeforeunload = function () {
    /*status = 'offline';
    _event = 'disconnect';
    const message = 'отключается от чата';
    ws.send(JSON.stringify({
        id, message, _event
    }))*/
    ws.close();
};

const formEl = document.getElementById('chat-form');
formEl.addEventListener('submit', send);

const logoutEl = document.getElementById('listUsers');
logoutEl.addEventListener('submit', logout);

/* обработка скролла */
chatEl.addEventListener('scroll', function () {
    if (chatEl.scrollTop === 0) {
        _offset++;
        _event = 'send_page';
        ws.send(JSON.stringify({limit, _offset, _event}))
    }
})

/* вывод новой страницы сообщений */
function sendPage(messages) {
    for (const massage of messages) {
        addMessageToBegin(massage);
    }
}

function addMessageToBegin(message) {
    const messageBlock = createMessageBlock(message);
    chatEl.insertBefore(messageBlock, chatEl.firstChild);
}

function sendMessage(message) {
    const messageBlock = createMessageBlock(message);
    chatEl.appendChild(messageBlock);
    chatEl.scrollTo(0, chatEl.scrollHeight);
}

function createMessageBlock(message){
    /* время сообщения */
    const timeEl = document.createElement('div');
    timeEl.appendChild(document.createTextNode(`${message.time}`));
    timeEl.classList.add('message_time');
    /* текст сообщения */
    const messageEl = document.createElement('div');
    messageEl.classList.add('message_text');
    messageEl.appendChild(document.createTextNode(`${message.fullName}: ${message.message}`));
    /* весь блок сообщения */
    const messageBlock = document.createElement('div');
    messageBlock.classList.add('message_block');
    messageBlock.appendChild(timeEl);
    messageBlock.appendChild(messageEl);
    /* чъё сообщение */
    if (name === message.fullName) {
        messageBlock.classList.add('message_block_self');
    } else {
        messageBlock.classList.add('message_block_another');
    }
    return messageBlock;
}

function send(event){
    event.preventDefault();
    _event = 'send_message';
    const message = document.getElementById('message-text').value;
    document.getElementById('message-text').value = '';
    if (message === '' || name === '') {
        return false;
    }
    ws.send(JSON.stringify({
        id, message, _event
    }))
}

function logout(event) {
    event.preventDefault();
    status = 'offline';
    _event = 'disconnect';
    const message = 'отключается от чата';
    ws.send(JSON.stringify({
        id, message, _event
    }))
    ws.close();
    localStorage.removeItem('token');
    window.location.href = 'http://chat.loc/';
    return true;
}

function printInfoMessage(message) {
    if(name === message.fullName)
    {
        return;
    }
    const messageEl = document.createElement('div');
    messageEl.classList.add('message_text')
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

function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}
