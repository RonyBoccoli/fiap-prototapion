if (!Util) {

    var Util = {

        CarregaCombo: function (id, url, done) {
            return Util.CarregaCombo2(id, url, done, null, "POST");
        },
        CarregaCombo2: function (id, url, done, error, method) {
            if (error === null)
                error = Util.ExibeErro;

            if (method === undefined) {
                method = "POST";
            }

            $.ajax({
                url: url,
                data: null,
                cache: false,
                type: method,
                success: function (data) {
                    if (data) {
                        var markup = "";
                        var records = [];
                        data.forEach(function (itm) { records.push([itm.Key, itm.Value]); });
                        records.forEach(function (itm) {
                            markup += '<option value="{0}">{1}</option>'.replace(/{(\d+)}/g,
                                function (match, number) {
                                    return typeof itm[number] !== "undefined" ? itm[number] : match;
                                });
                        });

                        $("#" + id).html(markup);
                    }
                    if (done) done();
                },
                error: function (response) {
                    error("O servidor retornou o erro '" + response.statusText + "...' ao realizar esta consulta.");
                }
            });
        },

        ExibeErro: function (mensagem) {

            if (mensagem) {
                console.log('mensagem ' + mensagem);
                swal("Erro", mensagem, "error");
            }
            
        },
        ExibeConfime: function (mensagem) {
            return Util.ExibeConfime2(mensagem, null);
        },
        ExibeConfime2: function (mensagem, callback) {
            swal({
                title: mensagem,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
            }).then(function (result) {
                if (callback !== undefined)
                    callback(result.value);
            });
        },

        ExibeSucesso: function (mensagem) {
            return Util.ExibeSucesso2(mensagem, arguments.length > 1 ? arguments[1] : null);
        },
        ExibeSucesso2: function (mensagem, callback) {
            swal({
                html: mensagem,
                type: 'success',
                showCancelButton: false,
                showConfirmButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ok'
            }).then(function (result) {
                if (callback)
                    callback();
            });
        },
        ExibeAlerta: function (mensagem) {
            return this.ExibeAlerta2(mensagem, null);
        },
        ExibeAlerta2: function (mensagem, callback) {
            swal("Atenção", mensagem, "warning");
        },
        InfiniteScroll: function (getData) {
            getData();

            $(window).scroll(function () {
                if ($(window).scrollTop() ===
                    $(document).height() - $(window).height()) {

                    getData();
                }
            });
        },
        ExibirToolTip: function () {
            $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
        },
        CopiarLink: function () {
            var clipboard = new Clipboard('a[name="copiar-link"]');
            clipboard.on('success', function (e) {
                Util.ExibeSucesso('Link copiado');
            });
            clipboard.on('error', function (e) {
                //console.log(e);
            });
        },
        abrirModal: function (titulo) {
            $('#modal').modal({ backdrop: 'static', keyboard: false });
            $('#modal').modal('show');
            $('.modal-title').html(titulo);
        },
        htmlModal: function (conteudo) {
            $('.modal-body').html(conteudo);
        },
        prependModal: function (conteudo) {
            $('.modal-body').find('.alert-danger').parent().parent().remove();
            $('.modal-body').prepend(conteudo);
        },
        insertLoad: function (titulo) {
            $('.modal-body').html('<div class="row"><div class="col-lg-12 text-center"><img src="/Images/_load.gif" /><br><h3>' + titulo + '</h3></div></div>');
        },
        insertAlert: function (classe, titulo) {
            $('.modal-body').html('<div class="row"><div class="col-lg-12"><div class="alert ' + classe + '">' + titulo + '</div></div></div>');
        },
        insertImagePreview: function (src) {
            var html = '<div class="row"><div class="col-lg-12 text-center"><img src="' + src + '" class="img-preview"/></div></div>';
            Util.htmlModal(html);
        },
        abrirLoad: function (titulo) {
            if (!$('#modalLoad').hasClass('in')) {
                $('#modalLoad').modal({ backdrop: 'static', keyboard: false });
                $('#modalLoad').modal('show');
            }
        },
        fecharLoad: function (conteudo) {
            $('#modalLoad').modal('hide');
        },
        appendLoad: function (conteudo) {
            $('#modalLoad').find('.alert-danger').remove();
            $('#modalLoad').append(conteudo);
        },
        setLoad: function () {
            $(".div-list").html('<div id="load" class="col-lg-12 text-center"><img width="150" height="150" src="/Images/_load.gif"/></div>');
        },
        unsetLoad: function () {
            $(".div-list").html('');
        },
        usaCheckboxComCss: function (elem, classOn, classOff) {
            var $i = $("<i data-embeddedEvent='checkBoxClick'/>").addClass("fa").addClass(elem.attr('checked') ? classOn : classOff);
            var $span = $("<span class='check-group'/>").append($i);
            $span.data["classOn"] = classOn;
            $span.data["classOff"] = classOff;
            $span.insertAfter(elem);
            return $span.append(elem);
        },
        checkBoxClick: function (e) {
            var $checkbox = $(this).next();
            var attr = $checkbox.attr('checked');
            Util.CheckBoxValue($checkbox, !(typeof attr !== typeof undefined && attr !== false));
        },
        CheckBoxValue: function ($el, value) {
            var $span = null;
            if ($el.hasClass('check'))
                $span = $el.prev();
            if (value) {
                $el.attr('checked', 'checked');
                if ($span) {
                    $span.removeClass($span.parent().data["classOff"]).addClass($span.parent().data["classOn"]);
                }
            } else {
                $el.removeAttr('checked');
                if ($span) {
                    $span.removeClass($span.parent().data["classOn"]).addClass($span.parent().data["classOff"]);
                }
            }
        },
        ValidaUrl: function (url) {
            var isValid = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url || "");
            return isValid;
        },
        dataFormatada: function(data) {
            var data = new Date(data),
            dia = data.getDate().toString(),
            diaF = (dia.length == 1) ? '0' + dia : dia,
            mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
            mesF = (mes.length == 1) ? '0' + mes : mes,
            anoF = data.getFullYear();
            return diaF + "/" + mesF + "/" + anoF;
        },
        CriarOptgroup: function (selectEl) {
            var groups = {};
            $(selectEl + " option").each(function () {
                const innerHtml = $(this).html();
                var splittedHtml = innerHtml.split('/');
                var group = 'Outros';
                if (splittedHtml && splittedHtml.length > 1) {
                    group = splittedHtml[0];
                    $(this).html(innerHtml.substr(group.length + 1, innerHtml.length));
                }
                $(this).attr('data-optgroup', group);
                groups[group] = true;
            });
            $.each(groups, function (c) {
                $(selectEl + " option[data-optgroup='" + c + "']").wrapAll('<optgroup label="' + c + '">');
            });
        }
    };

}

