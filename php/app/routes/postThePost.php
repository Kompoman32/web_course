<?php
    require_once 'app/db.php';

    $title= null;
    $text= null;
    $category= null;
    $file= null;


    if (isset($_POST['Title'])) {
        $title = $_POST['Title'];
    }

    if (isset($_POST['Text'])) {
        $text = $_POST['Text'];
    }

    if (isset($_POST['Category'])) {
        $category = $_POST['Category'];
    }

    if (isset($_FILES['img']['tmp_name']) && $_FILES['img']['size'] > 0) {
        $file = fread(fopen($_FILES['img']['tmp_name'],'r'),$_FILES['img']['size']);
    }

    $db->postPost($title, $text, $category, $file);

    header('Location: /');

?>