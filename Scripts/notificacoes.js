var notificacoes = {

    init: function () {
        notificacoes.buscarNotificacao();
    },

    buscarNotificacao: function () {
        $.ajax({
            url: "/Gerenciamento/Notificacao/BuscarNotificacao",
            data: {},
            cache: false,
            dataType: 'json',
            type: "post",
            beforeSend: function () {
                Util.setLoad();
            },
            success: function (data) {

                if (data.success) {
                    notificacoes.aceiteObrigatorio(data.id, data.titulo, data.descricao, data.link)
                } else {

                }
            },
            error: function (data) {
                $('#load').remove();
                Util.fecharLoad();
            }
        });
    },
    aceiteObrigatorio: function (id, titulo, mensagem, link) {
        Util.abrirModal(titulo)

        $('.modal-header > button.close').hide(mensagem);

        $('.modal-body').html(mensagem);

        $('.modal-footer').html('<a href="/Gerenciamento/Notificacao/Index?Id=' + id + '">' + titulo + '</a>' +
            '<div class="custom-control custom-checkbox">' +
            '<input type="checkbox" class="custom-control-input nao Exibir"  id="naoExibir">' +
            '<label class="custom-control-label aceitarNotificacao" for="naoExibir" id="aceitar" onclick="notificacoes.aceitar(' + id + ')">' + link + '</label>' +
            '</div >');
    },

    aceitar: function (id) {
        $.ajax({
            url: "/Gerenciamento/Notificacao/Gravar",
            data: { IdNotificacao: id },
            cache: false,
            dataType: 'json',
            type: "post",
            beforeSend: function () {
            },
            success: function (data) {
                $('#modal').modal('toggle');
            },
            error: function (data) {
                $('#load').remove();
                Util.fecharLoad();
            }
        });

    },
}

$(function () {
    notificacoes.init();
});

