if(localStorage.getItem('token'))
{
    document.location.href = 'chat';
}

$('button[id="button-enter"]').click(function (e) {

    e.preventDefault();

    $('input').removeClass('error');

    let login = $('input[name="login"]').val(),
        password = $('input[name="password"]').val();

    $.ajax({
        url: 'http://users.api.loc/signin',
        type: 'POST',
        dataType: 'json',
        data: {
            login: login,
            password: password
        },
        success(data) {
            if (data.status) {
                window.localStorage.setItem('token', data.token);
                console.log(data.token);
                document.location.href = 'chat';// + '?token=' + data.token;
            } else {
                if (data.type === 1) {
                    data.fields.forEach(function (field) {
                        $(`input[name="${field}"]`).addClass('error');
                    });
                }
                $('.msg').removeClass('none').text(data.message);
            }

        }
    })
});

/*let avatar = false;

$(`input[name="avatar"]`).change(function (e) {
    avatar = e.target.files[0];
});*/


$('button[id="button-reg"]').click(function (e) {

    e.preventDefault();

    $('input').removeClass('error');

    let login = $('input[name="login"]').val(),
        password = $('input[name="password"]').val(),
        fullName = $('input[name="fullName"]').val(),
        email = $('input[name="email"]').val(),
        passwordConfirm = $('input[name="passwordConfirm"]').val();


    let formData = new FormData();
    formData.append('login', login);
    formData.append('password', password);
    formData.append('passwordConfirm', passwordConfirm);
    formData.append('fullName', fullName);
    formData.append('email', email);
    //formData.append('avatar', avatar);

    $.ajax({
        url: 'http://users.api.loc/signup',
        type: 'POST',
        dataType: 'json',
        processData: false,
        contentType: false,
        cache: false,
        data: formData,

        success(data) {
            if (data.status) {
                document.location.href = 'auth';
            } else {
                if (data.type === 1) {
                    data.fields.forEach(function (field) {
                        $(`input[name="${field}"]`).addClass('error');
                    });
                }
                $('.msg').removeClass('none').text(data.message);
            }
        }
    })
});
