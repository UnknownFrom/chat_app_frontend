/* если пользователь авторизован, перекидываем на чат */
if (localStorage.getItem('token')) {
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
                /* сохранение авторизованного пользователя */
                window.localStorage.setItem('token', data.token);
                document.location.href = 'chat';
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
