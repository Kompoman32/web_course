            <aside>
                <div class="widget">
                    <h3 class="widget-title">Последние записи</h3>
                    <ul class="widget-posts-list">
                        <?php
                            $articles = $db->getArticles(3, 0);

                            if (is_array($articles)) {
                                foreach ($articles as $a) {
                                    $id = $a['Id'];
                                    $img = base64_encode($a['img']);
                                    $title = $a['Title'];

                                    echo "
                                        <li>";
                                    if ($img != "") {
                                        echo   "<div class='post-image-small'>
                                                    <a href='/Post?id=$id'><img src ='data:image/png;base64, ".$img."'></a>
                                                </div>";
                                    }   
                                    echo     "<a href='/Post?id=$id'><h4 class='widget-post-title'>$title</h4></a>
                                        </li>
                                    ";
                                }
                            }
                        ?>
                    </ul>
                </div>
            </aside>
        </div>
        <footer>
            <div class="container">
                <span>Сервер моего бложика © <?php echo date('Y') ?></span>
            </div>
        </footer>
        <script>
            $('.nav-toggle').on('click', function(){
                $('#menu').toggleClass('active');
            });
        </script>
    </body>
</html>