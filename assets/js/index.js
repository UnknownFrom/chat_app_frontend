const searchString = new URLSearchParams(window.location.search);
let name;
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
            status = 'online';
            const event = 'add_user';
            ws.send(JSON.stringify({
                name, message, status, event
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
    const messages = JSON.parse(message.data);
    console.log(messages);
    for(const val of messages)
    {
        const messageEl = document.createElement('div');
        messageEl.appendChild(document.createTextNode(`${val.fullName}: ${val.message}`));
        chatEl.appendChild(messageEl);
        chatEl.scrollTo(0, chatEl.scrollHeight);
    }

    removeUsers();
/*    const json = JSON.parse(messages.usersList)
    console.log(json);*/
    for(const val of messages[0].usersList)
    {
        console.log(val);
        const usersListEl = document.getElementById("users")
        const userEl = document.createElement('div');
        userEl.appendChild(document.createTextNode(val));
        usersListEl.appendChild(userEl);
    }
}

window.onunload = function(){
    status = "offline";
    const message = "отключается от чата";
    ws.send(JSON.stringify({
        name, message, status
    }))
    ws.close();
};

const send = (event) => {
    event.preventDefault();
    const message = document.getElementById("message-text").value;
    document.getElementById("message-text").value = '';
    if (message === '' || name === '') {
        return false;
    }
    ws.send(JSON.stringify({
        name, message, status
    }))
}

const formEl = document.getElementById("chat-form");
formEl.addEventListener("submit", send);

const logoutEl = document.getElementById("listUsers");
logoutEl.addEventListener("submit", logout);

function logout(event) {
    event.preventDefault();
    status = "offline";
    const message = "отключается от чата";
    ws.send(JSON.stringify({
        name, message, status
    }))
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
