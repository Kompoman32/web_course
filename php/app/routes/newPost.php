<?php include 'head.php' ?>
    <h1>Новый пост</h1>
    <div class="posts-list">
        <form method="POST" action="/PostThePost" enctype="multipart/form-data">
            <article class="new post">
                <table cellspacing="10">
                    <tr>
                        <td><span>Заголовок</span></td>
                        <td><input name="Title" class='title' placeholder="Заголовок" style="width: 200px"></td>
                    </tr>
                    <tr>
                        <td><span>Текст</span></td>
                        <td><textarea name="Text" class='text' placeholder="Текст поста" style="width: 200px"></textarea></td>
                    </tr>
                    <tr>
                        <td><span>Категория</span></td>
                        <td><select name="Category" class='category' rows="4" style="width: 200px">
                                <?php
                                    $categories = $db->getCategories();

                                    if (is_array($categories)) {
                                        foreach($categories as $c) {
                                            $id=$c['Id'];
                                            $name=$c['Name'];
                                            echo "<option value='$id'>$name</option>";
                                        }
                                    }
                                
                                ?>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td><span>Картинка</span></td>
                        <td><input name="img" type="file" class='file' style="width: 200px"></td>
                    </tr>
                </table>
                <button  type="submit" class='more-link'>Запостить</button>
            </article>
        </form>
    </div>

<?php include 'foot.php' ?>