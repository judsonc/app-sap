<?php

/**
 * @brief Classe Connection
 *     faz a interação com o banco de dados, executando query SQL e retornando o que foi solicitado ao banco.
 *
 * @copyright \htmlonly<a href="https://github.com/judsonc">Judson Costa</a> e <a href="https://github.com/LeonardoJunio">Leonardo Junio</a>\endhtmlonly
 */
abstract class Connection {
    private static $hostname = 'localhost';  /**< Nome do host (padrao = 'localhost') */
    private static $username = 'root';         /**< Nome do usuario */
    private static $password = '';                /**< Senha do usuário */
    private static $dbname = 'projeto-bolsa';      /**< Nome do banco de dados a ser utilizado */
    protected static $conn;                          /**< Armazena a conexão com o banco de dados */

    /**
     * @brief Function connect
     *      realiza a conexao.
     *      Utiliza strings: hostname, username, password e dbname, usando banco de dados 'mysqli', além de checar a conexao e seta-la no atributo 'conn'.
     * @param void
     * @return void
     */
    private static function connect() {
        $conn = new mysqli(self::$hostname, self::$username, self::$password, self::$dbname);
        if ($conn->connect_error) {
            die("<hr> Connection failed: " . $conn->connect_error);
        }
        self::$conn = $conn;
    }

    /**
     * @brief Function execute
     *      executa a query SQL no banco de dados e returna seu resultado.
     * @param query SQL a ser solicitado ao banco de dados
     * @return array com os dados retornado do banco de dados
     */
    protected static function execute($query) {
        if (empty(self::$conn) || !isset(self::$conn)) {
            Connection::connect();
        }
        $result = self::$conn->query($query);
        if (!$result) {
            echo "<hr> Error creating database: " . self::$conn->error;
        } else {
            return $result;
        }
    }

    /**
     * @brief Function close
     *      fecha a conexão com o banco de dados.
     * @param void
     * @return void
     */
    public static function close() {
        mysqli_close(self::$conn);
    }
}