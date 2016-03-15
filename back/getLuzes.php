<?php
require_once("Dbcommand.class.php");

$numberSensor = Dbcommand::count_rows(Dbcommand::select("sensor", "ALL"));
$ret = Dbcommand::select("logluz", "ALL", "LIMIT $numberSensor");
$data = array();
while($row = Dbcommand::arrays($ret)){
    $data[] = $row;
}
echo json_encode($data);