(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    $(".check").each(function () {
        Util.usaCheckboxComCss($(this), "fa fa-toggle-on", "fa fa-toggle-off");
    });

    $("body").on('click', '[data-embeddedEvent]', function (e) {
        if (Util[$(e.target).data('embeddedevent')])
            Util[$(e.target).data('embeddedevent')].apply(this, [e]);
    });

    $.fn.isInViewport = function () {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    $.fn.createModal = function (context, id, title, content) {
        return context.append($("<div>").addClass("modal").attr("tabIndex", "-1").attr("role", "dialog").attr("id", id)
            .append($("<div>").addClass("modal-dialog").attr("role", "document")
                .append($("<div>").addClass("modal-content")
                    .append($("<div>").addClass("modal-header")
                        .append($("<h5>").addClass("modal-title").html(title))
                        .append($("<button>").addClass("close").attr("type", "button").attr("data-dismiss", "modal").attr("aria-label", "Close")
                            .append($("<span>").attr("aria-hidden", "true").html("&times;"))
                        )
                    )
                    .append($("<div>").addClass("modal-body").html(content))
                    .append($("<div>").addClass("modal-footer")
                        .append($("<button>").addClass("btn btn-secondary").attr("type", "button").attr("data-dismiss", "modal").html("Fechar"))
                    )
                )
            )
        );
    };
})(jQuery);

if (!String.prototype.format) {
    // ReSharper disable once NativeTypePrototypeExtending
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != "undefined"
                ? args[number]
                : match
                ;
        });
    };
}

if (!String.prototype.formatObj) {
    // ReSharper disable once NativeTypePrototypeExtending
    String.prototype.formatObj = function () {
        var args = arguments;
        return this.replace(/{([^\}]+)}/g, function (match, number) {
            const key = Object.keys(args[0]).indexOf(match.replace("{", "").replace("}", ""));
            var values = Object.keys(args[0]).map(function (e) {
                return args[0][e];
            });

            result = typeof key != "undefined" ? values[key] : "Não Encontrado";
            result = result + "";

            return result == undefined ? "" : ((result.indexOf("/Date") == -1 ? false : true)
                ? (new Date(parseInt(result.replace(/[^0-9 +]/g, "")))).toLocaleDateString("pt-BR")
                : result); 
        });
    };

    // ReSharper disable once NativeTypePrototypeExtending
    String.prototype.formatObjEncoded = function () {
        var args = arguments;
        return this.replace(/{([^\}]+)}/g, function (match, number) {
            const key = Object.keys(args[0]).indexOf(match.replace("{", "").replace("}", ""));

            var values = Object.keys(args[0]).map(function (e) {
                return args[0][e];
            });

            result = typeof key != "undefined"
                ? removerAcentos(values[key])
                : "Não Encontrado";

            result = result + "";
            
            return result == "Não Encontrado" ? "" : ((result.indexOf("/Date") == -1 ? false : true)
                ? (new Date(parseInt(result.replace(/[^0-9 +]/g, "")))).toLocaleDateString("pt-BR") 
                : result);

        });
    };
    
    function removerAcentos(s) {

        return s.replace(/[\W\[\] ]/g, function (a) {
            map = { "â": "a", "Â": "A", "à": "a", "À": "A", "á": "a", "Á": "A", "ã": "a", "Ã": "A", "ê": "e", "Ê": "E", "è": "e", "È": "E", "é": "e", "É": "E", "î": "i", "Î": "I", "ì": "i", "Ì": "I", "í": "i", "Í": "I", "õ": "o", "Õ": "O", "ô": "o", "Ô": "O", "ò": "o", "Ò": "O", "ó": "o", "Ó": "O", "ü": "u", "Ü": "U", "û": "u", "Û": "U", "ú": "u", "Ú": "U", "ù": "u", "Ù": "U", "ç": "c", "Ç": "C" };
            return map[a] || a;
        })
    };

}