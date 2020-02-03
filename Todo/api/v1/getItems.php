<?php
    $file = file_get_contents('../../todos.json');     
    $file = json_decode($file,TRUE);

    echo json_encode($file);
?>