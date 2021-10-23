const searchString = new URLSearchParams(window.location.search);
let name;
let status;
const chatEl = document.getElementById("chat");
const ws = new WebSocket("ws://127.0.0.1:8000");

ws.onopen = () => {
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
            const mes = " подключился к чату";
            name = data.fullName;
            status = 'online';
            ws.send(JSON.stringify({
                name, mes, status
            }))
            const usersListEl = document.getElementById("users")
            const userEl = document.createElement('div');
            userEl.appendChild(document.createTextNode(`Вы: ${name}`));
            usersListEl.appendChild(userEl);
        },
        error: function ()
        {
            document.location.href= '/auth'
        }
    });
}

ws.onmessage = (message) => {
    const messages = JSON.parse(message.data);
    console.log(messages['name']);
    const messageEl = document.createElement('div');
    messageEl.appendChild(document.createTextNode(`${messages.name}: ${messages.mess}`));
    /*if(messages.name) {
        messageEl.appendChild(document.createTextNode(`${messages.name}: ${messages.mess}`));
    }else{
        messageEl.appendChild(document.createTextNode(`${messages.mess}`));
    }*/
    chatEl.appendChild(messageEl);
    chatEl.scrollTo(0, chatEl.scrollHeight);

    removeUsers();

    const usersList = messages.usersList;
    usersList.forEach((val) =>
    {
        const usersListEl = document.getElementById("users")
        const userEl = document.createElement('div');
        userEl.appendChild(document.createTextNode(val));
        usersListEl.appendChild(userEl);
    })
}

const send = (event) => {
    event.preventDefault();
    const mes = document.getElementById("message-text").value;
    document.getElementById("message-text").value = '';
    if(mes === '' || name === '')
    {
        return false;
    }
    ws.send(JSON.stringify({
        name, mes, status
    }))
}



const formEl = document.getElementById("chat-form");
formEl.addEventListener("submit", send);

const logoutEl = document.getElementById("listUsers");
logoutEl.addEventListener("submit", logout);

function logout(event){
    event.preventDefault();
    status = "offline";
    const mes = "отключается от чата";
    ws.send(JSON.stringify({
        name, mes, status
    }))
    //ws.close();
    window.location.href = "/";
    return false;
}

/*ws.onclose = () => {
    console.log("Вышел");
    const mes = " отключился от чата";
    const status = 'offline';
    //ws.close(1000, `${name} отключился от чата`);
    ws.send(JSON.stringify({
        name, mes, status
    }))
}*/

ws.onclose = function(event) {
    console.log("Вышел");
    const mes = " отключился от чата";
    const status = 'offline';
    //ws.close(1000, `${name} отключился от чата`);
    ws.send(JSON.stringify({
        name, mes, status
    }))};

function removeUsers(){
    const usersListEl = document.getElementById("users")
    while (usersListEl.firstChild)
    {
        usersListEl.removeChild(usersListEl.firstChild);
    }

}
