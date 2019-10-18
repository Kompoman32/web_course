<?php
    include_once 'app/Request.php';
    include_once 'app/Router.php';

    $router = new Router(new Request);
    $router->get('/', 'Лента', function($request, $title) {
        ob_start();
        include( 'app/routes/index.php' );
        return ob_get_clean();
    });

    $router->get('/New', 'Новый пост', function($request, $title) {
        ob_start();
        include( 'app/routes/newPost.php' );
        return ob_get_clean();
    });

    $router->get('/Post', false, function($request) {
        ob_start();
        include( 'app/routes/post.php' );
        return ob_get_clean();
    });

    $router->post('/PostThePost', false, function($request) {
        ob_start();
        include( 'app/routes/postThePost.php' );
        return ob_get_clean();
    });

    $router->get('/Categories', 'Категории', function($request) {
        ob_start();
        include( 'app/routes/categories.php' );
        return ob_get_clean();
    });

    $_SESSION['ROUTER'] = $router;
?>