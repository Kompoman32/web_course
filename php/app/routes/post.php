<?php include 'head.php' ?>

    <div class="posts-list">
        <?php
            $id = null;
        
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
            }
            $article = $db->getArticle($id);

            if (isset($article)) {
                $id = $article['Id'];
                $c_id = $article['c_id'];
                $c_name = $article['c_name'];
                $title = $article['Title'];
                $text = $article['Text'];
                $img = base64_encode($article['img']);
    
                echo "
                    <article class='post'>";
                if ($img != "") {
                    echo   "<div class='post-image'><img src='data:image/png;base64, ".$img."'></div>";
                }   
                echo   "<div class='post-content'>
                            <div class='category'><a href='/categories?category=$c_id'>$c_name</a></div>
                            <h2 class='post-title'>$title</h2>
                            <p>$text</p>
                        </div>
                    </article>
                ";
            }
        ?>
    </div>

<?php include 'foot.php' ?>