(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
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
/* Variaveis globais */
var iplab = '';
/* Toggle mobile-menu */
$(document).ready(function () {
    $(".nav-toggle").on("click", function () {
        $(".menu").slideToggle();
        $(".bars-down").toggle();
        $(".bars-up").toggle();
    });
});
/* Testa Conexao */
function checkConnection() {
    if (navigator.network.connection.type == Connection.NONE) {
        alert('Você está desconectado!');
        screenErrorConnection();
    } else
        verifySession();
}
/* Verifica se sessao ja foi criada*/
function verifySession() {
    $.ajax({
        type: 'GET',
        url: 'http://judsonc.ejectufrn.com.br/sap/getLog.php',
        crossDomain: true,
        cache: false,
        dataType: 'text',
        data: 'uuid=' + device.uuid,
        success: function (result) {
            $('input[name=iplab]').val(result);
            formSubmitLogin();
        },
    });
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
        success: function (result) {
            var data = $.parseJSON(result);
            $("#allSensors").html("");
            $.each(data, function (i, field) {
                $("#allSensors").append(
                    "<li><a onclick=\"viewDetail(['Sensor','" + field.LOG_IDSENSOR + "'])\">" + field.LOG_VALOR + "</a></li>"
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
        success: function (result) {
            var data = $.parseJSON(result);
            $("#allLuzes").html("");
            $.each(data, function (i, field) {
                field.LOG_STATUS = (field.LOG_STATUS == 1) ? 'on' : '';
                $("#allLuzes").append(
                    "<li class=\"" + field.LOG_STATUS + "\"><a onclick=\"viewDetail(['Luz','"
                                   + field.LOG_IDLUZ + "'])\">" + field.LOG_VALOR + "s</a></li>"
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
        toggle("screenLogin");
        toggle("header");
        toggle("screenIndex");
        setSession();
        getAllSensors();
        return false;
    });
}
/* Display Descricao */
function viewDetail(data) {
    alert('Detalhe:\n' + data[0] + '  N° ' + data[1]);
}
/* Salva Sessao */
function setSession() {
    $.ajax({
        type: 'GET',
        url: 'http://judsonc.ejectufrn.com.br/sap/setLog.php',
        crossDomain: true,
        cache: false,
        dataType: 'text',
        data: 'uuid=' + device.uuid + '&ip=' + iplab,
    });
}
/* Tela de Erro de Conexao */
function screenErrorConnection() {
    $('body').addClass('error');
    toggle('screenLogin');
    toggle('formLogin');
    setTimeout(function () {
        toggle('errorDesconnected');
    }, 800);
}
/* Encerrar sessao */
function logout() {
    navigator.app.exitApp();
}