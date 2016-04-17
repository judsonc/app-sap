(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.

        var dbSize = 3 * 1024 * 1024; // 3MB 
        db = openDatabase("db.sql", "", "dbmanager", dbSize, function () {
            alert('db successfully opened or created');
        });
        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS tab_ip (id INTEGER, ip TEXT)", []);
            tx.executeSql('SELECT * FROM tab_ip LIMIT 1', [], function (tx, res) {
                if (JSON.stringify(res.rows[0].id) == null) {
                    tx.executeSql("INSERT INTO tab_ip (id, ip) VALUES (?,?)", ['1', '']);
                }
            });
            tx.executeSql('SELECT * FROM tab_ip LIMIT 1', [], function (tx, res) {
                $('input[name=iplab]').val(JSON.parse(JSON.stringify(res.rows[0].ip)));
            });
        });
        checkConnection();
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
        checkConnection();
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
        checkConnection();
    };
})();
/* Variáveis globais */
var db;
var iplab = '';
/* Toggle mobile-menu */
$(document).ready(function () {
    $(".nav-toggle").on("click", function () {
        $(".menu").slideToggle();
        $(".bars-down").toggle();
        $(".bars-up").toggle();
    });
});
/* testar conexão */
function checkConnection() {
    if (navigator.network.connection.type == Connection.NONE) {
        alert('Você está desconectado!');
        screenErrorConnection();
    } else
        formSubmitLogin();
}
/* Habilitar displays - Views */
function toggle(divid) {
    if (document.getElementById(divid).style.display == "none")
        document.getElementById(divid).style.display = "block";
    else
        document.getElementById(divid).style.display = "none";
}
/* Get Sensores */
function getAllSensors() {
    getAllLuzes();
    $.ajax({
        type: "POST",
        url: 'http://' + iplab + '/sap/getSensores.php',
        crossDomain: true,
        cache: false,
        success: function (data) {
            var data = $.parseJSON(data);
            $("#allSensors").html("");
            $.each(data, function (i, field) {
                $("#allSensors").append(
                    "<li><span>" + field.LOG_VALOR + "</span></li>"
                );
            });
            setTimeout(getAllSensors, 2000);
        },
        timeout: 5000,
    });
}
/* Get Luzes */
function getAllLuzes() {
    $.ajax({
        type: "POST",
        url: 'http://' + iplab + '/sap/getLuzes.php',
        crossDomain: true,
        cache: false,
        success: function (data) {
            var data = $.parseJSON(data);
            $("#allLuzes").html("");
            $.each(data, function (i, field) {
                field.LOG_STATUS = (field.LOG_STATUS == 1) ? 'on' : '';
                $("#allLuzes").append(
                    "<li class=\"" + field.LOG_STATUS + "\"><span>" + field.LOG_VALOR + "</span></li>"
                );
            });
        },
        error: function () {
            alert("Falha na conexão!\nTente novamente.");
            document.location.href = 'index.html';
        },
        timeout: 4000,
    });
}
/* Processar formulario */
function formSubmitLogin() {
    toggle('screenLogin');
    $('#formLogin').submit(function () {
        iplab = $('input[name=iplab]').val();
        if (iplab == '') {
            alert('Digite um IP válido!');
        } else {
            db.transaction(function (tx) {
                tx.executeSql("UPDATE tab_ip SET ip=? WHERE id=1", [iplab]);
            });
            toggle("screenLogin");
            toggle("header");
            toggle("screenIndex");
            getAllSensors();
        }
        return false;
    });
}
/* Tela de Erro de Conexão */
function screenErrorConnection() {
    $('body').addClass('error');
    toggle('screenLogin');
    toggle('formLogin');
    setTimeout(function () {
        toggle('errorDesconnected');
    }, 800);
}
/* Encerrar sessão */
function logout() {
    navigator.app.exitApp();
}