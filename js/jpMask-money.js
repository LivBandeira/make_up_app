Object.prototype.setEvents = function() {
    var keyCodesP = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
        keyCodesE = [9, 35, 36, 37, 39, 45],
        inputMask = this.getAttribute("jp-mask"),
        onBlur = this.onblur,
        cursor, i;

    ({
        moeda: function(object) {
            var maxlength = object.getAttribute("maxlength"),
                casas = object.getAttribute("casas");

            casas = casas >= 2 ? parseInt(casas, 10) : 2;
            maxlength = maxlength ? maxlength : 20 + casas;

            String.prototype.stripLeftZeros = function() {
                for (i = 0; i < this.length; i++) {
                    if (this[i] != "0") {
                        return this.substring(i);
                    }
                }

                return "";
            };

            function format(value) {
                var newValue = "",
                    inteiro, decimal, j;

                while (value[0] == "0") {
                    if (value.length <= cursor) {
                        cursor--;
                    }

                    value = value.substr(1);
                }

                while (value.length < casas + 1) {
                    if (value.length <= cursor) {
                        cursor++;
                    }

                    value = "0" + value;
                }

                inteiro = value.substr(0, value.length - casas);
                decimal = value.substr(value.length - casas, casas);

                for (i = inteiro.length - 1, j = 0; i >= 0; i--, j++) {
                    if (j % 3 === 0 && j !== 0) {
                        if (newValue.length <= cursor) {
                            cursor++;
                        }

                        newValue = "," + newValue;
                    }

                    newValue = inteiro.charAt(i) + newValue;
                }

                if (newValue.length <= cursor) {
                    cursor++;
                }

                return newValue + "." + decimal;
            }

            object.onfocus = function() {
                var value = object.value;

                object.lastValue = value;
                object.value = format(value.toString().replace(/[^\d]+/g, ""), false);
            };

            object.onkeydown = function(event) {
                var keyCode = window.Event ? event.which : event.keyCode,
                    value = object.value,
                    selectionStart = object.selectionStart;

                if (event.ctrlKey === true) {
                    return true;
                }

                cursor = selectionStart - (value.substr(0, selectionStart).length - value.substr(0, selectionStart).toString().replace(/[^\d]+/g, "").length);
                value = value.toString().replace(/[^\d]+/g, "");
                keyCode = keyCode >= 96 && keyCode <= 105 ? keyCode - 48 : keyCode;

                if (keyCode == 8 || keyCode == 46) {
                    cursor -= keyCode == 8 ? 1 : 0;
                    value = value.substr(0, cursor) + value.substr(cursor + 1);

                    object.value = format(value, false);
                    object.selectionStart = cursor;
                    object.selectionEnd = cursor;

                    return false;
                }

                if (inArray(keyCode, keyCodesE)) {
                    return true;
                }

                if (value.length < maxlength && inArray(keyCode, keyCodesP)) {
                    value = value.substr(0, cursor) + String.fromCharCode(keyCode) + value.substr(cursor, value.length);
                    cursor++;

                    object.value = format(value);
                    object.selectionStart = cursor;
                    object.selectionEnd = cursor;

                    return false;
                }

                return false;
            };

            object.onpaste = function(event) {
                var clipboardData = window.clipboardData ? window.clipboardData.getData("text") : event.clipboardData.getData("text/plain"),
                    value = object.value,
                    selectionStart = object.selectionStart;

                clipboardData = clipboardData.toString().replace(/[^\d]+/g, "");
                cursor = selectionStart - (value.substr(0, selectionStart).length - value.substr(0, selectionStart).toString().replace(/[^\d]+/g, "").length);
                cursor += clipboardData.length;

                value = value.toString().replace(/[^\d]+/g, "");
                value = value.substr(0, cursor) + clipboardData + value.substr(cursor, value.length);

                if (value.length > maxlength) {
                    value = value.substr(0, maxlength);
                }

                object.value = format(value);
                object.selectionStart = cursor;
                object.selectionEnd = cursor;

                return false;
            };

            object.onblur = function() {
                var value = object.value = format(object.value.toString().replace(/[^\d]+/g, ""));

                if (onBlur) {
                    onBlur.call(this);
                }
            };
        }
    })[inputMask](this);
};

window.addEventListener("load", function() {
    (function() {
        var i;

        for (i = 0; i < this.length; i++) {
            this[i].setEvents();
        }
    }).call(document.querySelectorAll([
        "input[jp-mask='moeda']"
    ]));
}, false);

function inArray(value, array) {
    var i;

    for (i = 0; i < array.length; i++) {
        if (value == array[i]) {
            return true;
        }
    }

    return false;
}