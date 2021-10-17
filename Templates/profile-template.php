<?php
session_start();
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Профиль</title>
    <link rel="stylesheet" href="main.css">
</head>
<body>
<form>
    <h2 style="margin: 5px 0; font-size: 20px; align-self: center"><?= $_SESSION['user']['fullName'] ?></h2>
    <a href="mailto: <?= $_SESSION['user']['email'] ?>" style="align-self: center"><?= $_SESSION['user']['email'] ?></a>
    <a href="logout" class="logout">Выход</a>
</form>
</body>
</html>