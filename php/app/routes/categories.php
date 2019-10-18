<?php include 'head.php' ?>

    <div class="posts-list">
    <?php 
            $count = 10;
            $page = 0;
            $category = 0;

            if (isset($_GET['count'])) {
                $count = $_GET['count'];
            }
        
            if (isset($_GET['page'])) {
                $page = $_GET['page'];
            }

            if (isset($_GET['category'])) {
                $category = $_GET['category'];
            } else {
                $categories = $db->getCategories();

                echo '<h1>Категории</h1>';
                echo '<ol>';
                if (is_array($categories)) {
                    foreach($categories as $c) {
                        $id =$c['Id'];
                        $name =$c['Name'];
                        echo "<li>
                                <a href='Categories?category=$id'>$name</a>                        
                             </li>";
                    } 
                }
                echo '</ol>';
                exit();
            }
        
            $articles = $db->getArticlesByCategory($count, $page, $category);
        
            if (is_array($articles)) {
                foreach ($articles as $a) {
                    $id = $a['Id'];
                    $c_id = $a['c_id'];
                    $c_name = $a['c_name'];
                    $title = $a['Title'];
                    $text = $a['Text'];
                    $img = base64_encode($a['img']);
                    $date = $a['Publish_date'];
        
                    echo "
                        <article class='post'>";
                    if ($img != "") {   
                        echo    "<div class='post-image'><a href='/Post?id=$id'><img src='data:image/png;base64, ".$img."'></a></div>";
                    }
                    echo   "<div>Пост создан: $date</div>
                            <div class='post-content'>
                                    <div class='category'><a href='/Categories?id=$c_id'>$c_name</a></div>
                                    <h2 class='post-title'>$title</h2>
                                    <p>$text</p>
                                <div class='post-footer'>
                                    <a class='more-link' href='/Post?id=$id'>Продолжить чтение</a>
                                </div>
                            </div>
                        </article>
                    ";
                }
            }
        ?>
    </div>

<?php include 'foot.php' ?>