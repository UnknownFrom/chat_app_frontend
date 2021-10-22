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
            if (isset($_SESSION['user'])) {
                header('Location: ./profile');
            }
            require_once './Templates/auth-template.html';
            return;
        case 'users_register_route':
            if (isset($_SESSION['user'])) {
                header('Location: ./profile');
            }
            require_once './Templates/register-template.html';
            return;
        case 'users_profile_route':
            require_once './Templates/profile-template.html';
            return;
        case 'chat_route':
            echo '<script src="./assets/js/http_code.jquery.com_jquery-3.6.0.js"></script>';
            echo '<script src="./assets/js/index.js"></script>';

            require_once './Templates/chat-template.html';
            return;
        case 'users_logout_route':
            unset($_SESSION['user']);
            header('Location: ./auth');
            return;
    }
} catch (Exception $e) {
    die();
}
