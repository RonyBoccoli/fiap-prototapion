var CropAjax = (function () {

    function output(node) {
        var existing = $('#result .croppie-result');
        if (existing.length > 0) {
            existing[0].parentNode.replaceChild(node, existing[0]);
        }
        else {
            $('#result')[0].appendChild(node);
        }
    }

    function cropUpload(redirectOnSuccess) {
        var $uploadCrop;
        var blob = null;
        
        function readFile(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('.upload-demo').addClass('ready');
                    $uploadCrop.croppie('bind', {
                        url: e.target.result
                    })
                }
                reader.readAsDataURL(input.files[0]);
            }
            else {
                //swal("Seu navegador não possuei suporte para esse dados");
            }
        }

        $uploadCrop = $('#upload-demo').croppie({
            viewport: {
                width: 300,
                height: 200,
            },
            boundary: {
                width: 450,
                height: 350
            },
            enableOrientation: true,
            enforceBoundary: false,
            minZoom: 0.0,
            maxZoom: 2.4,
            update: function (resp) {
                $uploadCrop.croppie('result', {
                    type: 'canvas'
                }).then(function (resp) {
                    $('#img-preview').attr('src', resp);
                });
                $uploadCrop.croppie('result', {
                    type: 'blob'
                }).then(function (resp) {
                    blob = resp;
                    $('#imgPreview').attr('src', URL.createObjectURL(blob));
                });
            },
            enableExif: true
        });

        $('#upload').bind('load change', function () { readFile(this); });
        $('.upload-result').on('click', function (ev) {
            $uploadCrop.croppie('result', {
                type: 'canvas',
                size: 'viewport',
                enableOrientation: true,
                enforceBoundary: false,
                minZoom: 0.4,
                maxZoom: 2.4,
            }).then(function (resp) {

            });
        });

        $('.gravar').on('click', function (e) { gravar() });

        $('#buscar_logo').on('click', function () {
            $('#upload').click();
        });

        function gravar() {
            $('#gravar').prop("disabled", true);
            var html = "";
            var formData = new FormData();
            var formulario = $("#form-novo-corretor");
            var formSerialize = formulario.serializeArray();

            $(formSerialize).each(function (index, element) {
                formData.append(element.name, element.value);
            });

            var file = $("#upload").val(); 

            if (blob != null && file != '') {
                formData.append('Arquivo', blob);
                html = "Logo cadastrado com sucesso, agora o logo passar&aacute; por aprova&ccedil;&atilde;o e logo voc&ecirc; ser&aacute; notificado sobre a conclus&atilde;o.";
            } else {
                html = "Cadastro salvo com sucesso."; 
            }

            try {

                validarFormulario(formData);

			    $.ajax({
				    url: '/Corretores/Cadastro/Criar',
				    data: formData,
				    cache: false,
				    contentType: false,
				    processData: false,
				    type: "POST",
                    beforeSend: function () {
                        toastr.info('Carregando Imagem', '', { timeOut: 50000 });
				    },
                    success: function (data) {
                        if (data.success) {
                            toastr.clear();
                            toastr.success(html);
                            setTimeout(function () {
                                location.href = redirectOnSuccess;
                            }, 250);
                        } else {
                            toastr.clear();
                            toastr.error(data.responseText, 'Aten&ccedil;&atilde;o', { timeOut: 5000 });
                            $('#gravar').prop("disabled", false);
                        }
				    },
				    error: function (response) {
                        toastr.error("O servidor retornou o erro '" + response.statusText + "...' ao realizar esta consulta.", '', { timeOut: 5000 });
                        $('#gravar').prop("disabled", false);
				    }
                });
            } catch (e) {
                toastr.error(e, '', { timeOut: 5000 });
                $('#gravar').prop("disabled", false);
			    return;
		    }
        }

        function validarFormulario(formData) {

            var messages = new Array();

            var requiredFields = {
                NomeFantasia: 'NOME FANTASIA',
                Email: 'EMAIL',
                Nome: 'NOME',
                Telefone1: 'TELEFONE 1',
                TipoTelefone1: 'TIPO TELEFONE 1',
                Telefone2: 'TELEFONE 2',
                TipoTelefone2: 'TIPO TELEFONE 2',
                idFilialCorretor: 'FILIAL DO CORRETOR'
            };

            var fileTypes = ['image/png', 'image/jpeg', 'image/jpg'];

            for (key in requiredFields) {
                var name = requiredFields[key];
                if ($("[name=" + key + "]").val() == "") {
                    // alert-validate
                    $('[name=\'' + key + ']').parent('.wrap-input100').addClass('alert-validate');
                    messages.push(name);
                }
            }

            if (messages.length == 1) {
                modal.style.display = "none";
                throw "O campo " + messages.join('') + " &eacute; obrigat&oacute;rio";
            }
            else if (messages.length > 1) {
                modal.style.display = "none";
                throw "Os campos " + messages.join(', ') + " s&atilde;o obrigat&oacute;rios";
            }
            
            if (blob != null) {
                input = document.getElementById('upload');
                if (input.files.length > 0) {
                    if (fileTypes.indexOf(input.files[0].type) === -1) {
                        throw "O formato da imagem deve ser .JPG ou .PNG";
                    }
                }
            }
        }
    }

    function init(data) {
        cropUpload(data.location);
	}

	return {
		init: init
	};
})();


// Full version of `log` that:
//  * Prevents errors on console methods when no console present.
//  * Exposes a global 'log' function that preserves line numbering and formatting.
(function () {
  var method;
  var noop = function () { };
  var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});
 
  while (length--) {
    method = methods[length];
 
    // Only stub undefined methods.
    if (!console[method]) {
        console[method] = noop;
    }
  }
  
  if (Function.prototype.bind) {
    window.log = Function.prototype.bind.call(console.log, console);
  }
  else {
    window.log = function() { 
      Function.prototype.apply.call(console.log, console, arguments);
    };
  }
})();
