# -*- coding: utf-8 -*-
import MySQLdb
import time
from time import gmtime, strftime

conn = MySQLdb.connect('localhost', 'root', '', 'projeto-bolsa') #Criando variavel para a coneçao com o banco de dados

cursor = conn.cursor() #Criando o cursor do banco de dados (permissão para executar comandos no banco de dados)

# Ler arquivo de log
wait_sec = 1
fname = "log.txt"
data_list_sensor = []
data_list_time_luz = []
data_list_luz = []
with open(fname, "r") as f:
    where = f.tell()
    while True:
        line = f.readline()
        if not line:
            time.sleep(wait_sec)
            f.seek(where)
        else:
            # Quebrar linha
            datas = line.split("/")
            luzes = datas[0].split()
            time_luz = datas[1].split()
            # Inserir no banco
            for indice, valor in enumerate(luzes):
                """
                    Percorro o array de luzes e verifica se o array temporario é maior do que ele, se for maior, é porque já temos um historico salvo,
                    então basta comparar com cada posição deste historico e, se diferente, atualizar no banco junto com o tempo de cada luz
                    *Não estou verificando se a quantidade de valor das luzes é igual a quantidade de luzes
                """
                if len(data_list_luz) > indice:
                    if not valor == data_list_luz[indice]:
                        cursor.execute("""UPDATE logluz SET LOG_DATA = %s, LOG_STATUS = %s WHERE LOG_IDLUZ = %s""",
                            (strftime("%d-%m-%Y %H:%M:%S", gmtime()), valor, str(indice + 1)))
                        conn.commit()
                        data_list_luz[indice] = valor
                if len(data_list_time_luz) > indice:
                    if not time_luz[indice] == data_list_time_luz[indice]:
                        cursor.execute("""UPDATE logluz SET LOG_DATA = %s, LOG_VALOR = %s WHERE LOG_IDLUZ = %s""",
                            (strftime("%d-%m-%Y %H:%M:%S", gmtime()), time_luz[indice], str(indice + 1)))
                        conn.commit()
                        data_list_time_luz[indice] = time_luz[indice]
                else:
                    cursor.execute("""INSERT INTO logluz (LOG_IDLUZ , LOG_DATA, LOG_VALOR, LOG_STATUS) VALUES (%s,%s,%s,%s)""",
                        (str(indice + 1), strftime("%d-%m-%Y %H:%M:%S", gmtime()), time_luz[indice], valor))
                    conn.commit()
                    data_list_luz.append(valor)
                    data_list_time_luz.append(time_luz[indice])
            sensors = datas[2].split()
            # Inserir no banco
            for indice, valor in enumerate(sensors):
                """
                    Percorro o array de sensore e verifica se o array temporario é maior do que ele, se for maior, é porque já temos um historico salvo,
                    então basta comparar com cada posição deste historico e, se diferente, atualizar no banco
                """
                if len(data_list_sensor) > indice:
                    if not valor == data_list_sensor[indice]:
                        cursor.execute("""UPDATE logsensor SET LOG_DATA = %s, LOG_VALOR = %s WHERE LOG_IDSENSOR = %s""",
                            (strftime("%d-%m-%Y %H:%M:%S", gmtime()), valor, str(indice + 1)))
                        conn.commit()
                        data_list_sensor[indice] = valor
                else:
                    cursor.execute("""INSERT INTO logsensor (LOG_IDSENSOR , LOG_DATA, LOG_VALOR) VALUES (%s,%s,%s)""",
                        (str(indice + 1), strftime("%d-%m-%Y %H:%M:%S", gmtime()), valor))
                    conn.commit()
                    data_list_sensor.append(valor)
