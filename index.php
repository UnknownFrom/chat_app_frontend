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
            require_once './Templates/auth-template.html';
            return;
        case 'users_register_route':
            require_once './Templates/register-template.html';
            return;
        case 'users_profile_route':
            require_once './Templates/profile-template.html';
            return;
        case 'chat_route':
            try {
                //$decoded = JWT::decode($_GET['token'], $_ENV['EMAIL_KEY'], array('HS256'));
                require_once './Templates/chat-template.html';
                return;
            } catch (Exception $e)
            {
                header('Location: /');
            }
        case 'users_logout_route':
            unset($_SESSION['user']);
            header('Location: ./auth');
            return;
    }
} catch (Exception $e) {
    die();
}
