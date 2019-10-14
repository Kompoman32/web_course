<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Блог</title>
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,600,600italic,700,700italic|Playfair+Display:400,700&subset=latin,cyrillic">
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.css">
        <link rel="stylesheet" type="text/css" href="styles/common.css">
        <link rel="stylesheet" type="text/css" href="styles/header.css">
        <link rel="stylesheet" type="text/css" href="styles/article.css">
        <link rel="stylesheet" type="text/css" href="styles/aside.css">
        <link rel="stylesheet" type="text/css" href="styles/footer.css">
        <link rel="stylesheet" type="text/css" href="styles/adaptive.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
        <style>
            <?php 
                include 'styles/common.css';
                include 'styles/header.css';
                include 'styles/article.css';
                include 'styles/aside.css';
                include 'styles/footer.css';
                include 'styles/adaptive.css';
            ?>
        </style>
    </head>
    <body>
        <header>
            <nav class="container">
                <a class="logo" href="">
                    <span>L</span>
                    <span>O</span>
                    <span>G</span>
                    <span>O</span>
                </a>
                <div class="nav-toggle"><span></span></div>
                <ul id="menu">
                    <?php
                        include './router.php';

                        $router =  new Route();
                        $router->add('/', 'Блог');
                        $router->add('/protfolio', 'Портфолио');
                        $router->add('/about', 'Об авторе');
                        $router->add('/admin', 'PHP ADMIN');

                        foreach ($router->_uri as $key => $value) 
                        {
                            echo "<li><a href=\"{$key}\">{$value}</a></li>";
                        }
                    ?>
                </ul>
            </nav>
        </header>
        <div class="container">
            <div class="posts-list">
                <article id="post-1" class="post">
                    <div class="post-image"><a href=""><img src="https://html5book.ru/wp-content/uploads/2016/05/rasskaz_slovar_rodnoy_prirodi.jpg"></a></div>
                    <div class="post-content">
                        <div class="category"><a href="">Дизайн</a></div>
                        <h2 class="post-title">Весна</h2>
                        <p>Очень богат русский язык словами, относящимися к временам года и к природным явлениям, с ними связанным.</p>
                        <div class="post-footer">
                            <a class="more-link" href="">Продолжить чтение</a>
                        </div>
                    </div>
                </article>
                <article id="post-2" class="post">

                </article>
            </div>
            <aside>
                <div class="widget">
                    <h3 class="widget-title">Последние записи</h3>
                    <ul class="widget-posts-list">
                        <li>
                            <div class="post-image-small">
                            <a href=""><img src="https://html5book.ru/wp-content/uploads/2016/05/rasskaz_slovar_rodnoy_prirodi.jpg"></a>
                            </div>
                            <h4 class="widget-post-title">Весна</h4>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
        <footer>
            <div class="container">
                <span>Сервер блогов © <?php echo date('Y') ?></span>
            </div>
        </footer>
        <script>
            $('.nav-toggle').on('click', function(){
                $('#menu').toggleClass('active');
            });
        </script>
    </body>
</html>

