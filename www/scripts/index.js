(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();
/* Variáveis globais */
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
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    checkConnection();
}
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
                    "<tr><td>" + field.LOG_IDSENSOR + "</td><td>" + field.LOG_VALOR + "</td></tr>"
                );
            });
            setTimeout(function () {
                getAllSensors();
            }, 2000);
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
                    "<tr class=\"" + field.LOG_STATUS + "\"><td>" + field.LOG_IDLUZ + "</td><td>" + field.LOG_VALOR + "</td></tr>"
                );
            });
        },
        error: function () {
            alert("Falha na conexão!\nTente novamente.");
            document.location.href = 'index.html';
        },
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
            toggle("screenLogin");
            getAllSensors();
            toggle("header");
            toggle("screenIndex");
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