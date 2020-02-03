<?php
    $id = $_POST['id'];
    $text = $_POST['text'];
    $checked = $_POST['checked'];

    $arr = array('ok' => true);

    echo json_encode($arr);
?>