<?php

namespace pavel\users;

use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class Routes
{
    static RouteCollection $routeCollection;
    static RequestContext $context;
    static UrlMatcher $matcher;

    static function init()
    {
        try {
            // Инициализация маршрутов
            $choice_route = new Route('/');
            $users_auth_route = new Route('/auth');
            $users_register_route = new Route('/register');
            $users_profile_route = new Route('/profile');
            $users_logout_route = new Route('/logout');

            self::$routeCollection = new RouteCollection();
            self::$routeCollection->add('choice_route', $choice_route);
            self::$routeCollection->add('users_auth', $users_auth_route);
            self::$routeCollection->add('users_register_route', $users_register_route);
            self::$routeCollection->add('users_profile_route', $users_profile_route);
            self::$routeCollection->add('users_logout_route', $users_logout_route);

            self::$context = new RequestContext();
            self::$context->fromRequest(Request::createFromGlobals());

            self::$matcher = new UrlMatcher(self::$routeCollection, self::$context);
        } catch (ResourceNotFoundException $e) {
            Users::jsonAnswer(['error' => $e->getMessage()], 404);
            die();
        }
    }

    static function getParameters(): array
    {
        return self::$matcher->match(self::$context->getPathInfo());
    }
}
