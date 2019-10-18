<?php 

exit('text');

if (true) {
    $img = $db->getImage(1);
    // specify header with content type,
    // you can do header("Content-type: image/jpg"); for jpg,
    // header("Content-type: image/gif"); for gif, etc.
    header("Content-type: image/jpg");
    
    //display the image data
    echo base64_encode($img);
    exit;
}

?>