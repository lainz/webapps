var app = new Vue({
    el: '#app',
    data: {
        titulo: 'Escribir al revés',
        texto: '',
        textoAlReves: '',
        tipos: ['De derecha a izquierda', 'De arriba hacia abajo', 'Ambos'],
        tipo: 0
    },
    methods: {
        voltear: function () {
            this.textoAlReves = this.texto.split('').map(value => {
                switch (value.toLowerCase()) {
                    case 'a': return 'ɐ';
                    case 'á': return 'ɐ';
                    case 'b': return 'q';
                    case 'c': return 'ɔ';
                    case 'd': return 'p';
                    case 'e': return 'ǝ';
                    case 'é': return 'ǝ';
                    case 'f': return 'ɟ';
                    case 'g': return 'ƃ';
                    case 'h': return 'ɥ';
                    case 'i': return 'ı';
                    case 'í': return 'ı';
                    case 'j': return 'ɾ';
                    case 'k': return 'ʞ';
                    case 'l': return 'l';
                    case 'm': return 'ɯ';
                    case 'n': return 'u';
                    case 'ñ': return 'u';
                    case 'o': return 'o';
                    case 'ó': return 'o';
                    case 'p': return 'd';
                    case 'q': return 'b';
                    case 'r': return 'ɹ';
                    case 's': return 's';
                    case 't': return 'ʇ';
                    case 'u': return 'n';
                    case 'ú': return 'n';
                    case 'v': return 'ʌ';
                    case 'w': return 'ʍ';
                    case 'x': return 'x';
                    case 'y': return 'ʎ';
                    case 'z': return 'z';
                    case '?': return '¿';
                    case '¿': return '?';
                    case '!': return '¡';
                    case '¡': return '!';
                    case '.': return '˙';
                    case ',': return '\'';
                    case '{': return '}';
                    case '}': return '{';
                    case '[': return ']';
                    case ';': return '؛';
                    case ' ': return ' ';
                }
            }).join('');
        },
        escribirAlReves: function () {
            switch (this.tipo) {
                case 0: {
                    this.textoAlReves = this.texto.split('').reverse().join('');
                    break;
                }
                case 1: {
                    this.voltear();
                    break;
                }
                case 2: {
                    this.voltear();
                    this.textoAlReves = this.textoAlReves.split('').reverse().join('');
                    break;
                }
            }

        },
        copiarTextoAlReves: function () {
            var txt = document.getElementById('texto');
            txt.select();
            document.execCommand("copy");
            M.Toast.dismissAll();
            M.toast({ html: '¡Copiado!', displayLength: 1000 });
        },
        cambiarTipo: function (indice) {
            this.tipo = indice;
            this.escribirAlReves();
        }
    }
})

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var options = {};
    var instances = M.Dropdown.init(elems, options);
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function () { console.log('Service Worker Registered'); });
}