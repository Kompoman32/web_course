<?php

    class DB {

        private const DB_PATH = 'db/blog.db';

        private $pdo;

        public function connect() {
            if ($this->pdo == null) {
                $this->pdo = new PDO("sqlite:" . DB::DB_PATH);
            }
            return $this;
        }

        public function PDO () {
            return $pdo;
        }

        public function getArticles($count, $page) {
            if ($this->pdo == null) {
                throw 'Database is not connected';
            }
            
            if (!is_numeric($count) || $count < 0) {
                $count = 10;
            }

            if (!is_numeric($page) || $page < 0) {
                $page = 0;
            }

            $skipCount = $count * $page;

            $stmt = $this->pdo->prepare('SELECT a.*, ac.name c_name, ac.id c_id FROM Article a 
                                         LEFT JOIN Article_category ac on ac.id == a.category_id
                                         ORDER BY a.publish_date desc
                                         LIMIT :skipCount, :count ');
            $stmt->execute(['count' => $count, 'skipCount' => $skipCount]);
            $articles = $stmt->fetchAll();

            
            return $articles;
        }

        public function getArticlesByCategory($count, $page, $category) {
            if ($this->pdo == null) {
                throw 'Database is not connected';
            }
            
            if (!is_numeric($count) || $count < 0) {
                $count = 10;
            }

            if (!is_numeric($page) || $page < 0) {
                $page = 0;
            }
            
            if (!is_numeric($category) || $category < 0) {
                $category = null;
            }

            $skipCount = $count * $page;

            $stmt = $this->pdo->prepare('SELECT a.*, ac.name c_name, ac.id c_id FROM Article a 
                                         LEFT JOIN Article_category ac on ac.id == a.category_id
                                         WHERE ac.id = :category
                                         ORDER BY a.publish_date desc
                                         LIMIT :skipCount, :count ');
            $stmt->execute(['count' => $count, 'skipCount' => $skipCount, 'category' => $category]);
            $articles = $stmt->fetchAll();

            
            return $articles;
        }

        public function getArticle($id) {
            if ($this->pdo == null) {
                throw 'Database is not connected';
            }
            
            if (!is_numeric($id)) {
                $id = null;
            }

            $stmt = $this->pdo->prepare('SELECT a.*, ac.name c_name, ac.id c_id FROM Article a 
                                         LEFT JOIN Article_category ac on ac.id == a.category_id
                                         where a.id = :id ');

            $stmt->execute(['id' => $id]);
            $article = $stmt->fetchAll()[0];
            
            return $article;
        }

        public function getImage($id) {
            if ($this->pdo == null) {
                throw 'Database is not connected';
            }
            
            if (!is_numeric($id)) {
                return null;
            }

            $stmt = $this->pdo->prepare('SELECT img FROM Article
                                         where id = :id 
                                         LIMIT 1');
            $stmt->execute(['id' => $id]);
            $img = $stmt->fetchAll()[0]['img'];
            return $img;
        }

        public function getCategories() {
            if ($this->pdo == null) {
                throw 'Database is not connected';
            }
            
            $stmt = $this->pdo->prepare('SELECT * FROM Article_category');
            $stmt->execute();
            return $stmt->fetchAll();
        }

        public function postPost($title, $text, $category_id, $img) {
            if ($this->pdo == null) {
                echo 'Database is not connected';
            }

            if (!is_numeric($category_id)) {
                echo 'Category id is not defined';
            }

            if (is_null($title) || $title == "") {
                $title = "Заголовок";
            }

            if (is_null($text) || $text == "") {
                $text = "Текст";
            }
            
            $stmt = $this->pdo->prepare('INSERT INTO Article (title, text, category_id, img)
                                         VALUES (:title, :text, :category_id, :img)');
            $stmt->execute(['title' => $title, 'text' => $text, 'category_id' => $category_id, 'img' => $img]);

            return true;
        }
    }

    $db = (new DB())->connect();
?>