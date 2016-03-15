<?php
require_once("Connection.class.php");

/**
 * @brief Classe Dbcommand
 *      gera todas as query SQL e já as executa, além de formatar o seu retorno da execução.
 *      Também tem alguns outros métodos que são bem utéis.
 * @bug O metodo Select só gera query para condicionais AND, deixando de fora os demais condicionais (OR, NAND, NOR, etc).
 *
 * @copyright \htmlonly<a href="https://github.com/judsonc">Judson Costa</a> e <a href="https://github.com/LeonardoJunio">Leonardo Junio</a>\endhtmlonly
 */
abstract class Dbcommand extends Connection {

    /**
     * @brief Function select
     *      seleciona todo o Banco de dados de acordo com as colunas e valores passados.
     *      Caso queira selecionar tudo, passa-se tudo como parametro,
     *      assim como demais complementos, retornando um array pronto pra ser separado
     * @param string Nome da tabela, array Dados ('Coluna' => "Valores") || string 'ALL', string Complementos (Ex: ORDER BY, LIMIT) || default = ''
     * @return array Result
     */
    public static function select($table, $where, $more = '') {
        if ('ALL' === $where || array('ALL') === $where) {
            $sql = "SELECT * FROM $table";
        } else {
            $sql = "SELECT * FROM $table WHERE";
            foreach ($where as $column => $value) {
                $sql .= " AND $column = '$value'";
            }
            $sql = preg_replace("/AND/", "", $sql, 1); // Retira o primeiro AND
        }
        $sql .= " " . $more;
        return Dbcommand::execute($sql);
    }

    /**
     * @brief Function insert
     *      insere no Banco de dados.
     * @param string Nome da tabela, array Colunas, array Valores
     * @return array Result
     */
    public static function insert($table, $column, $value) {
        if (count($value) === count($column)) {
            $sql = "INSERT INTO $table ($column[0]";
            for ($i = 1; $i < count($column); $i++) {
                $sql = $sql . ", $column[$i]";
            }
            $sql = $sql . ") VALUES ('$value[0]'";
            for ($i = 1; $i < count($column); $i++) {
                $sql = $sql . ", '$value[$i]'";
            }
            $sql = $sql . ")";
        }
        return Dbcommand::execute($sql);
    }

    /**
     * @brief Function update
     *      atualiza os valores no Banco de dados, precisando dos novos valores e de um condicional para especifica quais linhas serão atualizadas.
     * @param string Nome da tabela, array Dados ('Coluna' => "Valores"), array Where ('Coluna' => "Valores")
     * @return array Result
     */
    public static function update($table, $data, $where) { //where = ''
        $sql = "UPDATE $table SET";
        foreach ($data as $column => $value) {
            $sql .= " $column = '$value',";
        }
        $sql = substr_replace($sql, '', -1); // Retira a ultima virgula
        $sql .= " WHERE"; // Pode colocar uma condicao pra adicionar where se tiver passado, pois assim dá erro caso nao tenha where, porem previne erros
        foreach ($where as $column => $value) {
            $sql .= " AND $column = '$value'";
        }
        $sql = preg_replace("/AND/", "", $sql, 1); // Retira o primeiro AND
        return Dbcommand::execute($sql);
    }

    /**
     * @brief Function delete
     *      deleta o pedido do banco de dados.
     * @param string Nome da tabela, array Where ('Coluna' => "Valores")
     * @return array Result
     */
    public static function delete($table, $where) {
        $sql = "DELETE FROM $table WHERE";
        foreach ($where as $column => $value) {
            $sql .= " AND $column = '$value'";
        }
        $sql = preg_replace("/AND/", "", $sql, 1); // Retira o primeiro AND
        return Dbcommand::execute($sql);
    }

    /**
     * @brief Function anti_injection
     *      limpa a string passada de injection, ou seja, barra todos os acentos.
     * @param string
     * @return string
     */
    private static function anti_injection($sql) {
        $mysqli = self::$conn;
        $sql2 = $mysqli->real_escape_string($sql);
        return $sql2;
    }

    /**
     * @brief Function post
     *      trata os dados passado pelo POST daquele campo retornando uma string anti SQL injection.
     * @param string
     * @return string
     */
    public static function post($name) {
        $name = @$_POST[$name];
        $name = Dbcommand::anti_injection($name);
        return $name;
    }

    /**
     * @brief Function get
     *      retorna os dados passado pelo GET daquele campo.
     * @param string
     * @return string
     */
    public static function get($name) {
        $name = @$_GET[$name];
        return $name;
    }

    /**
     * @brief Function rows
     *      quebra a string retornada do banco em um array.
     * @param string
     * @return array
     */
    public static function rows($result) {
        $row = $result->fetch_assoc();
        return $row;
    }

    /**
     * @brief Function arrays
     *      quebra a string retornada do banco em um array.
     * @param string
     * @return array
     */
    public static function arrays($result) {
        $array = $result->fetch_array();
        return $array;
    }

    /**
     * @brief Function count_rows
     *      retorna a quantidades de elementos no array.
     * @param array
     * @return int
     */
    public static function count_rows($result) {
        $number = $result->num_rows;
        return $number;
    }

    /**
    * @brief Function getServer
    *       retorna a url do servidor que se encontra o site juntamente com o diretório setado manualmente na propria funcao.
    *       O nome da pasta é pego através do comando "getcwd", que retorna toda a url da pasta,
    *       após isso eu a explodo e pego o quarto indice, que é o diretorio da raiz do site, um acima da raiz do server.
    * @param void
    * @return string
    */
    public static function getServer(){
        $url = explode("/",getcwd());
        $server = "http://" . $_SERVER['HTTP_HOST'] . "/" . $url[4];    /*     Diretorio da index      */
        return $server;
    }

     /**
    * @brief Function getPath
    *       retorna o nome do diretorio de acordo com a pasta do servidor que se encontra o arquivo.
    *       O nome da pasta é pego através do comando "getcwd", que retorna toda a url da pasta, após isso eu a explodo e pego o penultimo indice, que é o diretorio.
    * @param void
    * @return string
    */
    public static function getPath(){
        $url = explode("/",getcwd());
        $path = $url[count($url) - 1];
        $dir_atual = ($path == "site") ? "home" : $path;
        return $dir_atual;
    }

    /**
    * @brief Function getTitle
    *       retorna o titulo da página de acordo com a pasta do servidor que se encontra o arquivo.
    *       O nome da pasta é pego através do comando "getcwd", que retorna toda a url da pasta, após isso eu a explodo e pego o penultimo indice, que é o diretorio.
    * @param void
    * @return string
    */
    public static function getTitle(){
        $url = explode("/",getcwd());
        $path = $url[count($url) - 1];
        $title = ($path == "site") ? "início" : $path;
        $title = ($title == "servicos") ? str_replace('c', 'ç', $title) : $title;
        return $title;
    }
}