<?php

use pavel\users\Routes;

include "./composer/vendor/autoload.php";

try {
    Routes::init();
    $parameters = Routes::getParameters();

    switch ($parameters['_route']) {
        case 'choice_route':
            require_once './Templates/index-template.html';
            return;
        case 'users_auth':
            echo "<script>window.AUTH_URL = '{$_ENV['AUTH_URL']}'</script>";
            require_once './Templates/auth-template.html';
            return;
        case 'users_register_route':
            echo "<script>window.REG_URL = '{$_ENV['REG_URL']}'</script>";
            require_once './Templates/register-template.html';
            return;
        case 'chat_route':
            try {
                echo "<script>window.WEBSOCKET_CONNECTION_URL = '{$_ENV['WEBSOCKET_CONNECTION_URL']}'</script>";
                require_once './Templates/chat-template.html';
                return;
            } catch (Exception $e) {
                header('Location: /');
            }
    }
} catch (Exception $e) {
    die();
}
