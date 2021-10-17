<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Регистрация</title>
    <link rel="stylesheet" href="main.css">
</head>
<body>
<form>
    <label>ФИО<label class="star">*</label></label>
    <input type="text" name="fullName" class="fullName" placeholder="Введите полное имя">
    <label>Логин<label class="star">*</label></label>
    <input type="text" name="login" class="login" placeholder="Введите логин">
    <label>e-mail<label class="star">*</label></label>
    <input type="email" name="email" class="email" placeholder="Введите почту">
    <label>Изображение профиля</label>
    <input type="file" name="avatar" class="avatar">
    <label>Пароль<label class="star">*</label></label>
    <input type="password" name="password" class="password" placeholder="Введите пароль">
    <label>Подтверждение пароля<label class="star">*</label></label>
    <input type="password" name="passwordConfirm" class="passwordConfirm" placeholder="Повторите пароль">
    <button type="submit" id="button-reg">Зарегистрироваться</button>
    <p>
        У вас уже есть аккаунт? - <a href="auth">авторизируйтесь</a>!
        <br>
        <label class="star">*</label> - обязательные поля для заполнения
    </p>
    <p class="msg none"></p>
</form>


<script src="jquery"></script>
<script src="main.js"></script>
</body>
</html>