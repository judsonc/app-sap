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
        url: 'http://' + iplab + '/pds/getSensores.php',
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
            }, 3000);
        },
        timeout: 5000,
        error: function () {
            alert("Falha na conexão!\nTente novamente.");
            toggle("header");
            toggle("screenIndex");
            formSubmitLogin();
        }
    });
}
/* Get Luzes */
function getAllLuzes() {
    $.ajax({
        type: "POST",
        url: 'http://' + iplab + '/pds/getLuzes.php',
        crossDomain: true,
        cache: false,
        success: function (data) {
            var data = $.parseJSON(data);
            $("#allLuzes").html("");
            $.each(data, function (i, field) {
                $("#allLuzes").append(
                    "<tr class=\"" + setLuz(field.LOG_STATUS) + "\"><td>" + field.LOG_IDLUZ + "</td><td>" + field.LOG_VALOR + "</td></tr>"
                );
            });
        },
    });
}
/* Setar luz ativa */
function setLuz(status) {
    status = (status == 1) ? 'on' : '';
    return status;
    setTimeout(function () {
        setLuz(0);
    }, 1000);
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