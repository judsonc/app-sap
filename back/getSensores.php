<?php
require_once("Dbcommand.class.php");

/*
while (True) {
    sleep(1);
    $line = end(@file('log.txt'));
    $datas = explode("/", $line);
    foreach($datas as $data){
        $d = explode(" ", $data);
        foreach ($d as $value => $i){
            Dbcommand::insert("logsensor", ["LOG_IDSENSOR", "LOG_DATA", "LOG_VALOR"], [$value+1, $datas[0], $i]);
            echo $value. " | ". $i . "<hr>";
        }
    }
}
*/

$numberSensor = Dbcommand::count_rows(Dbcommand::select("sensor", "ALL"));

$ret = Dbcommand::select("logsensor", "ALL", "LIMIT $numberSensor");
$data = array();
while($row = Dbcommand::arrays($ret)){
    $data[] = $row;
}
echo json_encode($data);