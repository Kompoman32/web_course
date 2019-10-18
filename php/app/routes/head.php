<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Блог</title>
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,600,600italic,700,700italic|Playfair+Display:400,700&subset=latin,cyrillic">
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.css">
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
        <?php
            require_once 'app/db.php';
        ?>
    </head>
    <body>
        <header>
            <nav class="container">
                <a class="logo" href="/">
                    <span>L</span>
                    <span>O</span>
                    <span>G</span>
                    <span>O</span>
                </a>
                <div class="nav-toggle"><span></span></div>
                <ul id="menu">
                    <?php
                        foreach ($_SESSION['ROUTER']->_routes as $key => $value) 
                        {
                            echo "<li><a href=\"{$key}\" >{$value}</a></li>";
                        }
                    ?>
                </ul>
            </nav>
        </header>
        <div class="container">